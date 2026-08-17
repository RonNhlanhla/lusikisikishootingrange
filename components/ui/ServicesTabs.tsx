import Link from "next/link";
import { routes as TrainingRoutes } from "@/components/TrainingRoutes";
import { routes as GuardingRoutes } from "@/components/GuardingRoutes";
import { routes as SupplyRoutes } from "@/components/SupplyRoutes";
import { routes as ClubRoutes } from "@/components/ClubRoutes";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const ServicesTabs = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Tabs defaultValue="training" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="training" className="bg-white text-green"><h3>Training</h3></TabsTrigger>
          <TabsTrigger value="guarding" className="bg-white text-green"><h3>Guarding</h3></TabsTrigger>
          <TabsTrigger value="supplies" className="bg-white text-green"><h3>Supplies</h3></TabsTrigger>
          <TabsTrigger value="club" className="bg-white text-gold"><h3>Shooting Club</h3></TabsTrigger>
        </TabsList>

        <TabsContent value="training">
          <div className="flex justify-center py-8">
            <Image src="/hero/open_up_close.JPG" alt="firearms" width={800} height={800}></Image>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {TrainingRoutes.map((route, index) => (
              <Link href={route.href} key={index} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow p-2 bg-green">
                  <CardHeader>
                    <CardTitle><h3 className="text-white">{route.label}</h3></CardTitle>
                    <CardDescription><p className="text-white">{route.description}</p></CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guarding">
          <div className="flex justify-center py-8">
            <Image src="/training/security_guard.jpg" alt="firearms" width={800} height={800}></Image>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GuardingRoutes.map((route, index) => (
              <Link href={route.href} key={index} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow p-2 bg-green">
                  <CardHeader>
                    <CardTitle><h3 className="text-white">{route.label}</h3></CardTitle>
                    <CardDescription><p className="text-white">{route.description}</p></CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="supplies">
          <div className="flex justify-center py-8">
            <Image src="/sportingsupply/firearms/hg/CZP-07Black.png" alt="firearms" width={800} height={800}></Image>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SupplyRoutes.map((route, index) => (
              <Link href={route.href} key={index} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow p-2 bg-green">
                  <CardHeader>
                    <CardTitle><h3 className="text-white">{route.label}</h3></CardTitle>
                    <CardDescription><p className="text-white">{route.description}</p></CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="club">
          <div className="flex justify-center py-8">
            <Image src="/hero/learnerinrange.jpg" alt="firearms" width={800} height={800}></Image>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ClubRoutes.map((route, index) => (
              <Link href={route.href} key={index} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow p-2 bg-green">
                  <CardHeader>
                    <CardTitle><h3 className="text-white">{route.label}</h3></CardTitle>
                    <CardDescription><p className="text-white">{route.description}</p></CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesTabs;