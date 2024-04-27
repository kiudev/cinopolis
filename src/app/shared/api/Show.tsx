import axios from "axios";
import { useEffect, useState } from "react";

import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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
      }[]
   >([]);

   const key = "d7d9147d7ae46dbada53ea4a821b8ded";

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
                  year: show.first_air_date.slice(0, 4),
                  voteAverage: Number(show.vote_average.toFixed(1)),
                  voteCount: show.vote_count,
                  backdropPath: show.backdrop_path,
               }));

               setShowData(data);
            });
      } catch (error) {
         console.error("Error loading TV data", error);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   useEffect(() => {
      getShowData(currentPage);
   }, [currentPage]);

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   return (
      <div className="flex flex-wrap mt-5 justify-center items-center min-h-20 flex-row 2xl:w-[1500px] gap-5">
         {showData.map(item => (
            <Card
               onMouseEnter={() => handleMouseEnter(item.id)}
               onMouseLeave={() => setHovered(false)}
               className="border-none w-[18rem] xl:w-[350px] h-[20vh] xl:h-[200px] rounded-xl cursor-pointer flex justify-center items-center lg:hover:scale-125 transition-all"
               key={item.id}
            >
               {loading ? (
                  <div className="flex flex-col space-y-2 gap-3">
                     <Skeleton className="w-[250px] md:w-[250px] xl:w-[300px] h-4 xl:h-6 rounded-xl bg-blue-600" />
                     <Skeleton className="h-14 xl:h-20 w-[250px] md:w-[250px] xl:w-[300px] bg-blue-600 rounded-xl" />
                     <Skeleton className="h-4 xl:h-6 w-[150px] md:w-[150px] xl:w-[150px] bg-blue-600 rounded-xl" />
                  </div>
               ) : (
                  <div>
                     <CardHeader
                        style={{
                           display: hovered === item.id ? "flex" : "none",
                        }}
                        className="md:w-[20vw] xl:w-[350px] h-14 absolute bg-blue-900 bg-opacity-80 rounded-t-xl text-center lg:flex flex-row justify-around items-center animate-flip-down animate-duration-1000 animate-ease-out"
                     >
                        <p className="text-blue-600 font-semibold">
                           {item.year}
                        </p>

                        <ul className="flex flex-row items-center gap-2 bg-blue-700 p-2">
                           <li className="text-lg font-semibold text-blue-600">
                              {item.voteAverage}
                           </li>
                           <li className="text-[12px] text-blue-600">
                              {item.voteCount}
                           </li>
                        </ul>
                     </CardHeader>

                     <Image
                        className="rounded-xl w-[18rem] sm:w-[18rem] md:w-[20rem] xl:w-[500px]"
                        alt=""
                        src={`https://image.tmdb.org/t/p/original/${item.backdropPath}`}
                        width={500}
                        height={500}
                     />

                     <CardFooter className="w-[25vw] md:w-[20vw] xl:w-[350px] h-14 absolute bg-blue-900 bg-opacity-80 rounded-b-xl text-left text-blue-600 text-md -mt-14 px-5 animate-flip-up animate-duration-1000 animate-ease-out">
                        <CardTitle className="text-blue-600 text-lg">
                           {item.title}
                        </CardTitle>
                     </CardFooter>
                  </div>
               )}
            </Card>
         ))}
      </div>
   );
}
