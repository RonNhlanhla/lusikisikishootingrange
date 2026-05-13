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
import { CheckCircle2 } from "lucide-react";


export default function Page() {
  const sport = useQuery(api.myFunctions.listCourses, { authority: "SPORT" });


  return (
    <div>
      {/* this is a hero section with all the offerings as well */}
      <div className="flex flex-col w-full items-center justify-center">

        <Image src="/club/knights_3.jpg" alt="firearms" width={1000} height={800} className="w-full md:w-1/2 object-cover items-center" />

      </div>
      <div className="flex flex-col items-center bg-green py-12 px-4 gap-8 mb-2 w-full">
        <div className="text-center space-y-3 max-w-3xl">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Why Join A Shooting Club?</h1>
          <p className="text-white/90 text-lg md:text-xl">Discover the exclusive benefits of joining a Registered Shooting Club</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
          {[
            "Regular Practice Sessions for friends & family",
            "Special Offers on Equipment",
            "Official Membership card and letter as required by SAPS for Section 16 (Dedicated Status) and Section 15(Occasional Status) licences",
            "Firearm Licences issued to dedicated members for a 10-year period instead of the standard 5 years",
            "Assistance with motivations for firearm licenses",
            "Discounted or free range use at our ranges",
            "Professional advice from our registered and advanced level instructors",
            "Firearm Skill Builder Programmes with certificates after every 2 sessions",
            "Regulations 21 included",
            "Motivation to acquire up to 3 additional firearms"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-gold shrink-0 mt-0.5" />
              <p className="text-white text-sm md:text-base leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 bg-gold/10 border border-gold/20 p-6 md:p-8 rounded-xl w-full max-w-3xl justify-center">
          <div className="text-center sm:text-right flex-1">
            <p className="text-white/80 text-sm uppercase tracking-wider font-semibold mb-1">Annual Fee</p>
            <p className="text-gold text-4xl font-bold">R1200</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-gold/30"></div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-white/80 text-sm uppercase tracking-wider font-semibold mb-1">Renewal</p>
            <p className="text-white text-3xl font-semibold">R1000 <span className="text-lg font-normal text-white/70">/ year</span></p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>20+</h1>
          <p>years of experience</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>4000+</h1>
          <p>Successful firearm trainees</p>
        </div>
      </div>

      <div className="p-2">
        <h1>Sports Shooting Membership</h1>
        <p>Become a member of our sports shooting club today and get the benefits of buying additional firearms to your self defense weapon. These can be used for sports and other legal activities.</p>
      </div>
      <div className="w-1/2 flex flex-col md:flex-row items-center justify-center gap-2">
        {sport?.map((course) => (
          <Card key={course._id} className="px-2">
            <CardTitle>
              <h2 className="text-lg font-bold py-2">{course.course_name}</h2>
            </CardTitle>
            <CardDescription>
              <p className="text-sm">{course.course_description}</p>
            </CardDescription>
            <CardFooter>
              <div className="w-full flex flex-row items-center justify-between">
                <p className="text-lg font-bold text-green">R{course.price}</p>
                <AddtoCartButton name={course.course_name} price={course.price} id={course._id} itemType="course" />
              </div>
            </CardFooter>
          </Card>

        ))}



      </div>




    </div>
  )
}