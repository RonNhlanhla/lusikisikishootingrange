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
  title: "Mode Security & Training Services",
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
              <SidebarProvider>
                <AppSidebar />
                <div className="w-full sm:w-full flex flex-col">
                  <div className="w-full bg-gradient-to-r from-[#00d269] via-[#ebc378] to-[#00d269] animate-gradient text-white text-center py-3 px-4 text-sm md:text-base font-semibold shadow-md z-50">
                    Click <a href="/sign-in" className="underline">here</a> to register online and get R50 off all our courses.
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
