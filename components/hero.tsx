import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export default function Header() {

  const CarouselRoutes = [
    { image: "/hero/ClubShirt.png", title: "JOIN OUR SHOOTING CLUB", description: "CHALLENGE YOURSELF AND YOUR FRIENDS SAFELY" },
    { image: "/hero/family.jpg", title: "WE HELP YOU FOCUS ON WHAT MATTERS MOST", description: "QUALITY PROTECTION SERVICES" },
    { image: "/club/knights_3.jpg", title: "TRAINING DONE RIGHT", description: "OUR COURSES INCLUDE FIREARM TRAINING, PSIRA, ETDP SETA, SASSETA, COMPUTER TRAINING" },
    { image: "/hero/handgunRange.jpg", title: "TRAINING DONE RIGHT", description: "OUR COURSES INCLUDE FIREARM TRAINING, PSIRA, ETDP SETA, SASSETA, COMPUTER TRAINING" }
  ]
  const sitelinks = "GUARDING | TRAINING | DETECTION | FIREARMS | SUPPLIES";

  return (
    <div className="w-full grid place-items-center">
      <Carousel className="w-full max-w-full items-center">
        <CarouselContent>
          {CarouselRoutes.map((route, i) => (
            <CarouselItem key={i}>
              <div className="relative flex justify-center items-center">
                <div className="hover:opacity-50 w-full flex justify-center">
                  <Image
                    src={route.image}
                    alt={route.title}
                    width={400}
                    height={200}
                    className="w-full md:w-1/2 object-cover"
                  />
                </div>
                <div className="hover:bg-white/80 transition-all duration-3000 absolute inset-0 flex items-center justify-center p-10 lg:px-6 lg:py-6 md:px-4 md:py-4">
                  <div className="flex flex-col items-center lg:gap-4 md:gap-4 text-center">
                    <small className="text-green hover:text-gold line-clamp-1">{sitelinks}</small>
                    <h1 className="text-green hover:text-gold tracking-tighter z-10 line-clamp-2">
                      {route.title}
                    </h1>
                    <small className="text-green hover:text-gold line-clamp-1">{route.description}</small>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
