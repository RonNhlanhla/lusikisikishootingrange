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
  const legal = useQuery(api.myFunctions.listCourses, { authority: "PFTCLGL" });


  if (!legal || !basic || !business || !combo || !all3private || !all3business || !all4private || !all4business) return <div className="w-full flex items-center justify-center">Loading...</div>;

  return (
    <div>

      {/* this is a hero section with all the offerings as well */}


      <div className="w-full flex flex-col py-2">

        <h1 className="text-red-500">1. Legal Knowledge - REQUIRED</h1>
        <p className="py-2">At Mode Security, we offer a wide range of courses to help you develop the skills you need to succeed in the field. Our courses are designed to be both challenging and engaging, and we provide the support you need to succeed.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {legal?.map((course) => (
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

        <h1>2. Basic Firearm Training</h1>


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

        <h1>3. Business Purpose Firearm Training (BASIC IS REQUIRED)</h1>


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
        <h1 className="py-2 text-green">Combinations - Register for multiple firearms at once</h1>
        <h2>Single Firearm Combination</h2>


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

        {/* All 3 Firearm Combination Section */}
        <div className="py-4">
          <h2 className="">All 3 Firearm Combination</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Private Use */}
            {all3private?.[0] && (
              <Card className="px-2">
                <CardTitle>
                  <h2 className="text-lg font-bold py-2">{all3private[0].course_name}</h2>
                </CardTitle>
                <CardDescription>
                  <p className="text-sm">{all3private[0].course_description}</p>
                </CardDescription>
                <CardFooter>
                  <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-lg font-bold text-green">R{all3private[0].price}</p>
                    <AddtoCartButton name={all3private[0].course_name} price={all3private[0].price} id={all3private[0]._id} itemType="course"/>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Business Purpose */}
            {all3business?.[0] && (
              <Card className="px-2">
                <CardTitle>
                  <h2 className="text-lg font-bold py-2">{all3business[0].course_name}</h2>
                </CardTitle>
                <CardDescription>
                  <p className="text-sm">{all3business[0].course_description}</p>
                </CardDescription>
                <CardFooter>
                  <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-lg font-bold text-green">R{all3business[0].price}</p>
                    <AddtoCartButton name={all3business[0].course_name} price={all3business[0].price} id={all3business[0]._id} itemType="course"/>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>

        {/* All 4 Firearm Combination Section */}
        <div className="py-4">
          <h2 className="">All 4 Firearm Combination</h2>
          <p className="text-sm text-gray-500 mb-4">Handgun, Rifle, Shotgun, Hunting Rifle package deals.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Private Use */}
            {all4private?.[0] && (
              <Card className="px-2">
                <CardTitle>
                  <h2 className="text-lg font-bold py-2">{all4private[0].course_name}</h2>
                </CardTitle>
                <CardDescription>
                  <p className="text-sm">{all4private[0].course_description}</p>
                </CardDescription>
                <CardFooter>
                  <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-lg font-bold text-green">R{all4private[0].price}</p>
                    <AddtoCartButton name={all4private[0].course_name} price={all4private[0].price} id={all4private[0]._id} itemType="course"/>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Business Purpose */}
            {all4business?.[0] && (
              <Card className="px-2">
                <CardTitle>
                  <h2 className="text-lg font-bold py-2">{all4business[0].course_name}</h2>
                </CardTitle>
                <CardDescription>
                  <p className="text-sm">{all4business[0].course_description}</p>
                </CardDescription>
                <CardFooter>
                  <div className="w-full flex flex-row items-center justify-between">
                    <p className="text-lg font-bold text-green">R{all4business[0].price}</p>
                    <AddtoCartButton name={all4business[0].course_name} price={all4business[0].price} id={all4business[0]._id} itemType="course"/>
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>

      </div>

      <div className="w-full">
        <div className="w-full flex items-center justify-center">
          <Image src="/book/mor.jpg" alt="control" width={1000} height={1000} className="items-center" />
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
      </div>

    </div>
  )
}