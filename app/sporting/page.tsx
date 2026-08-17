"use client"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AddtoCartButton from "@/components/AddToCartButton";



export default function Page() {
  const sport = useQuery(api.myFunctions.listCourses, { authority: "SPORT" });


  return (
    <div>
      {/* this is a hero section with all the offerings as well */}
      <div className="flex flex-col w-full items-center justify-center">

        <Image src="/hero/ClubShirt.png" alt="firearms" width={1000} height={800} className="w-full md:w-1/2 object-cover items-center" />

      </div>
      <div className="flex flex-col items-center bg-green p-4 gap-2 mb-2">
        <h1 className="text-white">Why Choose us?</h1>
        <p className="text-white">At Lusikisiki Hardcore Shooting Range, we stand out as the premier choice for individuals who are new to firearms or seeking to enhance their existing skills. With our extensive industry experience and years of honing our training process, we have mastered the art of making firearms education less intimidating. We provide a supportive and unintimidating environment that encourages continuous growth. Through our well-crafted sports and practice shooting sessions, we offer the perfect blend of theoretical knowledge and practical application. Whether you are a beginner or looking to further develop your skills, Lusikisiki Hardcore Shooting Range is your ideal partner on your journey to becoming a confident and proficient firearms handler.</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>20</h1>
          <p>years of experience</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>1000+</h1>
          <p>Successful firarm trainees</p>
        </div>
      </div>


      <div className="p-2">
        <div>
          <h1>Personal Protective Equipment</h1>
          <p>Here is a list of recommendations from one of our associates, verified and accredited with SAPS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {[
              "/sportingsupply/ppe/PPE_Combo.png",
              "/sportingsupply/ppe/ears/caldwellelectronic.png",

            ].map((src, index) => (
              <div key={index} className="relative w-full h-150">
                <Image
                  src={src}
                  alt={`Firearm ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1>Merchandise</h1>
          <p>Here is a special edition of our t-shirt designed for everyday wear</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {[
              "/sportingsupply/ClubShirt.png",

            ].map((src, index) => (
              <div key={index} className="relative w-full h-140">
                <Image
                  src={src}
                  alt={`Firearm ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1>Firearms</h1>
          <p>Here is a list of recommendations from one of our associates, verified and accredited with SAPS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {[
              "/sportingsupply/firearms/stark/hg.jpeg",
              "/sportingsupply/firearms/stark/hg2.jpeg",
              "/sportingsupply/firearms/stark/hg3.jpeg",
              "/sportingsupply/firearms/stark/hg4.jpeg",
              "/sportingsupply/firearms/stark/mor.jpeg",
              "/sportingsupply/firearms/stark/sg.jpeg",
            ].map((src, index) => (
              <div key={index} className="relative w-full h-110">
                <Image
                  src={src}
                  alt={`Firearm ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>




    </div>
  )
}