'use client'
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
  const skillsprograms = useQuery(api.myFunctions.listCourses, { authority: "SASSETA" });
  const specialist = useQuery(api.myFunctions.listCourses, { authority: "SASSETA-SPE" });
  const national = useQuery(api.myFunctions.listCourses, { authority: "SASSETA-NA" });
  const specialevent = useQuery(api.myFunctions.listCourses, { authority: "SASSETA-ES" });
  const general = useQuery(api.myFunctions.listCourses, { authority: "SASSETA-GSP" });

  return (
    <div>
      {/* Hero section */}
      <div className="w-full flex items-center justify-center">
        <Image 
          src="/training/sasseta/SASSETA-Values-Infographic-1.png" 
          alt="Security guard training" 
          width={400} 
          height={400} 
          className="items-center" 
        />
      </div>

      {/* About section */}
      <div className="flex flex-col items-center bg-green p-4 gap-2 mb-2">
        <h1 className="text-white text-xl font-bold">Why train with us?</h1>
        <p className="text-white text-center">
          At Mode Security, we stand out as the premier choice for individuals who are new to security training 
          or seeking to enhance their existing skills. With our extensive industry experience and years of 
          honing our training process, we provide a supportive and unintimidating environment that encourages 
          continuous growth.
        </p>
      </div>

      {/* Stats section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1 className="text-2xl font-bold">20+</h1>
          <p>Years of experience</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1 className="text-2xl font-bold">1000+</h1>
          <p>Successful SASSETA Applicants</p>
        </div>
      </div>

      {/* Programmes section */}
      <div className="p-4">
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold">SASSETA Programmes</h1>
          <p className="text-muted-foreground">Register for SASSETA accredited courses</p>
          <p className="text-sm mt-2">Our PSIRA Number: 1359466</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {skillsprograms?.map((course) => (
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
                  <AddtoCartButton name={course.course_name} price={course.price} id={course._id} itemType="course"/>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <h1 className="text-2xl font-bold">SASSETA Special Programmes</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {specialist?.map((course) => (
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
                  <AddtoCartButton name={course.course_name} price={course.price} id={course._id} itemType="course"/>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
      {general?.map((course) => (
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

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
{national?.map((course) => (
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
        <AddtoCartButton name={course.course_name} price={course.price} id={course._id} itemType="course"/>
      </div>
    </CardFooter>
  </Card>
))}
</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
{specialevent?.map((course) => (
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
      


      </div>

    </div>
  );
}