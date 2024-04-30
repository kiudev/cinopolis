import axios from "axios";
import { useEffect, useState } from "react";
import { key } from "./key";

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

import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

import Autoplay from "embla-carousel-autoplay";
import CardLayout from "@/layout/CardLayout";
import CarouselLayout from "@/layout/CarouselLayout";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface Props {
   setLoading: Function;
   loading: boolean;
   currentPage: number;
}

export default function Show({ setLoading, currentPage, loading }: Props) {
   const [hovered, setHovered] = useState<number | false>(false);
   const [showData, setShowData] = useState<
      {
         id: number;
         posterPath: string;
         title: string;
         year: string;
         voteAverage: number;
         voteCount: number;
         backdropPath: string;
         overview: string;
      }[]
   >([]);

   const [showSelected, setShowSelected] = useState<
      | {
           id: number;
           posterPath: string;
           title: string;
           year: string;
           voteAverage: number;
           voteCount: number;
           backdropPath: string;
           overview: string;
           cast?: any[];
        }
      | false
   >(false);

   const [dialogOpen, setDialogOpen] = useState(false);

   const getShowData = (pageNumber: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/discover/tv?api_key=${key}&page=${pageNumber}`
            )
            .then(response => {
               const data = response.data.results.map((show: any) => ({
                  id: show.id,
                  title: show.name,
                  overview: show.overview,
                  posterPath: show.poster_path,
                  year: show.first_air_date.slice(0, 5),
                  voteAverage: Number(show.vote_average.toFixed(1)),
                  voteCount: show.vote_count,
                  backdropPath: show.backdrop_path,
               }));

               setShowData(data);
            });
      } catch (error) {
         console.error("Error loading show data", error);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   const getShowCast = (id: number) => {
      try {
         axios
            .get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${key}`)
            .then(response => {
               const castData = response.data.cast.map((actor: any) => ({
                  id: actor.id,
                  name: actor.name,
                  profilePath: actor.profile_path,
                  nameCharacter: actor.character,
                  popularity: actor.popularity,
               }));

               const sortPopularity = castData.sort(
                  (a: any, b: any) => b.popularity - a.popularity
               );

               const popularActors = sortPopularity.slice(0, 4);

               setShowSelected(prevData => {
                  if (prevData === false) {
                     return prevData;
                  } else {
                     return { ...prevData, cast: popularActors };
                  }
               });
            });
      } catch (error) {
         console.error("Error loading show details", error);
      }
   };

   useEffect(() => {
      getShowData(currentPage);
   }, [currentPage]);

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   const handleShowSelected = (id: number) => {
      const showFound = showData.find(show => show.id === id);

      if (showFound) {
         getShowCast(id);
         setShowSelected(showFound);
         setDialogOpen(true);
      }
   };

   return (
      <section className="flex justify-center min-w-screen min-h-screen">
         <div className="bg-gradient-to-t from-blue-800 from-80% to-transparent w-full h-[150vh] mt-[300px] absolute z-10"></div>

         <div className="bg-gradient-to-b from-blue-800 from-5% to-transparent w-full h-[100px] absolute z-10"></div>

         <header className="lg:flex hidden">
            {loading ? (
               <div className="flex justify-center items-center w-[250px] md:w-[250px] xl:w-[1400px] xl:h-[500px]">
                  <LoaderCircle className="w-[250px] md:w-[250px] xl:w-[1400px] h-4 xl:h-[100px] text-blue-600 animate-spin" />
               </div>
            ) : (
               <Carousel
                  plugins={[
                     Autoplay({
                        delay: 4000,
                     }),
                  ]}
                  opts={{ align: "start", loop: true }}
                  className="lg:w-[900px] xl:w-[1000px] 2xl:w-[1460px] h-[550px] rounded-xl bg-blue-700 border border-blue-700 bg-opacity-10"
               >
                  <CarouselContent className="xl:w-[1015px] 2xl:w-[1500px]">
                     {showData.map(show => (
                        <CarouselLayout
                           key={show.id}
                           title={show.title}
                           alt={show.title}
                           backdropPath={show.backdropPath}
                        />
                     ))}
                  </CarouselContent>

                  <CarouselPrevious className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />

                  <CarouselNext className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />
               </Carousel>
            )}
         </header>

         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
               <div className="flex flex-wrap mt-24 lg:mt-[500px] justify-center items-center min-h-20 flex-row w-full 2xl:w-[1500px] gap-y-32 gap-x-5 xl:gap-y-5 z-10 absolute">
                  {showData.map(show => (
                     <div key={show.id}>
                        <CardLayout
                           onClick={() => handleShowSelected(show.id)}
                           onMouseEnter={() => handleMouseEnter(show.id)}
                           onMouseLeave={() => setHovered(false)}
                           loading={loading}
                           headerStyle={{
                              display: hovered === show.id ? "flex" : "none",
                           }}
                           year={show.year}
                           voteAverage={show.voteAverage}
                           voteCount={show.voteCount}
                           alt={show.title}
                           backdropPath={show.backdropPath}
                           title={show.title}
                        />
                     </div>
                  ))}
               </div>
            </DialogTrigger>

            {showSelected && (
               <DialogContent className="grid grid-rows-3 grid-flow-col gap-10 sm:max-w-[1000px] max-h-[500px] border-none text-blue-600 rounded-xl">
                  <Image
                     className="w-72 row-span-3"
                     alt={showSelected.title}
                     src={`https://image.tmdb.org/t/p/w500${showSelected.posterPath}`}
                     width={500}
                     height={500}
                  />
                  <div className="bg-blue-700 absolute w-10 h-14 left-5 flex justify-center">
                     <p className="px-10 py-6 text-lg">
                        {showSelected.voteAverage}
                     </p>
                  </div>
                  <DialogHeader className="flex flex-col gap-5">
                     <DialogTitle className="text-blue-600 font-bold text-6xl flex flex-row gap-5 items-center">
                        <p>
                           {showSelected.title}
                           <p className="text-xl mt-2">{showSelected.year}</p>
                        </p>
                     </DialogTitle>

                     <DialogDescription className="text-blue-600 text-opacity-60 text-md">
                        {showSelected.overview}
                     </DialogDescription>
                     <footer className="flex flex-row items-center">
                        {showSelected.cast?.map(actor => (
                           <TooltipProvider delayDuration={100}>
                              <Tooltip key={actor.id} className="">
                                 <TooltipTrigger asChild>
                                    {actor.profilePath ? (
                                       <Image
                                          className="w-28 p-2 rounded-xl row-span-3 ml-5 hover:scale-125 transition-all"
                                          alt=""
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
      </section>
   );
}
