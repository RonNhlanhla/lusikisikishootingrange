import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import HeaderAuth from "@/components/header-auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/ui/Footer";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CartProvider } from "@/components/CartContext";
import Email from "@/components/ui/Email";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lusikisiki Hardcore Shooting Range & Training Services",
  description: "Training, Supply & Security Services",
  icons: {
    icon: "/mode.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics gaId="AW-1008234503" />
        <GoogleAnalytics gaId="G-PE8RZ834TJ" />
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <CartProvider>
              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <div className="w-full sm:w-full flex flex-col">
                  <div className="w-full bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#dc2626] animate-gradient text-white text-center py-6 px-4 text-sm md:text-base font-semibold shadow-md z-50">
                    <a href="/sign-in"><h1 className="text-2xl md:text-4xl font-black tracking-tight">Create an account / Sign In</h1></a>
                  </div>
                  <div className="w-full flex flex-row items-center justify-between space-x-2">
                    <SidebarTrigger />
                    <HeaderAuth />
                  </div>
                  <div className="w-full px-2">
                    {children}
                    <Email />
                  </div>
                  <Footer />
                </div>
              </SidebarProvider>
            </CartProvider>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}

