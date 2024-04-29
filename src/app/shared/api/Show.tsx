import axios from "axios";
import { useEffect, useState } from "react";
import { key } from "./key";

import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import CardLayout from "@/layout/CardLayout";
import CarouselLayout from "@/layout/CarouselLayout";
import { LoaderCircle } from "lucide-react";

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
         console.error("Error loading show data", error);
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
      <section className="flex justify-center min-w-screen min-h-screen">
         <div className="bg-gradient-to-t from-blue-800 from-80% to-transparent w-full h-[150vh] mt-[300px] absolute z-10"></div>

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
                     {showData.map(show => (
                        <CarouselLayout
                           key={show.id}
                           title={show.title}
                           alt={show.title}
                           backdropPath={show.backdropPath}
                        />
                     ))}
                  </CarouselContent>

                  <CarouselPrevious className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />

                  <CarouselNext className="text-blue-600 hover:text-blue-600 hover:text-opacity-60 w-20 h-20" />
               </Carousel>
            )}
         </header>

         <div className="flex flex-wrap mt-24 lg:mt-[500px] justify-center items-center min-h-20 flex-row w-full 2xl:w-[1500px] gap-y-32 gap-x-5 xl:gap-y-5 z-10 absolute">
            {showData.map(show => (
               <CardLayout
                  onClick={() => handleMouseEnter(show.id)}
                  onMouseEnter={() => handleMouseEnter(show.id)}
                  onMouseLeave={() => setHovered(false)}
                  key={show.id}
                  loading={loading}
                  headerStyle={{
                     display: hovered === show.id ? "flex" : "none",
                  }}
                  year={show.year}
                  voteAverage={show.voteAverage}
                  voteCount={show.voteCount}
                  alt={show.title}
                  backdropPath={show.backdropPath}
                  title={show.title}
               />
            ))}
         </div>
      </section>
   );
}
