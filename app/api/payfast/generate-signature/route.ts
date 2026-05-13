import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const generateSignature = (data: Record<string, string>, passPhrase: string | null = null): string => {
    // PayFast's REQUIRED parameter order. DO NOT sort alphabetically.
    const paramOrder = [
        "merchant_id",
        "merchant_key",
        "return_url",
        "cancel_url",
        "notify_url",
        "name_first",
        "name_last",
        "email_address",
        "cell_number",
        "m_payment_id",
        "amount",
        "item_name",
        "item_description",
        "custom_int1",
        "custom_int2",
        "custom_int3",
        "custom_int4",
        "custom_int5",
        "custom_str1",
        "custom_str2",
        "custom_str3",
        "custom_str4",
        "custom_str5",
        "email_confirmation",
        "confirmation_address",
        "payment_method",
    ];

    // Build the string in the correct order, filtering out empty/unused fields
    let stringToSign = paramOrder
        .filter(key => data[key] && key !== 'signature') // Key must exist and not be the signature itself
        .map(key => {
            // PayFast expects + for spaces, not %20
            const value = encodeURIComponent(data[key].trim()).replace(/%20/g, "+");
            return `${key}=${value}`;
        })
        .join("&");

    // Append passphrase if it exists
    if (passPhrase) {
        stringToSign += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }

    // Generate MD5 hash
    return crypto.createHash("md5").update(stringToSign).digest("hex");
};

export async function POST(request: NextRequest) {
    try {
        const clientData = await request.json(); // Receive cart data from client

        const isTesting = process.env.NEXT_PUBLIC_PAYFAST_TESTING === "true";
        const protocol = "https"; // Assuming https for production/sandbox
        const siteUrl = "www.modesecurity.co.za";

        // 1. Build the PayFast data object in the CORRECT order
        const payfastData: Record<string, string> = {
            merchant_id: process.env.PAYFAST_MERCHANT_ID!,
            merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
            return_url: `${protocol}://${siteUrl}/checkout/return`,
            cancel_url: `${protocol}://${siteUrl}/checkout/cancel`,
            notify_url: `${protocol}://${siteUrl}/api/payfast/notify`,
            name_first: clientData.firstName,
            name_last: clientData.lastName,
            email_address: clientData.email,
            m_payment_id: clientData.paymentId,
            amount: Number(clientData.amount).toFixed(2), // Ensure 2 decimal places
            item_name: clientData.itemName,
        };

        // Debug logging for signature components
        console.log("PayFast Data for Signature:", payfastData);
        console.log("PayFast Environment:", isTesting ? "Sandbox" : "Live");

        // Add optional fields if they exist
        if (clientData.cellNumber) {
            payfastData.cell_number = clientData.cellNumber;
        }

        // 2. Generate signature using the corrected function
        const signature = generateSignature(payfastData, process.env.PAYFAST_PASSPHRASE!);
        payfastData.signature = signature;

        // 3. Return the signed data to the client for form submission
        return NextResponse.json(payfastData);
    } catch (error) {
        console.error("Error generating PayFast signature:", error);
        return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
    }
}
