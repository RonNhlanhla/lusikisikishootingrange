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
import AddToCartButton from "@/components/AddToCartButton";

import { Medal, Trophy, Siren, Cctv, HeartHandshake, EarthLock, icons } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";

export default function Page() {
    const sites = ["Department of Energy", "Department of Labour", "Waterworks", "Stats SA", "Rand-Air", "PSIRA", "SASSETA", "ATNS", "SOS Children's Villages", "CCMA", "Saxonwold"]
    return (
        <div>
            {/* this is a hero section with all the offerings as well */}
            <div className="flex flex-col items-center">
                <Image src="/securitysupply/surveillence/cameras/wiredvideointercom.png" alt="firearms" width={500} height={500} />
            </div>
            <div className="flex flex-col items-center bg-green p-4 gap-2 mb-2">
                <h1 className="text-white">Why work with us?</h1>
                <p className="text-white">At our company, we take immense pride in delivering top-class guarding services that ensure the utmost safety and security for your organization. With years of experience in the industry, we have become the preferred provider for multiple critical governmental organizations and large companies in South Africa. Here's why we stand out from the competition:</p>
            </div>
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2">
                <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
                    <h1>100+</h1>
                    <p className="sm:text-center">Guards in total</p>
                </div>
                <div className="flex flex-col items-center justify-between p-4 w-screen md:w-1/2 bg-gold text-white">
                    <h1>35+</h1>
                    <p className="sm:text-center">Sites guarded historically</p>
                </div>
            </div>
            <div>
                <div className="p-4">
                    <h1>Why Choose Us</h1>
                    <p className="text-center md:text-left font-bold">We take immense pride in delivering top-class guarding services that ensure the utmost safety and security for your organization. With years of experience in the industry, we have become the preferred provider for multiple critical governmental organizations and large companies in South Africa. Here's why we stand out from the competition:</p>
                </div>
                <div className="w-full grid sm:grid-cols-1 p-2 gap-y-2 items-center justify-center">
                    <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
                        <Trophy size={50} color="#dc2626" />
                        <div className="w-2/3"><h3 className="text-center md:text-left">Unparalleled Expertise</h3>
                            <p className="text-center md:text-left">With a proven track record of guarding numerous sites, our team has overseen the security operations of a wide range of establishments. We have a wealth of knowledge and experience in safeguarding properties and ensuring the safety of our clients.</p></div>
                    </div>
                    <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
                        <Cctv size={50} color="#dc2626" />
                        <div className="w-2/3"><h3 className="text-center md:text-left">State-of-the-Art Control Room</h3>
                            <p className="text-center md:text-left">Our operational control room operates 24/7, providing real-time monitoring and support for all our security personnel. This ensures seamless communication, swift response to emergencies, and effective coordination of security measures.</p></div>
                    </div>
                    <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
                        <Medal size={50} color="#dc2626" />
                        <div className="w-2/3"><h3 className="text-center md:text-left">Highly Trained Guards</h3>
                            <p className="text-center md:text-left">Our guarding services feature a team of extensively trained and skilled security officers. We offer both unarmed and armed guards, carefully selected for their professionalism, integrity, and ability to handle any security situation with utmost professionalism and efficiency.</p></div>
                    </div>
                    <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
                        <Siren size={50} color="#dc2626" />
                        <div className="w-2/3"><h3 className="text-center md:text-left">Comprehensive Site Patrolling</h3>
                            <p className="text-center md:text-left">Our guards diligently patrol the designated sites to maintain a visible security presence and deter potential threats. We prioritize thorough site inspections and employ proactive strategies to identify and address vulnerabilities promptly.</p></div>
                    </div>
                    <div className='w-full flex flex-col gap-4 md:flex-row items-center justify-center '>
                        <HeartHandshake size={50} color="#dc2626" />
                        <div className="w-2/3"><h3 className="text-center md:text-left">Trusted by Governmental Organizations and Large Companies</h3>
                            <p className="text-center md:text-left">Our commitment to excellence has earned us the trust and preference of critical governmental organizations and prominent businesses in South Africa. We are proud to have been chosen as the trusted security provider for their vital operations.</p></div>
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 p-2 items-center justify-center">
                {sites.map((site) => (
                    <div key={site} className="p-4 hover:text-white hover:bg-gold hover:border-gold hover:border-0 border-2 text-green border-green">
                        <h3>{site}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}