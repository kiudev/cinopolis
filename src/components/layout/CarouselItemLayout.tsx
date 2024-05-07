import React from "react";

import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

interface Props {
   title: string;
   voteAvg: number;
   alt: string;
   backdropPath: string;
   onClick: () => void;
}

export default function CarouselItemLayout({
   title,
   alt,
   backdropPath,
   onClick,
   voteAvg,
}: Props) {
   return (
      <CarouselItem className="" onClick={onClick}>
         <Image
            className="rounded-xl 2xl:w-[1200px] 2xl:h-[650px] 2xl:flex hidden"
            alt={alt}
            src={`https://image.tmdb.org/t/p/w1280/${backdropPath}`}
            width={1500}
            height={1500}
         />
      </CarouselItem>
   );
}
