'use client';

import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import Cart from "./Cart";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

function HeaderAuth() {
  // Cart functionality is now handled by the Cart component

  return (
    <div className="w-full flex flex-row items-center gap-2 mx-2 my-2 justify-between">
      <div className="w-full flex flex-row items-center gap-2 justify-start">
        <Image src="/Logo.png" alt="Mode Logo" width={100} height={100} />
      </div>
      <Authenticated>
        <div className="w-full flex flex-row items-center gap-2 justify-end">
          <Cart />
          <SignOutButton />
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="w-full flex flex-row items-center gap-2 justify-end">
          <Link href="/sign-in">
            <Button>
              Sign in
            </Button>
          </Link>
        </div>
      </Unauthenticated>
    </div>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <Button
          variant="outline"
          onClick={() =>
            void signOut().then(() => {
              router.push("/sign-in");
            })
          }
        >
          Sign out
        </Button>
      )}
    </>
  );
}

export default HeaderAuth;