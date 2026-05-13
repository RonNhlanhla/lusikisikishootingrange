'use client'
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddtoCartButton from "@/components/AddToCartButton";


export default function Page() {
  const basic = useQuery(api.myFunctions.listCourses, { authority: "PFTCPU" });
  const business = useQuery(api.myFunctions.listCourses, { authority: "PFTCBP" });
  const combo = useQuery(api.myFunctions.listCourses, { authority: "PFTCPB" });
  const all3private = useQuery(api.myFunctions.listCourses, { authority: "PFTCPU3" });
  const all3business = useQuery(api.myFunctions.listCourses, { authority: "PFTCBP3" });
  const all4private = useQuery(api.myFunctions.listCourses, { authority: "PFTCPU4" });
  const all4business = useQuery(api.myFunctions.listCourses, { authority: "PFTCBP4" });


  if (!basic || !business || !combo || !all3private || !all3business || !all4private || !all4business) return <div className="w-full flex items-center justify-center">Loading...</div>;

  return (
    <div>
      {/* this is a hero section with all the offerings as well */}
      <div className="w-full flex items-center justify-center">
        <Image src="/hero/class.jpg" alt="control" width={1000} height={1000} className="items-center" />
      </div>
      <div className="flex flex-col items-center bg-green p-4 gap-2">
        <h1 className="text-white">Why train with us?</h1>
        <p className="text-white">At Mode Security, we stand out as the premier choice for individuals who are new to firearms or seeking to enhance their existing skills. With our extensive industry experience and years of honing our training process, we have mastered the art of making firearms education less intimidating. We provide a supportive and unintimidating environment that encourages continuous growth. Through our well-crafted courses and practice shooting sessions, we offer the perfect blend of theoretical knowledge and practical application. Whether you are a beginner or looking to further develop your skills, Mode Security is your ideal partner on your journey to becoming a confident and proficient firearms handler.</p>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>30</h1>
          <p>years of experience</p>
        </div>
        <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
          <h1>3000+</h1>
          <p>Successful Firearm Trainees</p>
        </div>
      </div>

      <div className="w-full flex flex-col py-2">
        <h1>Basic Firearm Training</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {basic?.map((course) => (
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

        <h1>Business Purpose Firearm Training</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {business?.map((course) => (
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

        <h1>1 Firearm Combination</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {combo?.map((course) => (
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

        <h1>All 3 Firearm Combination Basic</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {all3private?.map((course) => (
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

        <h1>All 3 Firearm Combination Business Purpose</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {all3business?.map((course) => (
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

        <h1>All 4 Firearm Combination Private Use</h1>
        <p className="py-2">Handgun, Rifle, Shotgun, Hunting Rifle for Private Use</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {all4private?.map((course) => (
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

        <h1>All 4 Firearm Combination Business Purpose</h1>
        <p className="py-2">Handgun, Rifle, Shotgun, Hunting Rifle for Business Purpose</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {all4business?.map((course) => (
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

      </div>

    </div>
  )
}