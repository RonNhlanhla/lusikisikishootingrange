'use client';
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardDescription, CardFooter, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import AddtoCartButton from "@/components/AddToCartButton";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

export default function BookRangePage() {
    const bookCourses = useQuery(api.myFunctions.listCourses, { authority: "Book" });
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Map specific course names to their respective images. You can edit this dictionary to easily set specific images for the 9mm vs .223 calibres
    const courseImages: Record<string, string> = {
        "Range + Handgun + 30 (9mm)": "/book/hg.jpg",
        "Range + Handgun + 50 (9mm)": "/book/hg.jpg",
        "Range + Self-Loading Rifle + 10 (223)": "/book/slr.jpg", // Example: replace with "/book/slr-223.jpg"
        "Range + Self-Loading Rifle + 20 (9mm)": "/sportingsupply/firearms/rf/tac9.jpg",  // Example: replace with "/book/slr-9mm.jpg"
        "Range + Manually Operated Rifle + 20 (.22)": "/book/mor.jpg",
        "Range + Shotgun + 10 (12G)": "/book/sg.jpg",
    };

    const getImageForCourse = (courseName: string) => {
        if (courseImages[courseName]) {
            return courseImages[courseName];
        }

        // Fallback for any newly added courses not in the dictionary above
        const nameLower = courseName.toLowerCase();
        if (nameLower.includes("handgun")) return "/book/hg.jpg";
        if (nameLower.includes("self-loading rifle")) return "/book/slr.jpg";
        if (nameLower.includes("hunting rifle") || nameLower.includes("manually operated rifle")) return "/book/mor.jpg";
        if (nameLower.includes("shotgun")) return "/book/sg.jpg";
        return "/book/hg.jpg"; // Default
    };

    if (!bookCourses) return <div className="w-full flex items-center justify-center p-8">Loading booking options...</div>;

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Book a Range Session</h1>
                <p className="text-muted-foreground">Select a date and a package to add to your cart.</p>
                <div className="flex justify-center mt-6">
                    <div className="border rounded-md p-2 bg-white inline-block shadow-sm">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {bookCourses?.map((course) => (
                    <Card key={course._id} className="flex flex-col h-full overflow-hidden shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="p-0">
                            <div className="relative h-64 w-full">
                                <Image
                                    src={getImageForCourse(course.course_name)}
                                    alt={course.course_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow flex flex-col justify-between">
                            <CardTitle>
                                <h2 className="text-xl font-bold py-2">{course.course_name}</h2>
                            </CardTitle>
                            <CardDescription>
                                <p className="text-sm">{course.course_description}</p>
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 mt-auto">
                            <div className="w-full flex flex-row items-center justify-between border-t pt-4">
                                <p className="text-xl font-bold text-green">R{course.price}</p>
                                <AddtoCartButton 
                                    name={course.course_name} 
                                    price={course.price} 
                                    id={course._id} 
                                    itemType="course" 
                                    date={date}
                                    description={date ? `Booking Date: ${format(date, 'PPP')}` : undefined}
                                />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            
            {bookCourses.length === 0 && (
                 <div className="text-center p-8 text-muted-foreground">
                     No booking options are currently available. Please check back later.
                 </div>
            )}
        </div>
    );
}
