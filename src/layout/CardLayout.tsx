import { useState } from "react";
import Image from "next/image";

import { Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
   onClick: () => void;
   onMouseEnter: () => void;
   onMouseLeave: () => void;
   loading: boolean;
   headerStyle: Object;
   year: string;
   voteAverage: number;
   voteCount: number;
   alt: string;
   backdropPath: string;
   title: string;
}

export default function CardLayout({
   onClick,
   onMouseEnter,
   onMouseLeave,
   loading,
   headerStyle,
   year,
   voteAverage,
   voteCount,
   alt,
   backdropPath,
   title,
}: Props) {
   return (
      <Card
         onClick={onClick}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         className="border-none w-[18rem] xl:w-[350px] h-[50px] xl:h-[200px] rounded-xl cursor-pointer flex justify-center items-center lg:hover:scale-125 transition-all"
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
                  style={headerStyle}
                  className="w-[180px] md:w-[289px] xl:w-[350px] h-14 absolute bg-blue-900 bg-opacity-80 rounded-t-xl text-center lg:flex flex-row justify-around items-center animate-flip-down animate-duration-1000 animate-ease-out"
               >
                  <p className="text-blue-600 font-semibold">{year}</p>

                  <ul className="flex flex-row items-center gap-2 bg-blue-700 p-2">
                     <li className="text-lg font-semibold text-blue-600">
                        {voteAverage}
                     </li>
                     <li className="text-[12px] text-blue-600">{voteCount}</li>
                  </ul>
               </CardHeader>

               <Image
                  className="rounded-xl w-[18rem] sm:w-[18rem] md:w-[20rem] xl:w-[500px] h-[160px] xl:h-[200px]"
                  alt={alt}
                  src={`https://image.tmdb.org/t/p/w500/${backdropPath}`}
                  width={500}
                  height={500}
               />

               <CardFooter className="w-[288px] xl:w-[350px] h-14 absolute bg-blue-900 bg-opacity-80 rounded-b-xl text-left text-blue-600 text-md -mt-14 px-5 animate-flip-up animate-duration-1000 animate-ease-out">
                  <CardTitle className="text-blue-600 text-lg">
                     {title}
                  </CardTitle>
               </CardFooter>
            </div>
         )}
      </Card>
   );
}
