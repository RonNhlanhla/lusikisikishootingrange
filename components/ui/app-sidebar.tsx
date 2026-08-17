"use client";

import * as React from "react"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { routes as TrainingRoutes } from "@/components/TrainingRoutes"
import { routes as SupplyRoutes } from "@/components/SupplyRoutes"
import { routes as GuardingRoutes } from "@/components/GuardingRoutes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, Linkedin, Instagram, Facebook } from "lucide-react";

import { MessageSquare, PhoneCall } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useQuery(api.myFunctions.getUserinfo);
  const isAdmin = currentUser?.role === "admin";
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* Contact Buttons Column */}
        <div className="w-full md:flex md:flex-col items-center">
          <div className="w-full flex flex-col items-center my-2 bg-green h-8 justify-center">
            <p className="font-black text-center text-white w-full px-2 tracking-[4px]">0810857636</p>
          </div>
          <div className="w-full">
            <Link href="tel:0810857636">
              <Button className="w-full items-center h-10 border-2 border-green rounded-full hover:bg-zinc-100 hover:text-green bg-white text-green flex flex-row px-2">
                <PhoneCall size={20} strokeWidth={2.5} color="#dc2626" className="icon-hover" />
              </Button>
            </Link>
          </div>

          <div className="w-full py-2">
            <Link href="https://wa.me/+27810857636?text=Hello!">
              <Button className="w-full items-center h-10 border-2 border-green rounded-full hover:bg-zinc-100 hover:text-green bg-white text-green flex flex-row px-2">


                <MessageSquare size={20} strokeWidth={2.5} color="#dc2626" className="icon-hover" />

              </Button>
            </Link>
          </div>

        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {isAdmin && (
          <Collapsible
            key="admin"
            title="Admin Tools"
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  <h2 className="text-gold font-bold">Admin Control</h2>{" "}
                  <ChevronRight className="text-gold ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="text-gold hover:bg-gold hover:text-white transition-colors duration-200">
                        <Link href="/admin">Dashboard</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        <Collapsible
          key="Training"
          title="Training"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Training</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {TrainingRoutes.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                        <a href={item.href} className="w-full h-full block">{item.label}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* We create a collapsible SidebarGroup for each parent. */}
        <Collapsible
          key="My Competency"
          title="My Competency"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">My Competency</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <a href="/profile/competency" className="w-full h-full block">My Competency</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <a href="/profile/regulation-21" className="w-full h-full block">Regulation 21</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <a href="/profile/firearm-registration" className="w-full h-full block">Firearm Registration</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible
          key="Shooting Club"
          title="Shooting Club"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Shooting Club</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <Link href="/club">Become a Member</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible
          key="Range Booking"
          title="Booking"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Range Booking</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <Link href="/book">Book</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* We create a collapsible SidebarGroup for each parent. */}
        <Collapsible
          key="Guarding"
          title="Guarding"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Guarding</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {GuardingRoutes.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                        <a href={item.href} className="w-full h-full block">{item.label}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* We create a collapsible SidebarGroup for each parent. */}
        <Collapsible
          key="Supply"
          title="Supply"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Supply</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SupplyRoutes.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                        <a href={item.href} className="w-full h-full block">{item.label}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible
          key="platform"
          title="Platform"
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <h2 className="text-green">Watchlist</h2>{" "}
                <ChevronRight className="text-green ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>

                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <a href="/profile" className="w-full h-full block">Profile</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-green hover:bg-green hover:text-white transition-colors duration-200">
                      <a href="/watchlist" className="w-full h-full block">Watchlist</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

      </SidebarContent>
      <SidebarSeparator />
      <SidebarRail />
      <SidebarFooter>
        {/* Social Icons */}
        <div className="w-full flex flex-row space-x-4 m-t-2 space-between justify-center">
          <Link href="https://wa.me/+27810857636?text=Hi-there!" className="text-gray-600 hover:text-gray-800">
            <div className="">
              <MessageCircle size={20} strokeWidth={2} color="black" className="hover:text-gold" />
            </div>
          </Link>
          <Link href="https://www.facebook.com/people/Mode-Security-and-Training-Services-Pty-Ltd/100063864287966/" className="text-gray-600 hover:text-gray-800">
            <div className="">
              <Facebook size={20} strokeWidth={2} color="black" className="hover:text-gold" />
            </div>
          </Link>
          <Link href="https://www.instagram.com/mode_security/" className="text-gray-600 hover:text-gray-800">
            <div className="">
              <Instagram size={20} strokeWidth={2} color="black" className="hover:text-gold" />
            </div>
          </Link>
          <Link href="https://www.linkedin.com/company/mode-security" className="text-gray-600 hover:text-gray-800">
            <div className="">
              <Linkedin size={20} strokeWidth={2} color="black" className="hover:text-gold" />
            </div>
          </Link>

        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
