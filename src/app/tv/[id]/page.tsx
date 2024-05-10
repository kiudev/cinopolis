"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import { key } from "@/app/key";
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

import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "usehooks-ts";

export default function TVDetails() {
   const params = useParams();

   const [details, setDetails] = useState<{
      title: string;
      posterPath: string;
      backdropPath: string;
      genres: string[];
      voteAvg: number;
      voteCount: number;
      year: string;
      overview: string;
      hours: number;
      minutes: number;
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

   const [videos, setVideos] = useState<any[]>([]);
   const [displayCast, setDisplayCast] = useState<boolean>(false);
   const [displayVideos, setDisplayVideos] = useState<boolean>(false);
   const [displayCrew, setDisplayCrew] = useState<boolean>(true);
   const mobile = useMediaQuery("only screen and (max-width : 1024px)");

   useEffect(() => {
      const getMovieDetails = () => {
         try {
            axios
               .get(
                  `https://api.themoviedb.org/3/tv/${params.id}?api_key=${key}`
               )
               .then(response => {
                  const details = response.data;
                  const runtimeMinutes = details.runtime;
                  const hours = Math.floor(runtimeMinutes / 60);
                  const minutes = runtimeMinutes % 60;

                  setDetails({
                     title: details.title,
                     posterPath: details.poster_path,
                     backdropPath: details.backdrop_path,
                     genres: details.genres,
                     voteAvg: Number(details.vote_average.toFixed(1)),
                     voteCount: details.vote_count,
                     year: details.first_air_date.slice(0, 4),
                     overview: details.overview,
                     hours,
                     minutes,
                  });
               });
         } catch (error) {
            console.error(error);
         }
      };

      getMovieDetails();
   }, []);

   useEffect(() => {
      const getMovieCredits = () => {
         axios
            .get(
               `https://api.themoviedb.org/3/tv/${params.id}/credits?api_key=${key}`
            )
            .then(response => {
               const creditsCast = response.data.cast;
               setCreditsCast(creditsCast);

               const creditsCrew = response.data.crew;
               setCreditsCrew(creditsCrew);
            })
            .catch(error => {
               console.error("Error fetching movie credits:", error);
            });
      };

      getMovieCredits();
   }, []);

   useEffect(() => {
      const getMovieVideos = () => {
         axios
            .get(
               `https://api.themoviedb.org/3/tv/${params.id}/videos?api_key=${key}&append_to_response=videos`
            )
            .then(response => {
               const videos = response.data.results;
               const trailers = videos.filter((v: any) => v.type === "Trailer");
               setVideos(trailers);
            })
            .catch(error => {
               console.error("Error fetching movie credits:", error);
            });
      };

      getMovieVideos();
   }, []);

   return (
      <main className="flex min-w-screen min-h-screen flex-col items-center justify-between bg-blue-800">
         {details ? (
            <div className="flex flex-col justify-center items-center text-center">
               <div className="bg-gradient-to-t from-blue-800 from-60% to-transparent w-full h-[18rem] absolute mt-0"></div>

               {mobile ? (
                  <Image
                     className="w-[100vw]"
                     src={`https://image.tmdb.org/t/p/original${details.backdropPath}`}
                     width={500}
                     height={500}
                     alt={details.title}
                  />
               ) : (
                  <Image
                     className="w-40"
                     src={`https://image.tmdb.org/t/p/original${details.posterPath}`}
                     width={500}
                     height={500}
                     alt={details.title}
                  />
               )}

               <Card className="flex flex-col space-x-reverse justify-center items-center text-blue-600 border-none gap-5 mt-10 z-10">
                  <CardHeader className="flex flex-col gap-5">
                     <CardTitle className="font-semibold">
                        <h1 className="text-4xl">{details.title}</h1>
                     </CardTitle>

                     <div className="flex flex-row justify-center items-center text-blue-600 text-opacity-60 gap-2">
                        <p>{details.year}</p>
                        <Separator
                           className="bg-blue-700 w-0.5 h-5"
                           orientation="vertical"
                        />

                        <p>{`${details.hours}h ${details.minutes}m`}</p>
                        <Separator
                           className="bg-blue-700 w-0.5 h-5"
                           orientation="vertical"
                        />

                        <p className="flex flex-row items-center gap-2">
                           {details.voteAvg}
                           <Star className="w-5 h-5" />
                        </p>
                     </div>

                     <CardDescription className="text-left text-md w-96">
                        <p>{details.overview}</p>
                     </CardDescription>
                  </CardHeader>

                  <ul className="flex flex-row gap-5 justify-evenly w-full">
                     <li
                        onClick={() => {
                           setDisplayCast(true);
                           setDisplayVideos(false);
                           setDisplayCrew(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayCast
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayCast ? "hover:text-blue-600" : "text-blue-600"
                        } hover:text-blue-600 transition-all`}
                     >
                        Cast
                     </li>
                     <li
                        onClick={() => {
                           setDisplayCast(false);
                           setDisplayVideos(false);
                           setDisplayCrew(true);
                        }}
                        className={`text-xl font-semibold ${
                           displayCrew
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayCrew ? "hover:text-blue-600" : "text-blue-600"
                        } hover:text-blue-600 transition-all`}
                     >
                        Crew
                     </li>
                     <li
                        onClick={() => {
                           setDisplayCast(false);
                           setDisplayVideos(true);
                           setDisplayCrew(false);
                        }}
                        className={`text-xl font-semibold ${
                           displayVideos
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           displayVideos
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 transition-all`}
                     >
                        Videos
                     </li>
                  </ul>

                  {displayCast ? (
                     <CardContent className="">
                        {creditsCast ? (
                           <div className="grid grid-cols-2 gap-5">
                              {creditsCast.map(cast => (
                                 <div
                                    key={cast.id}
                                    className="flex flex-row justify-center gap-2"
                                 >
                                    <Image
                                       className="w-20 rounded-xl"
                                       src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                                       width={500}
                                       height={500}
                                       alt={cast.name}
                                    />

                                    <p className="w-20">{cast.name}</p>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p>No credits available.</p>
                        )}
                     </CardContent>
                  ) : displayVideos ? (
                     <CardContent>
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
                     </CardContent>
                  ) : displayCrew ? (
                     <div>Crew</div>
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
