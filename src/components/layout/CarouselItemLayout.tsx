import React from "react";

import { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

interface Props {
   title: string;
   alt: string;
   backdropPath: string;
   onClick: () => void;
}

export default function CarouselItemLayout({
   title,
   alt,
   backdropPath,
   onClick,
}: Props) {
   return (
      <CarouselItem
         className="flex justify-center flex-col items-center"
         onClick={onClick}
      >
         <p className=" text-blue-600 font-bold text-5xl mt-60 w-[800px] text-center z-10 absolute [text-shadow:_5px_5px_10px_#2C3333] top-0">
            {title}
         </p>
         <Image
            className="rounded-xl lg:w-[1000px] h-[550px]"
            alt={alt}
            src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
            width={1000}
            height={1000}
         />
      </CarouselItem>
   );
}
