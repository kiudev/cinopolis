"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Home, LoaderPinwheel } from "lucide-react";
import Link from "next/link";

import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "usehooks-ts";
import { ImageIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function CastAndCrewDetails() {
   const params = useParams();

   const [details, setDetails] = useState<{
      biography: string;
      name: string;
      deathday: number | null;
      birthday: string;
      placeOfBirth: string;
      profilePath: string;
   } | null>(null);

   const [creditsCast, setCreditsCast] = useState<[]>([]);

   const [mediaType, setMediaType] = useState<string>("Movie");
   const [movieCredits, setMovieCredits] = useState<any[]>([]);
   const [tvCredits, setTVCredits] = useState<any[]>([]);

   const mobile = useMediaQuery("only screen and (max-width : 1024px)");

   useEffect(() => {
      const getMovieDetails = async () => {
         try {
            await axios
               .get(`/api/person/personDetails`, {
                  params: {
                     id: params?.id,
                  },
               })
               .then(response => {
                  setDetails(response.data);
               });
         } catch (error) {
            console.error(error);
         }
      };

      getMovieDetails();
   }, []);

   useEffect(() => {
      const getPersonCredits = async () => {
         await axios
            .get(`/api/person/personCredits`, {
               params: {
                  id: params?.id,
               },
            })
            .then(response => {
               const credits = response.data;

               const filteredMovies = credits.filter(
                  (c: any) => c.media_type === "movie"
               );
               setMovieCredits(filteredMovies);

               const filteredTV = credits.filter(
                  (c: any) => c.media_type === "tv"
               );
               setTVCredits(filteredTV);
            })
            .catch(error => {
               console.error("Error fetching person credits:", error);
            });
      };

      getPersonCredits();
   }, []);

   const handleChange = (value: string) => {
      setMediaType(value);
   };

   return (
      <main className="flex min-w-screen min-h-screen flex-col lg:m-auto items-center justify-between bg-blue-800 lg:py-10">
         <header className="absolute left-20 z-20">
            <Link href={"/"}>
               <Home className="w-14 h-14 text-blue-600 hover:bg-blue-700 p-2 rounded-xl transition-all" />
            </Link>
         </header>
         {details ? (
            <div className="flex flex-col lg:flex-row lg:gap-14 justify-center items-center text-center border-none lg:w-[1100px]">
               <div className="bg-gradient-to-t from-blue-800 from-60% to-transparent w-full h-[18rem] absolute mt-0 lg:mt-[25rem] lg:h-[10rem] lg:z-10 lg:fixed lg:top-0"></div>

               <div className="fixed top-10 -ml-[800px]">
                  <Image
                     className="w-[300px] h-[440px]"
                     src={`https://image.tmdb.org/t/p/w500${details.profilePath}`}
                     width={500}
                     height={500}
                     alt={details.name}
                  />
               </div>

               <Card className="flex flex-col space-x-reverse justify-center items-center text-blue-600 border-none gap-5 mt-10 lg:mt-0 z-10 w-96 lg:w-[800px] lg:ml-[300px] lg:bg-gradient-to-t lg:from-blue-800 lg:to-blue-900 lg:p-10">
                  <CardHeader className="flex flex-col gap-5 w-full">
                     <CardTitle className="flex justify-between font-semibold">
                        <h1 className="text-4xl lg:text-left">
                           {details.name}
                        </h1>
                     </CardTitle>

                     <div className="flex flex-row justify-center items-center text-blue-600 text-opacity-60 gap-2 lg:justify-start">
                        <p>{details.birthday}</p>
                        {/* <Separator
                           className="bg-blue-700 w-0.5 h-5"
                           orientation="vertical"
                        /> */}
                     </div>
                  </CardHeader>

                  <div>
                     <p className="text-left">{details.biography}</p>
                  </div>

                  <div className="flex flex-row justify-start w-full">
                     <Select onValueChange={handleChange}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder={mediaType} />
                        </SelectTrigger>
                        <SelectContent className="text-blue-600 bg-blue-800">
                           <SelectItem value="Movie">Movie</SelectItem>
                           <SelectItem value="TV">TV</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  {mediaType === "Movie" ? (
                     <Carousel className="w-full" opts={{ slidesToScroll: 4 }}>
                        <CarouselContent className="flex flex-row">
                           {movieCredits.map(movie => (
                              <CarouselItem
                                 key={movie.id}
                                 className="basis-1/4"
                              >
                                 <Link href={`/movie/${movie.id}`}>
                                    <TooltipProvider delayDuration={100}>
                                       <Tooltip>
                                          <TooltipTrigger className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                                             <Image
                                                className="w-[300px] duration-300 ease-in-out hover:scale-[1.15] hover:brightness-[0.4]"
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                width={500}
                                                height={500}
                                                alt={details.name}
                                             />
                                          </TooltipTrigger>

                                          <TooltipContent
                                             side="bottom"
                                             className="text-blue-600 border-none shadow-none w-[150px] -mt-[150px] text-sm pointer-events-none"
                                          >
                                             <p>{movie.title}</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 </Link>
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                     </Carousel>
                  ) : (
                     <Carousel className="w-full" opts={{ slidesToScroll: 4 }}>
                        <CarouselContent className="flex flex-row">
                           {tvCredits.map(tv => (
                              <CarouselItem
                                 key={tv.id}
                                 className="basis-1/4 relative max-w-xs overflow-hidden bg-cover bg-no-repeat"
                              >
                                 <Link href={`/tv/${tv.id}`}>
                                    <TooltipProvider delayDuration={100}>
                                       <Tooltip>
                                          <TooltipTrigger className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                                             <Image
                                                className="w-[300px] duration-300 ease-in-out hover:scale-[1.15] hover:brightness-[0.4]"
                                                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                                                width={500}
                                                height={500}
                                                alt={details.name}
                                             />
                                          </TooltipTrigger>

                                          <TooltipContent
                                             side="bottom"
                                             className="text-blue-600 border-none shadow-none w-[200px] -mt-[150px] text-sm pointer-events-none"
                                          >
                                             <p>{tv.name}</p>
                                          </TooltipContent>
                                       </Tooltip>
                                    </TooltipProvider>
                                 </Link>
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                     </Carousel>
                  )}
               </Card>
            </div>
         ) : (
            <div className="flex justify-center items-center w-full h-screen">
               <LoaderPinwheel
                  size={48}
                  className="text-blue-600 animate-spin"
               />
            </div>
         )}
      </main>
   );
}
