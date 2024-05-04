import { useState, useEffect } from "react";
import axios from "axios";
import { key } from "@/app/key";

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

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import Autoplay from "embla-carousel-autoplay";
import CardLayout from "@/components/layout/CardLayout";
import CarouselItemLayout from "@/components/layout/CarouselItemLayout";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import CarouselLayout from "@/components/layout/CarouselLayout";
import { Button } from "@/components/ui/button";
import {
   SlidersHorizontal,
   ArrowUpNarrowWide,
   ArrowDownWideNarrow,
} from "lucide-react";
import { ChangeEvent } from "react";

interface Props {
   loading: boolean;
   setLoading: Function;
   currentPage: number;
   filterList: string;
   contentType: string;
}

export default function DiscoverMovies({
   loading,
   setLoading,
   currentPage,
   filterList,
   contentType,
}: Props) {
   const [data, setData] = useState<
      {
         id: number;
         posterPath: string;
         title: string;
         year: string;
         voteAverage: number;
         voteCount: number;
         backdropPath: string;
         overview: string;
         genreId: number[];
      }[]
   >([]);
   const [selected, setSelected] = useState<
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

   const [hovered, setHovered] = useState<number | false>(false);
   const [dialogOpen, setDialogOpen] = useState<boolean>(false);
   const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
   const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
   const [voteAvg, setVoteAvg] = useState<number>(0);
   const [voteCount, setVoteCount] = useState<string>("");
   const [providers, setProviders] = useState<
      { id: number; logo: string; name: string }[]
   >([]);

   const getData = (pageNumber: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/${filterList}/${contentType}?api_key=${key}&page=${pageNumber}&with_genres=${selectedGenres}&vote_average.gte=${voteAvg}&sort_by=${voteCount}`
            )
            .then(response => {
               const results = response.data.results.map((data: any) => ({
                  id: data.id,
                  title: data.title,
                  overview: data.overview,
                  posterPath: data.poster_path,
                  year: data.release_date.slice(0, 4),
                  voteAverage: Number(data.vote_average.toFixed(1)),
                  voteCount: data.vote_count,
                  backdropPath: data.backdrop_path,
                  genreId: data.genre_ids,
               }));
               console.log(voteCount);
               setData(results);
            });
      } catch (error) {
         console.error("Error loading results", error);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   useEffect(() => {
      getData(currentPage);
   }, [currentPage, selectedGenres, voteAvg, voteCount]);

   const getCast = (id: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/${contentType}/${id}/credits?api_key=${key}`
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

               setSelected(prevData => {
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

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   const handleSelected = (id: number) => {
      const resultFound = data.find(result => result.id === id);

      if (resultFound) {
         getCast(id);
         setSelected(resultFound);
         setDialogOpen(true);
      }
   };

   const handleOpenChange = () => {
      setDialogOpen(!dialogOpen);
   };

   const getGenres = () => {
      try {
         axios
            .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}`)
            .then(response => {
               const data = response.data.genres.map((genre: any) => ({
                  id: genre.id,
                  name: genre.name,
               }));
               setGenres(data);
            });
      } catch (error) {
         console.error("Error getting genres" + error);
      }
   };

   useEffect(() => {
      getGenres();
   }, []);

   const handleGenreClick = (genreId: number) => {
      if (selectedGenres.includes(genreId)) {
         setSelectedGenres(selectedGenres.filter(g => g !== genreId));
      } else {
         setSelectedGenres([...selectedGenres, genreId]);
      }
   };

   const handleVoteAvg = (event: ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setVoteAvg(parseInt(event.target.value));
   };

   const handleVoteCount = (value: string) => {
      setLoading(true);
      setVoteCount(value);
   };

   const getProviders = () => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/watch/providers/movie?api_key=${key}`
            )
            .then(response => {
               const data = response.data.results.map((providers: any) => ({
                  id: providers.provider_id,
                  logo: providers.logo_path,
                  name: providers.provider_name,
               }));
               // const filterProviders = data.filter((p: any) =>
               //    [
               //       "Netflix",
               //       "HBO Max",
               //       "Amazon Prime Video",
               //       "Apple TV",
               //    ].includes(p.name)
               // );
               setProviders(data);
            });
      } catch (error) {
         console.error("Error getting providers " + error);
      }
   };

   useEffect(() => {
      getProviders();
   }, []);

   return (
      <section className="flex justify-center min-w-screen min-h-screen mt-20">
         <nav className="z-20 -mt-[95px] fixed flex flex-row items-center gap-5">
            <Sheet>
               <SheetTrigger
                  className={`text-3xl font-semibold ${
                     contentType === "movie"
                        ? "text-blue-600"
                        : "text-blue-600, text-opacity-60"
                  } cursor-pointer ${
                     contentType === "movie"
                        ? "hover:text-blue-600"
                        : "text-blue-600"
                  } hover:text-blue-600 transition-all `}
               >
                  <SlidersHorizontal className="w-10 h-10" />
               </SheetTrigger>
               <SheetContent
                  side="bottom"
                  className="bg-blue-800 border-none flex flex-row items-center justify-left"
               >
                  <div className="flex flex-row w-full h-[210px] gap-5">
                     <SheetHeader className="text-blue-600">
                        <SheetTitle>Genres</SheetTitle>
                        <SheetDescription className="">
                           <div className="grid grid-cols-3">
                              {genres.map(genre => (
                                 <div
                                    className="flex flex-row items-center gap-3 py-1"
                                    key={genre.id}
                                 >
                                    <Checkbox
                                       onClick={() =>
                                          handleGenreClick(genre.id)
                                       }
                                       className="text-blue-900 bg-blue-600"
                                       id={genre.name}
                                       checked={selectedGenres.includes(
                                          genre.id
                                       )}
                                    />
                                    <Label
                                       className=" text-blue-600  border-none"
                                       htmlFor={genre.name}
                                    >
                                       {genre.name}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        </SheetDescription>
                     </SheetHeader>
                     <div className="flex flex-col gap-5 w-72">
                        <SheetHeader className=" text-blue-600">
                           <SheetTitle>Vote Rating</SheetTitle>
                           <SheetDescription className="flex flex-row items-center gap-5 bg-blue-600 px-3 py-1 rounded-xl">
                              <p className="text-blue-700 text-xl">{voteAvg}</p>
                              <input
                                 onChange={handleVoteAvg}
                                 type="range"
                                 className="w-full h-2 bg-blue-700 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                 min="0"
                                 max="10"
                                 value={voteAvg}
                              />
                              <p className="text-blue-700 text-xl">10</p>
                           </SheetDescription>
                        </SheetHeader>
                        <SheetHeader className=" text-blue-600">
                           <SheetTitle>Vote Count</SheetTitle>
                           <SheetDescription className="flex flex-row justify-evenly items-center bg-blue-600 px-3 py-1 rounded-xl">
                              <Button
                                 onClick={() =>
                                    handleVoteCount("vote_count.asc")
                                 }
                                 className={`bg-blue-700 ${
                                    voteCount === "vote_count.asc"
                                       ? "bg-blue-700 bg-opacity-60 hover:bg-blue-700 hover:bg-opacity-100"
                                       : "bg-blue-700"
                                 }`}
                              >
                                 <ArrowUpNarrowWide />
                              </Button>
                              <Button
                                 onClick={() =>
                                    handleVoteCount("vote_count.desc")
                                 }
                                 className={`bg-blue-700 ${
                                    voteCount === "vote_count.desc"
                                       ? "bg-blue-700 bg-opacity-60 hover:bg-blue-700 hover:bg-opacity-100"
                                       : "bg-blue-700"
                                 }`}
                              >
                                 <ArrowDownWideNarrow />
                              </Button>
                           </SheetDescription>
                        </SheetHeader>
                     </div>
                  </div>
               </SheetContent>
            </Sheet>

            <Carousel opts={{slidesToScroll: 3}} className="flex flex-row items-center justify-center w-[600px]">
               <CarouselContent className="">
                  {providers.map(provider => (
                     <CarouselItem className="basis-1/8" key={provider.id}>
                        <Image
                           className="w-14 rounded-xl"
                           alt={provider.name}
                           src={`https://image.tmdb.org/t/p/w154${provider.logo}`}
                           width={100}
                           height={100}
                        />
                     </CarouselItem>
                  ))}
               </CarouselContent>
                  <CarouselPrevious className="ml-5" />
                  <CarouselNext className="mr-5" />
            </Carousel>
         </nav>

         <CarouselLayout
            loading={loading}
            dialogOpen={dialogOpen}
            setDialogOpen={handleOpenChange}
         >
            {data.map(movie => (
               <CarouselItemLayout
                  key={movie.id}
                  title={movie.title}
                  alt={movie.title}
                  backdropPath={movie.backdropPath}
                  onClick={() => handleSelected(movie.id)}
               />
            ))}
         </CarouselLayout>

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
      </section>
   );
}
