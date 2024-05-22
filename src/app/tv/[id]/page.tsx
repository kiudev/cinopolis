"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchSlashIcon, Star, Home, LoaderPinwheel } from "lucide-react";
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
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "usehooks-ts";
import { ImageIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { setFlagsFromString } from "v8";

export default function TVDetails() {
   const params = useParams();

   const [details, setDetails] = useState<{
      title: string;
      posterPath: string;
      backdropPath: string;
      genres: {
         id: number;
         name: string;
      }[];
      voteAvg: number;
      voteCount: number;
      year: string;
      overview: string;
      hours: number;
      minutes: number;
      tagline: string;
      numberSeasons: number;
      numberEpisodes: number;
      seasons: {
         id: number;
         air_date: string;
         episode_count: number;
         name: string;
         overview: string;
         poster_path: string;
         vote_average: number;
         season_number: number;
      }[];
   } | null>(null);

   const [creditsCast, setCreditsCast] = useState<
      {
         id: number;
         profile_path: string;
         name: string;
         character: string;
         job: string;
      }[]
   >([]);

   const [creditsCrew, setCreditsCrew] = useState<
      {
         id: number;
         profile_path: string;
         name: string;
         character: string;
         job: string;
      }[]
   >([]);

   const [castOverview, setCastOverview] = useState<
      {
         id: number;
         profile_path: string;
         name: string;
         character: string;
         job: string;
      }[]
   >([]);

   const [crewOverview, setCrewOverview] = useState<
      {
         id: number;
         profile_path: string;
         name: string;
         character: string;
         job: string;
      }[]
   >([]);

   const [episodes, setEpisodes] = useState<any[]>([]);

   const [videos, setVideos] = useState<any[]>([]);
   const [images, setImages] = useState<any[]>([]);
   const [displayCast, setDisplayCast] = useState<boolean>(false);
   const [displayVideos, setDisplayVideos] = useState<boolean>(false);
   const [displayCrew, setDisplayCrew] = useState<boolean>(false);
   const [displayOverview, setDisplayOverview] = useState<boolean>(true);
   const [displayEpisodes, setDisplayEpisodes] = useState<boolean>(false);
   const [seasonNumber, setSeasonNumber] = useState<number>(0);

   const mobile = useMediaQuery("only screen and (max-width : 1024px)");

   useEffect(() => {
      const getTVDetails = async () => {
         try {
            await axios
               .get(`/api/tv/tvDetails`, {
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

      getTVDetails();
   }, []);

   useEffect(() => {
      const getTVCredits = async () => {
         await axios
            .get(`/api/tv/tvCredits`, {
               params: {
                  id: params?.id,
               },
            })
            .then(response => {
               const credits = response.data;

               setCreditsCast(credits.cast);

               setCastOverview(credits.popularCast);

               setCreditsCrew(credits.crew);

               setCrewOverview(credits.popularProducer);
            })
            .catch(error => {
               console.error("Error fetching tv credits:", error);
            });
      };

      getTVCredits();
   }, []);

   useEffect(() => {
      const getTVVideos = async () => {
         await axios
            .get(`/api/tv/tvVideos`, {
               params: {
                  id: params?.id,
               },
            })
            .then(response => {
               setVideos(response.data);
            })
            .catch(error => {
               console.error("Error fetching movie videos:", error);
            });
      };

      getTVVideos();
   }, []);

   useEffect(() => {
      const getTVImages = async () => {
         await axios
            .get(`/api/tv/tvImages`, {
               params: {
                  id: params?.id,
               },
            })
            .then(response => {
               setImages(response.data);
            })
            .catch(error => {
               console.error("Error fetching tv images:", error);
            });
      };

      getTVImages();
   }, []);

   useEffect(() => {
      const getEpisodes = () => {
         axios
            .get(`/api/tv/tvEpisodes`, {
               params: {
                  id: params?.id,
                  seasonNumber: seasonNumber,
               },
            })
            .then(response => {
               setEpisodes(response.data);
            })
            .catch(error => {
               console.error("Error fetching episodes:", error);
            });
      };

      getEpisodes();
   }, [seasonNumber]);

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

               {mobile ? (
                  <Image
                     className="w-[100vw]"
                     src={`https://image.tmdb.org/t/p/original${details.backdropPath}`}
                     width={500}
                     height={500}
                     alt={details.title}
                  />
               ) : (
                  <div className="fixed top-10 -ml-[800px]">
                     <Image
                        className="w-[300px] h-[440px]"
                        src={`https://image.tmdb.org/t/p/w500${details.posterPath}`}
                        width={500}
                        height={500}
                        alt={details.title}
                     />
                  </div>
               )}

               <Card className="flex flex-col space-x-reverse justify-center items-center text-blue-600 border-none gap-5 mt-10 lg:mt-0 z-10 w-96 lg:w-[800px] lg:ml-[300px] lg:bg-gradient-to-t lg:from-blue-800 lg:to-blue-900 lg:p-10">
                  <CardHeader className="flex flex-col gap-5 w-full">
                     <CardTitle className="flex justify-between font-semibold">
                        <h1 className="text-4xl lg:text-left">
                           {details.title}
                        </h1>

                        <p className="flex flex-row items-center gap-2 text-3xl">
                           {details.voteAvg}
                           <Star className="w-7 h-7" />
                        </p>
                     </CardTitle>

                     <div className="flex flex-row justify-center items-center text-blue-600 text-opacity-60 gap-2 lg:justify-start">
                        {details.genres.map(genre => (
                           <div
                              className="bg-blue-700 text-blue-600 px-2 rounded-xl"
                              key={genre.id}
                           >
                              {genre.name}
                           </div>
                        ))}
                        <Separator
                           className="bg-blue-700 w-0.5 h-5"
                           orientation="vertical"
                        />

                        <p>{details.year}</p>
                        <Separator
                           className="bg-blue-700 w-0.5 h-5"
                           orientation="vertical"
                        />

                        <p>{`${details.numberSeasons} seasons. ${details.numberEpisodes} episodes.`}</p>
                     </div>
                  </CardHeader>

                  <ul className="flex flex-row gap-5 justify-evenly lg:justify-start lg:gap-10 w-full mt-5">
                     <li
                        onClick={() => {
                           setDisplayOverview(true);
                           setDisplayCast(false);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
                           setDisplayEpisodes(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayOverview
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayOverview
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 transition-all lg:text-2xl`}
                     >
                        Overview
                     </li>
                     <li
                        onClick={() => {
                           setDisplayEpisodes(true);
                           setDisplayOverview(false);
                           setDisplayCast(false);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayEpisodes
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayEpisodes
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 transition-all lg:text-2xl`}
                     >
                        Episodes
                     </li>
                     <li
                        onClick={() => {
                           setDisplayCast(true);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
                           setDisplayOverview(false);
                           setDisplayEpisodes(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayCast
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayCast ? "hover:text-blue-600" : "text-blue-600"
                        } hover:text-blue-600 transition-all lg:text-2xl`}
                     >
                        Cast
                     </li>
                     <li
                        onClick={() => {
                           setDisplayCast(false);
                           setDisplayVideos(false);
                           setDisplayCrew(true);
                           setDisplayOverview(false);
                           setDisplayEpisodes(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayCrew
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayCrew ? "hover:text-blue-600" : "text-blue-600"
                        } hover:text-blue-600 transition-all lg:text-2xl`}
                     >
                        Crew
                     </li>
                     <li
                        onClick={() => {
                           setDisplayCast(false);
                           setDisplayVideos(true);
                           setDisplayCrew(false);
                           setDisplayOverview(false);
                           setDisplayEpisodes(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayVideos
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayVideos
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 transition-all lg:text-2xl`}
                     >
                        Videos
                     </li>
                  </ul>

                  {displayCast ? (
                     <CardContent className="">
                        {creditsCast ? (
                           <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                              {creditsCast.map(cast => (
                                 <div
                                    key={cast.id}
                                    className="flex flex-row justify-center gap-2"
                                 >
                                    {mobile ? (
                                       <HoverCard>
                                          <HoverCardTrigger className="cursor-pointer hover:underline hover:decoration-blue-700 hover:underline-offset-4 rounded-xl">
                                             {cast.name}
                                          </HoverCardTrigger>
                                          <HoverCardContent className="border-none rounded-xl bg-blue-700 text-blue-600">
                                             <Image
                                                className="w-20"
                                                alt={cast.name}
                                                src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                                width={500}
                                                height={500}
                                             />
                                          </HoverCardContent>
                                       </HoverCard>
                                    ) : (
                                       <HoverCard>
                                          <HoverCardTrigger className="cursor-pointer hover:underline hover:decoration-blue-700 hover:underline-offset-4 rounded-xl">
                                             {cast.name}
                                          </HoverCardTrigger>
                                          <HoverCardContent className="border-none rounded-xl bg-blue-700 text-blue-600">
                                             <Image
                                                className="w-20"
                                                alt={cast.name}
                                                src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                                width={500}
                                                height={500}
                                             />
                                          </HoverCardContent>
                                       </HoverCard>
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p>No credits available.</p>
                        )}
                     </CardContent>
                  ) : displayVideos ? (
                     <CardContent>
                        <div className="grid grid-cols-2 gap-5">
                           {videos.map(video => (
                              <div key={video.id}>
                                 <p>{video.name}</p>
                                 <iframe
                                    width="300"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${video.key}`}
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                 ></iframe>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                  ) : displayCrew ? (
                     <div className="grid grid-cols-2 lg:grid-cols-7 gap-5">
                        {creditsCrew.map(cast => (
                           <div
                              key={cast.id}
                              className="flex flex-row justify-center gap-2"
                           >
                              {mobile ? (
                                 <HoverCard>
                                    <HoverCardTrigger className="cursor-pointer hover:underline hover:decoration-blue-700 hover:underline-offset-4 rounded-xl">
                                       {cast.name}
                                    </HoverCardTrigger>
                                    <HoverCardContent className="border-none rounded-xl bg-blue-700 text-blue-600">
                                       <Image
                                          className="w-20"
                                          alt={cast.name}
                                          src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                          width={500}
                                          height={500}
                                       />
                                    </HoverCardContent>
                                 </HoverCard>
                              ) : (
                                 <HoverCard>
                                    <HoverCardTrigger className="cursor-pointer hover:underline hover:decoration-blue-700 hover:underline-offset-4 rounded-xl">
                                       {cast.name}
                                    </HoverCardTrigger>
                                    <HoverCardContent className="border-none rounded-xl bg-blue-700 text-blue-600">
                                       <Image
                                          className="w-20"
                                          alt={cast.name}
                                          src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                          width={500}
                                          height={500}
                                       />
                                    </HoverCardContent>
                                 </HoverCard>
                              )}
                           </div>
                        ))}
                     </div>
                  ) : displayOverview ? (
                     <CardDescription className="text-left text-md w-full h-full">
                        <p className="italic text-blue-600 text-opacity-60 mb-3">
                           {`"` + details.tagline + `"`}
                        </p>
                        <p>{details.overview}</p>

                        <div className="flex flex-row gap-5 mt-5">
                           <p className="text-blue-600 text-opacity-60 mr-5">
                              Starring
                           </p>
                           {castOverview.map(cast => (
                              <div key={cast.id}>
                                 <Link href={`/person/${cast.id}`}>
                                    <HoverCard>
                                       <HoverCardTrigger className="cursor-pointer hover:underline hover:decoration-blue-700 hover:underline-offset-4 rounded-xl">
                                          {cast.name}
                                       </HoverCardTrigger>
                                       <HoverCardContent className="border-none rounded-xl bg-blue-900 text-blue-600">
                                          <Image
                                             className="w-20"
                                             alt={cast.name}
                                             src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
                                             width={500}
                                             height={500}
                                          />
                                       </HoverCardContent>
                                    </HoverCard>
                                 </Link>
                              </div>
                           ))}
                        </div>

                        <div className="flex flex-row gap-5 mt-5 flex-wrap">
                           <p className="text-blue-600 text-opacity-60 mr-5">
                              Director
                           </p>
                           {crewOverview.map(producer => (
                              <div key={producer.id}>
                                 <Link href={`/person/${producer.id}`}>
                                    <HoverCard>
                                       <HoverCardTrigger className="cursor-pointer">
                                          {producer.name}
                                       </HoverCardTrigger>
                                       <HoverCardContent className="border-none rounded-xl bg-blue-900 text-blue-600">
                                          <Image
                                             className="w-20"
                                             alt={producer.name}
                                             src={`https://image.tmdb.org/t/p/w185${producer.profile_path}`}
                                             width={500}
                                             height={500}
                                          />
                                       </HoverCardContent>
                                    </HoverCard>{" "}
                                 </Link>
                              </div>
                           ))}
                        </div>
                        {mobile ? (
                           <Carousel
                              plugins={[
                                 Autoplay({
                                    delay: 4000,
                                 }),
                              ]}
                              opts={{
                                 slidesToScroll: 1,
                                 align: "start",
                                 loop: true,
                              }}
                              className="w-full mt-10 mb-10"
                           >
                              <CarouselContent className="">
                                 {images.map(image => (
                                    <CarouselItem
                                       className="basis-1/2 flex justify-center items-center"
                                       key={image.id}
                                    >
                                       <Image
                                          className="w-80"
                                          alt={image.name}
                                          src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                          width={500}
                                          height={500}
                                       />
                                    </CarouselItem>
                                 ))}
                              </CarouselContent>
                              <CarouselPrevious className="" />
                              <CarouselNext className="" />
                           </Carousel>
                        ) : (
                           <Carousel
                              plugins={[
                                 Autoplay({
                                    delay: 4000,
                                 }),
                              ]}
                              opts={{
                                 slidesToScroll: 2,
                                 align: "start",
                                 loop: true,
                              }}
                              className="flex flex-row items-center justify-center w-[710px] h-60 mt-10"
                           >
                              <CarouselContent className="">
                                 {images.map(image => (
                                    <CarouselItem
                                       className="basis-1/2 flex justify-center items-center"
                                       key={image.id}
                                    >
                                       <Image
                                          className="w-80"
                                          alt={image.name}
                                          src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                                          width={500}
                                          height={500}
                                       />
                                    </CarouselItem>
                                 ))}
                              </CarouselContent>
                              <CarouselPrevious className="ml-5" />
                              <CarouselNext className="mr-5" />
                           </Carousel>
                        )}
                     </CardDescription>
                  ) : (
                     displayEpisodes && (
                        <Accordion type="single" collapsible className="w-full">
                           {details.seasons.map(season => (
                              <AccordionItem
                                 key={season.id}
                                 value={season.name}
                              >
                                 <AccordionTrigger
                                    onClick={() =>
                                       setSeasonNumber(season.season_number)
                                    }
                                    className="flex flex-row justify-between items-center"
                                 >
                                    <p className="text-md font-semibold">
                                       {season.name}
                                    </p>
                                    <p className="text-lg absolute left-[50rem] right-0">
                                       {season.vote_average}
                                    </p>
                                 </AccordionTrigger>
                                 <AccordionContent className="flex flex-col justify-start items-center w-full text-left gap-5">
                                    <header className="text-md">
                                       {season.overview}
                                    </header>

                                    <Accordion
                                       type="single"
                                       collapsible
                                       className="flex flex-col justify-between bg-blue-600 bg-opacity-20 w-full px-5"
                                    >
                                       {episodes.map(episode => (
                                          <AccordionItem
                                             value={episode.name}
                                             key={episode.id}
                                          >
                                             <AccordionTrigger className="flex flex-row items-center justify-between gap-2">
                                                <ul className="flex flex-row items-center gap-5">
                                                   <li className="text-md">
                                                      {episode.episode_number +
                                                         "."}
                                                   </li>
                                                   <li className="text-md font-semibold">
                                                      {episode.name}
                                                   </li>
                                                </ul>
                                                <p className="text-lg absolute left-[50rem] right-0">
                                                   {episode.vote_average}
                                                </p>
                                             </AccordionTrigger>

                                             <AccordionContent className="grid grid-cols-2">
                                                <Image
                                                   className="w-80 shadow-xl rounded-xl"
                                                   src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                                                   width={500}
                                                   height={500}
                                                   alt={details.title}
                                                />
                                                <ul className="flex flex-col items-center">
                                                   <div className="flex flex-row items-center justify-between w-full">
                                                      <li className="text-lg">
                                                         {episode.runtime +
                                                            "min"}
                                                      </li>
                                                   </div>
                                                   <li>{episode.overview}</li>
                                                </ul>
                                             </AccordionContent>
                                          </AccordionItem>
                                       ))}
                                    </Accordion>
                                 </AccordionContent>
                              </AccordionItem>
                           ))}
                        </Accordion>
                     )
                  )}
               </Card>
            </div>
         ) : (
            <div className="flex justify-center items-center w-full h-screen">
               <LoaderPinwheel size={48} className="text-blue-600 animate-spin" />
            </div>
         )}
      </main>
   );
}
