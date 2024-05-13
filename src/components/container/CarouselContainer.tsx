import { ChangeEventHandler, ReactNode, useState } from "react";
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
import CarouselItemContainer from "@/components/container/CarouselItemContainer";

import { LoaderCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface Props {
   loading: boolean;
   children: ReactNode;
   dialogOpen: boolean;
   setDialogOpen: (open: boolean) => void;
}

export default function CarouselContainer({
   loading,
   children,
   dialogOpen,
   setDialogOpen,
}: Props) {
   return (
      <>
         <div className="bg-gradient-to-t from-blue-800 from-80% to-transparent w-full h-[25rem] absolute left-0 right-0 z-10 -mt-80"></div>

         <div className="bg-gradient-to-b from-blue-800 from-30% to-transparent to-100% w-full h-[100px] absolute z-10 top-32"></div>

         <header className="lg:flex hidden">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
               <Carousel
                  plugins={[
                     Autoplay({
                        delay: 4000,
                     }),
                  ]}
                  opts={{ align: "start", loop: true }}
                  className="rounded-xl border border-blue-700 bg-opacity-10 2xl:flex hidden"
               >
                  <DialogTrigger>
                     <CarouselContent className="2xl:w-[1000px] 2xl:h-[700px]">
                        {children}
                     </CarouselContent>
                  </DialogTrigger>

                  <CarouselPrevious className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20 -mt-32" />

                  <CarouselNext className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20 -mt-32" />
               </Carousel>
            </Dialog>
         </header>
      </>
   );
}
