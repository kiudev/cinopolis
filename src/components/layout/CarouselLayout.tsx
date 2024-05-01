import { ReactNode, useState } from "react";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import CarouselItemLayout from "@/components/layout/CarouselItemLayout";

import { LoaderCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface Props {
   loading: boolean;
   children: ReactNode;
   dialogOpen: boolean;
   setDialogOpen: () => void;
}

export default function CarouselLayout({
   loading,
   children,
   dialogOpen,
   setDialogOpen,
}: Props) {
   return (
      <>
         <div className="bg-gradient-to-t from-blue-800 from-80% to-transparent w-full h-[20rem] mt-[450px] absolute z-10"></div>

         <div className="bg-gradient-to-b from-blue-800 from-5% to-transparent w-full h-[100px] absolute z-10"></div>

         <header className="lg:flex hidden">
            {loading ? (
               <div className="flex justify-center items-center w-[250px] md:w-[250px] xl:w-[1400px] xl:h-[500px]">
                  <LoaderCircle className="w-[250px] md:w-[250px] xl:w-[1400px] h-4 xl:h-[100px] text-blue-600 animate-spin" />
               </div>
            ) : (
               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <Carousel
                     plugins={[
                        Autoplay({
                           delay: 4000,
                        }),
                     ]}
                     opts={{ align: "start", loop: true }}
                     className="lg:w-[900px] xl:w-[1000px] 2xl:w-[1460px] h-[550px] rounded-xl bg-blue-700 border border-blue-700 bg-opacity-10"
                  >
                     <DialogTrigger>
                        <CarouselContent className="xl:w-[1015px] 2xl:w-[1500px]">
                           {children}
                        </CarouselContent>
                     </DialogTrigger>

                     <CarouselPrevious className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />

                     <CarouselNext className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />
                  </Carousel>
               </Dialog>
            )}
         </header>
      </>
   );
}
