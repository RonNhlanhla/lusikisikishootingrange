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
import CheckoutButton from "@/components/CheckoutButton";


export default function Page(){
    const PSIRAcourses = [
        {
            name: "PSIRA Grade 1",
            description: "Basic security guard training",
            price: 1500,
            code: "PSIRA1"
        },
        {
            name: "PSIRA Grade 2",
            description: "Intermediate security guard training",
            price: 2000,
            code: "PSIRA2"
        },
        {
            name: "PSIRA Grade 3",
            description: "Advanced security guard training",
            price: 2500,
            code: "PSIRA3"
        }
    ];

    return PSIRAcourses
}