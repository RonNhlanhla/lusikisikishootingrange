import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Linkedin, Instagram, Facebook } from "lucide-react";
import HeaderAuth from '@/components/header-auth';


const Footer = () => {
  return (

    <div className="w-full">
      <div className="grid grid-cols-2 px-4 items-center p-4">
        {/* Logo Section */}
        <div>
          <div className="flex flex-row sm:place-items-center">
            <Image
              src="/Logo.png"
              alt="Mode Security and Training Services"
              width={120}
              height={100}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        {/* Training App Section */}
        <div className="flex flex-col justify-end items-end">

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 items-center">
            <Link href="https://wa.me/27626176600?text=Hi-there!" className="text-gray-600 hover:text-gray-800">
              <div className="">
                <MessageCircle size={20} strokeWidth={2} color="green" className="hover:text-gold" />
              </div>
            </Link>
            <Link href="https://www.facebook.com/people/Mode-Security-and-Training-Services-Pty-Ltd/100063864287966/" className="text-gray-600 hover:text-gray-800">
              <div className="">
                <Facebook size={20} strokeWidth={2} color="green" className="hover:text-gold" />
              </div>
            </Link>
            <Link href="https://www.instagram.com/mode_security/" className="text-gray-600 hover:text-gray-800">
              <div className="">
                <Instagram size={20} strokeWidth={2} color="green" className="hover:text-gold" />
              </div>
            </Link>
            <Link href="https://www.linkedin.com/company/mode-security" className="text-gray-600 hover:text-gray-800">
              <div className="">
                <Linkedin size={20} strokeWidth={2} color="green" className="hover:text-gold" />
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full mt-2 md:mt-4">
        <div className="grid place-items-center bg-green h-20">
          <p className="font-bold items-center justify-center p-4 text-center text-white">Mode Security and Training Services © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;