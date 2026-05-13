'use client'
import Hero from "@/components/hero";
import ServicesTabs from "@/components/ui/ServicesTabs";
import { OfficeCards } from "@/components/ui/OfficesCards"
import CommonQuestions from "@/components/ui/CommonQuestions"
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'
/* 
  useEffect(() => {
    console.log("server identity", await ctx.auth.getUserIdentity());
  }; */

import MovingTextLine from "@/components/MovingTextLine";
import BackgroundVideo from "@/components/BackgroundVideo";

export default function Index() {
  return (
    <div>
      <BackgroundVideo />
      <head>
        <GoogleAnalytics gaId="AW-1008234503" />
      </head>

      <main className="flex flex-col gap-2 md:gap-4 lg:gap-4 items-center">


        <div className="w-full px-2">
          <Hero />
        </div>

        <div>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.9502403938654!2d28.077735076070535!3d-26.165749977100326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950db908ede2a1%3A0x25e4f6c126dcfc1e!2sMode%20Security%20%26%20Training%20Services!5e0!3m2!1sen!2sza!4v1773323022862!5m2!1sen!2sza" 
            width="800" 
            height="600" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="w-full">
          <MovingTextLine text="SHOOTING CLUB • SUPPLIES • FIREARM TRAINING • SECURITY SERVICES • PSIRA ACCREDITED • SASSETA CERTIFIED • NATIONAL REACH • FEMALE FOUNDED • PFTC ACCREDITED " />
        </div>
        {/* logo with stars */}
        <div className="w-1/2 flex flex-col items-center">

          <Image src="/Logo.png" alt="Mode Logo" width={500} height={500} />
        </div>

        <div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4 items-center justify-center">
            <div >
              <h1 className="px-2">ABOUT US</h1>
              <p className="px-2 tracking-tight">Welcome to Mode Security, a pioneering organization specializing in firearm training and security-related courses. Founded in 2002, we have established ourselves as a leader in the industry and are proud to be female-founded and led. Based in Johannesburg, South Africa, our reach extends across the nation, with offices in the Eastern Cape, Mpumalanga, and Gauteng.
                With a steadfast commitment to excellence, we have trained thousands of individuals under the auspices of esteemed certifications such as PFTC, SASSETA, and PSIRA. Our comprehensive training programs cater to a diverse range of needs, enabling individuals to start their journey from no qualifications and emerge as respected professionals in the industry.</p>

            </div>
            <div className="justify-items-center">
              <Image src="/cover.jpg" alt="About us" width={800} height={600} />
            </div>
          </div>
        </div>

        <div className="w-full px-4 py-2">
          <h1>SERVICES</h1>
          <ServicesTabs />
        </div>

        <div className="w-full px-4">
          <h1>OFFICES</h1>
          <OfficeCards />
        </div>

        <div className="w-full flex-col px-4">
          <h1>COMMONLY ASKED QUESTIONS</h1>
          <CommonQuestions />
        </div>


      </main>
    </div>
  );
}
