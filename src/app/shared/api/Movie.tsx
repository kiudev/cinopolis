import axios from "axios";
import { key } from "./key";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";

import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer";

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

import { Backpack, Loader, LoaderCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import CardLayout from "@/layout/CardLayout";
import CarouselLayout from "@/layout/CarouselLayout";
import { ImageIcon } from "lucide-react";

interface Props {
   loading: boolean;
   setLoading: Function;
   currentPage: number;
}

export default function Movie({ loading, setLoading, currentPage }: Props) {
   const [hovered, setHovered] = useState<number | false>(false);
   const [movieData, setMovieData] = useState<
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
   const [movieSelected, setMovieSelected] = useState<
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

   const getData = (pageNumber: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/discover/movie?api_key=${key}&page=${pageNumber}`
            )
            .then(response => {
               const data = response.data.results.map(
                  (movie: {
                     id: number;
                     title: string;
                     overview: string;
                     poster_path: string;
                     release_date: string;
                     vote_average: number;
                     vote_count: number;
                     backdrop_path: string;
                  }) => {
                     const {
                        id,
                        title,
                        overview,
                        poster_path,
                        release_date,
                        vote_average,
                        vote_count,
                        backdrop_path,
                     } = movie;

                     const year = release_date.slice(0, 4);
                     const voteAverage = vote_average.toString().slice(0, 3);

                     return {
                        id,
                        title,
                        overview,
                        posterPath: poster_path,
                        year,
                        voteAverage,
                        voteCount: vote_count,
                        backdropPath: backdrop_path,
                     };
                  }
               );

               setMovieData(data);
            });
      } catch (error) {
         console.error("Error loading movie data", error);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   const getMovieCast = (id: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}`
            )
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

               const popularActors = sortPopularity.slice(0, 5);

               setMovieSelected(prevData => {
                  if (prevData === false) {
                     return prevData;
                  } else {
                     return { ...prevData, cast: popularActors };
                  }
               });
            });
      } catch (error) {
         console.error("Error loading movie details", error);
      }
   };

   useEffect(() => {
      getData(currentPage);
   }, [currentPage]);

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   const handleMovieSelected = (id: number) => {
      const movieFound = movieData.find(movie => movie.id === id);

      if (movieFound) {
         getMovieCast(id);
         setMovieSelected(movieFound);
         setDialogOpen(true);
      }
   };

   return (
      <section className="flex justify-center min-w-screen min-h-screen">
         <div className="bg-gradient-to-t from-blue-800 from-80% to-transparent w-full h-[20rem] mt-[450px] absolute z-10"></div>

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
                     {movieData.map(movie => (
                        <CarouselLayout
                           key={movie.id}
                           title={movie.title}
                           alt={movie.title}
                           backdropPath={movie.backdropPath}
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
                  {movieData.map(movie => (
                     <div key={movie.id}>
                        <CardLayout
                           onClick={() => handleMovieSelected(movie.id)}
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

            {movieSelected && (
               <DialogContent className="grid grid-rows-3 grid-flow-col gap-10 sm:max-w-[1000px] max-h-[500px] border-none text-blue-600 rounded-xl">
                  <Image
                     className="w-72 row-span-3"
                     alt={movieSelected.title}
                     src={`https://image.tmdb.org/t/p/w500${movieSelected.posterPath}`}
                     width={500}
                     height={500}
                  />
                  <div className="bg-blue-700 absolute w-10 h-14 left-5 flex justify-center">
                     <p className="px-10 py-6 text-lg">
                        {movieSelected.voteAverage}
                     </p>
                  </div>
                  <DialogHeader className="flex flex-col gap-5">
                     <DialogTitle className="text-blue-600 font-bold text-6xl flex flex-row gap-5 items-center">
                        <p>
                           {movieSelected.title}
                           <p className="text-xl mt-2">{movieSelected.year}</p>
                        </p>
                     </DialogTitle>

                     <DialogDescription className="text-blue-600 text-opacity-60 text-md">
                        {movieSelected.overview}
                     </DialogDescription>
                     <footer className="flex flex-row items-center">
                        {movieSelected.cast?.map(actor => (
                           <TooltipProvider delayDuration={100}>
                              <Tooltip key={actor.id}>
                                 <TooltipTrigger asChild>
                                    {actor.profilePath ? (
                                       <Image
                                          className="w-28 p-2 rounded-xl row-span-3 ml-5 hover:scale-125 transition-all h-40"
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
