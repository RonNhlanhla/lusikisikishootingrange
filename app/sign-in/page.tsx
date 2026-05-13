"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignIn() {

  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <h1 className="text-xl font-black text-red">Log in to your account</h1>
      <Button onClick={() => void signIn("google")}>Sign in with Google</Button>
    </div>
  );
}