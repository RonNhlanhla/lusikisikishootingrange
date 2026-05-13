import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Email() {
  return (
    <div className="bg-gray-100 p-8 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Interested in our training programs?</h2>
        <p className="mb-6 text-muted-foreground">Contact us for more information about our courses and enrollment process.</p>
        <Button asChild>
          <Link href="mailto:info@modesecurity.co.za">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}