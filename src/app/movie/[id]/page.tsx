"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

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

import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "usehooks-ts";
import { ImageIcon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function MovieDetails() {
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

   const [videos, setVideos] = useState<any[]>([]);
   const [images, setImages] = useState<any[]>([]);
   const [displayCast, setDisplayCast] = useState<boolean>(false);
   const [displayVideos, setDisplayVideos] = useState<boolean>(false);
   const [displayCrew, setDisplayCrew] = useState<boolean>(false);
   const [displayOverview, setDisplayOverview] = useState<boolean>(true);
   const [providers, setProviders] = useState<
      { id: number; logo: string; name: string }[]
   >([]);

   const mobile = useMediaQuery("only screen and (max-width : 1024px)");

   useEffect(() => {
      const getMovieDetails = async () => {
         try {
            await axios
               .get(`/api/movie/movieDetails`, {
                  params: {
                     id: params.id,
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
      const getMovieCredits = async () => {
         await axios
            .get(
               `/api/movie/movieCredits`, {
                  params: {
                     id: params.id
                  }
               }
            )
            .then(response => {
               const credits = response.data;

               setCreditsCast(credits.cast);

               setCastOverview(credits.popularCast);

               setCreditsCrew(credits.crew);

               setCrewOverview(credits.popularDirectors);
            })
            .catch(error => {
               console.error("Error fetching movie credits:", error);
            });
      };

      getMovieCredits();
   }, []);

   useEffect(() => {
      const getMovieVideos = async () => {
         await axios
            .get(
               `/api/movie/movieVideos`, {
                  params: {
                     id: params.id
                  }
               }
            )
            .then(response => {
               setVideos(response.data);
            })
            .catch(error => {
               console.error("Error fetching movie videos:", error);
            });
      };

      getMovieVideos();
   }, []);

   // useEffect(() => {
   //    const getMovieProviders = () => {
   //       try {
   //          axios
   //             .get(
   //                `https://api.themoviedb.org/3/movie/${params.id}/watch/providers`
   //             )
   //             .then(response => {
   //                const data = response.data.results.map((providers: any) => ({
   //                   id: providers.provider_id,
   //                   logo: providers.logo_path,
   //                   name: providers.provider_name,
   //                }));

   //                setProviders(data);
   //             });
   //       } catch (error) {
   //          console.error("Error getting providers " + error);
   //       }
   //    };

   //    getMovieProviders();
   // }, []);

   useEffect(() => {
      const getMovieImages = async () => {
         await axios
            .get(
               `/api/movie/movieImages`, {
                  params: {
                     id: params.id
                  }
               }
            )
            .then(response => {
               setImages(response.data);
            })
            .catch(error => {
               console.error("Error fetching movie images:", error);
            });
      };

      getMovieImages();
   }, []);

   return (
      <main className="flex min-w-screen min-h-screen flex-col lg:m-auto items-center justify-between bg-blue-800 lg:py-10">
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
                        className="w-[300px]"
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

                        <p>{`${details.hours}h ${details.minutes}m`}</p>
                     </div>
                  </CardHeader>

                  <ul className="flex flex-row gap-5 justify-evenly lg:justify-start lg:gap-10 w-full mt-5">
                     <li
                        onClick={() => {
                           setDisplayOverview(true);
                           setDisplayCast(false);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
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
                           setDisplayCast(true);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
                           setDisplayOverview(false);
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

                        <div className="flex flex-row gap-5 mt-5 flex-wrap">
                           <p className="text-blue-600 text-opacity-60 mr-5">
                              Starring
                           </p>
                           {castOverview.map(cast => (
                              <div key={cast.id}>
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
                              </div>
                           ))}
                        </div>

                        <div className="flex flex-row gap-5 mt-5 flex-wrap">
                           <p className="text-blue-600 text-opacity-60 mr-5">
                              Director
                           </p>
                           {crewOverview.map(director => (
                              <div key={director.id}>
                                 <HoverCard>
                                    <HoverCardTrigger className="cursor-pointer">
                                       {director.name}
                                    </HoverCardTrigger>
                                    <HoverCardContent className="border-none rounded-xl bg-blue-900 text-blue-600">
                                       <Image
                                          className="w-20"
                                          alt={director.name}
                                          src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                                          width={500}
                                          height={500}
                                       />
                                    </HoverCardContent>
                                 </HoverCard>{" "}
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
                     <div></div>
                  )}

                  {}
               </Card>
            </div>
         ) : (
            <div>Loading...</div>
         )}
      </main>
   );
}
