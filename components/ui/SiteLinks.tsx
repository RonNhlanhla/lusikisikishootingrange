import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu";
  import Link from "next/link";
  import {routes as TrainingRoutes} from "@/components/TrainingRoutes";
  
  import {routes as GuardingRoutes} from "@/components/GuardingRoutes";
  
  import {routes as SupplyRoutes} from "@/components/SupplyRoutes";
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Menu, MessageCircle, PhoneCall } from "lucide-react";
  
  export const SiteLinks = () => {
    return(
        <div>
            <div className="hidden md:block items-center md:mx-4 sm:mx-2 z-10">
            <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Training</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            
                    {TrainingRoutes.map((route, index) => (
                        <Link key={index} title={route.label} href={route.href}>
                            {route.label}
                        </Link>
                    ))}
                    </ul>
                </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Guarding</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            
                    {GuardingRoutes.map((route, index) => (
                        <Link key={index} title={route.label} href={route.href}>
                            {route.label}
                        </Link>
                    ))}
                    </ul>
                </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuTrigger>Sporting Supplies</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
            
                    {SupplyRoutes.map((route, index) => (
                        <Link key={index} title={route.label} href={route.href}>
                            {route.label}
                        </Link>
                    ))}
                    </ul>
                </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
            </NavigationMenu>
            </div>
            <Sheet>
                <SheetTrigger>
                    <Menu className="w-6 h-6 md:hidden"/>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4">
                        {/* add routes for training, supplies and guarding */}
                        <h3>Training</h3>
                        {TrainingRoutes.map((route,i)=>(
                            <Link key={i} href={route.href}>
                                {route.label}
                            </Link>
                        ))}
                        <h3>Guarding</h3>
                        {GuardingRoutes.map((route,i)=>(
                            <Link key={i} href={route.href}>
                                {route.label}
                            </Link>
                        ))}
                        <h3>Supply</h3>
                        {SupplyRoutes.map((route,i)=>(
                            <Link key={i} href={route.href}>
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );

  }