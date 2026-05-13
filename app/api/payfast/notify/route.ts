import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dns from "dns";

// Configure via env
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? null;
const PAYFAST_TESTING = process.env.NEXT_PUBLIC_PAYFAST_TESTING === "true";
const PF_HOST = PAYFAST_TESTING ? "sandbox.payfast.co.za" : "www.payfast.co.za";

// Helper: DNS lookup to get all A records for a domain
function ipLookup(domain: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, { all: true }, (err, addresses) => {
      if (err) return reject(err);
      const ips = addresses.map((a) => a.address);
      resolve(ips);
    });
  });
}

async function pfValidIP(req: NextRequest): Promise<boolean> {
  const validHosts = [
    "www.payfast.co.za",
    "sandbox.payfast.co.za",
    "w1w.payfast.co.za",
    "w2w.payfast.co.za",
  ];

  let validIps: string[] = [];
  try {
    for (const host of validHosts) {
      const ips = await ipLookup(host);
      validIps.push(...ips);
    }
  } catch (err) {
    console.error("PayFast IP lookup failed:", err);
  }

  const uniqueIps = Array.from(new Set(validIps));

  // Try standard headers for client IP behind proxies
  const forwardedFor = req.headers.get("x-forwarded-for");
  const remoteIp =
    forwardedFor?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-client-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "";

  return uniqueIps.includes(remoteIp);
}

function buildParamString(data: Record<string, string>, includePassphrase: boolean): string {
  const keys = Object.keys(data)
    .filter((k) => k !== "signature" && data[k] !== "" && data[k] !== undefined && data[k] !== null)
    .sort();

  const paramString = keys
    .map((key) => `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}`)
    .join("&");

  if (includePassphrase) {
    return `${paramString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE!.trim()).replace(/%20/g, "+")}`;
  }
  return paramString;
}

function validSignature(data: Record<string, string>): boolean {
  const paramString = buildParamString(data, PAYFAST_PASSPHRASE !== null);
  const signature = crypto.createHash("md5").update(paramString).digest("hex");

  // Debug logging
  console.log('=== PayFast Signature Validation ===');
  console.log('Received signature:', data["signature"] || "");
  console.log('Calculated signature:', signature);
  console.log('Param string:', paramString);
  console.log('Match:', (data["signature"] || "") === signature);
  console.log('===================================');

  return (data["signature"] || "") === signature;
}

export async function POST(req: NextRequest) {
  try {
    // PayFast sends application/x-www-form-urlencoded
    const formData = await req.formData();
    const data: Record<string, string> = {};
    for (const [k, v] of formData.entries()) {
      data[k] = typeof v === "string" ? v : (v as File).name;
    }

    // 1) Signature validation
    const sigOk = validSignature(data);
    if (!sigOk) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // 2) IP validation (best-effort; may fail behind some proxies)
    const ipOk = await pfValidIP(req);
    if (!ipOk) {
      // Log but do not necessarily fail hard in development
      console.warn("PayFast IP not in allowlist");
    }

    // 3) Optional: Amount validation - compare against your order total by m_payment_id
    // const orderId = data["m_payment_id"]; // look up expected total from DB, compare to amount_gross
    // if (Math.abs(expectedTotal - parseFloat(data["amount_gross"])) > 0.01) { ... }

    // 4) Optional: Server confirmation
    // Recommended to post paramString back to PayFast to validate ('VALID' expected)
    // Skipped here for brevity; implement using fetch to https://${PF_HOST}/eng/query/validate with the exact param string

    // TODO: Update your order status based on payment_status, etc.

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("PayFast notify handler error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
