import React, { useEffect } from "react";

import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

interface Props {
   title: string;
   voteAvg: number;
   alt: string;
   backdropPath: string;
   onClick: () => void;
   loading: boolean;
}

export default function CarouselItemContainer({
   title,
   alt,
   backdropPath,
   onClick,
   voteAvg,
   loading
}: Props) {
   return (
      <CarouselItem className="" onClick={onClick}>
         {loading ? (
            <div className="z-20 text-4xl text-blue-600 absolute top-0 bottom-0 right-0 left-0">Loading...</div>
         ) : (
            <Image
               className="rounded-xl 2xl:w-[1000px] 2xl:h-[550px] 2xl:flex hidden"
               alt={alt}
               src={`https://image.tmdb.org/t/p/w1280/${backdropPath}`}
               width={1500}
               height={1500}
            />
         )}
      </CarouselItem>
   );
}
