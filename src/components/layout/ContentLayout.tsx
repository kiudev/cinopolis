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
   selected: boolean;
}

export default function ContentLayout({ loading, children, dialogOpen, }) {
   return (
      <>
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
               <div className="flex flex-wrap mt-24 lg:mt-[500px] justify-center items-center min-h-20 flex-row w-full 2xl:w-[1500px] gap-y-32 gap-x-5 xl:gap-y-5 z-10 absolute">
                  {data.map(movie => (
                     <div key={movie.id}>
                        <CardLayout
                           onClick={() => handleSelected(movie.id)}
                           onMouseEnter={() => handleMouseEnter(movie.id)}
                           onMouseLeave={() => setHovered(false)}
                           loading={loading}
                           headerStyle={{
                              display: hovered === movie.id ? "flex" : "none",
                           }}
                           year={movie.year}
                           voteAverage={movie.voteAverage}
                           voteCount={movie.voteCount}
                           alt={movie.title}
                           backdropPath={movie.backdropPath}
                           title={movie.title}
                        />
                     </div>
                  ))}
               </div>
            </DialogTrigger>

            {selected && (
               <DialogContent className="grid grid-rows-3 grid-flow-col gap-10 sm:max-w-[1000px] max-h-[500px] border-none text-blue-600 rounded-xl">
                  <Image
                     className="w-72 row-span-3"
                     alt={selected.title}
                     src={`https://image.tmdb.org/t/p/w500${selected.posterPath}`}
                     width={500}
                     height={500}
                  />
                  <div className="bg-blue-700 absolute w-10 h-14 left-5 flex justify-center">
                     <p className="px-10 py-6 text-lg">
                        {selected.voteAverage}
                     </p>
                  </div>
                  <DialogHeader className="flex flex-col gap-5">
                     <DialogTitle className="text-blue-600 font-bold text-6xl flex flex-row gap-5 items-center">
                        <p>
                           {selected.title}
                           <p className="text-xl mt-2">{selected.year}</p>
                        </p>
                     </DialogTitle>

                     <DialogDescription className="text-blue-600 text-opacity-60 text-md">
                        {selected.overview}
                     </DialogDescription>
                     <footer className="flex flex-row items-center">
                        {selected.cast?.map(actor => (
                           <TooltipProvider delayDuration={100}>
                              <Tooltip key={actor.id}>
                                 <TooltipTrigger asChild>
                                    {actor.profilePath ? (
                                       <Image
                                          className="w-28 p-2 rounded-xl row-span-3 ml-5 hover:scale-125 transition-all h-40"
                                          alt={actor.name}
                                          src={`https://image.tmdb.org/t/p/w185${actor.profilePath}`}
                                          width={500}
                                          height={500}
                                       />
                                    ) : (
                                       <ImageIcon className="w-28 p-2 rounded-xl row-span-3 ml-5 hover:scale-125 transition-all h-36 bg-blue-900" />
                                    )}
                                 </TooltipTrigger>

                                 <TooltipContent
                                    side="bottom"
                                    className="border-none shadow-none"
                                 >
                                    <p className="font-semibold text-lg">
                                       {actor.name}
                                    </p>
                                    <p className="text-blue-600 text-opacity-60">
                                       {actor.nameCharacter}
                                    </p>
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        ))}
                     </footer>
                  </DialogHeader>
               </DialogContent>
            )}
         </Dialog>
      </>
   );
}
