"use client";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselPrevious,
   CarouselNext,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
   NavigationMenu,
   NavigationMenuList,
   NavigationMenuItem,
   NavigationMenuTrigger,
   NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Input } from "@/components/ui/input";

export default function Home() {
   const [item, setItem] = useState<{ id: number; posterPath: string }[]>([]);
   const [loading, setLoading] = useState(true);

   const getItems = () => {
      axios
         .get(
            `https://api.themoviedb.org/3/discover/movie?api_key=d7d9147d7ae46dbada53ea4a821b8ded`
         )
         .then(response => {
            const data = response.data.results.map(
               (movie: {
                  id: number;
                  title: string;
                  overview: string;
                  poster_path: string;
               }) => {
                  const { id, title, overview, poster_path } = movie;

                  return {
                     id,
                     title,
                     overview,
                     posterPath: poster_path,
                  };
               }
            );

            setItem(data);

            setTimeout(() => {
               setLoading(false);
            }, 2000);
         });
   };

   useEffect(() => {
      getItems();
   }, []);

   const streamingLogos = [
      {
         id: 0,
         name: "Netflix",
         image: "/netflix.svg",
         link: "Top 10 Netflix",
         new: "Newest",
      },
      {
         id: 1,
         name: "HBO Max",
         image: "/hbo.svg",
         link: "Top 10 HBO",
      },
      {
         id: 2,
         name: "Disney Plus",
         image: "/disney.svg",
         link: "Top 10 Disney",
      },
      {
         id: 3,
         name: "Amazon Prime Video",
         image: "/prime.svg",
         link: "Top 10 Prime Video",
      },
   ];

   return (
      <main className="flex min-h-screen flex-col items-center justify-between p-10 bg-gradient-to-b from-blue-800 from-50% to-blue-900 to-200%">
         {/* <Carousel className="w-80">
            <CarouselContent className="w-[30em]">
               {item.map(data => (
                  <CarouselItem key={data.id} className="basis-1/8 w-auto h-auto">
                     <Image
                        alt=""
                        src={`https://image.tmdb.org/t/p/w342${data.posterPath}`}
                        width={200}
                        height={200}
                     />
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious className="text-blue-500"/>
            <CarouselNext className="text-blue-500" />
         </Carousel> */}
         <NavigationMenu>
            <NavigationMenuList>
               {streamingLogos.map(logo => (
                  <NavigationMenuItem key={logo.id} className="flex flex-row">
                     <NavigationMenuTrigger className="text-blue-600 hover:text-blue-600">
                        <Image
                           src={logo.image}
                           width={70}
                           height={70}
                           alt={logo.name}
                        />
                     </NavigationMenuTrigger>
                     <NavigationMenuContent className="bg-blue-900 animate-in border border-blue-800">
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                           <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                 <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                 >
                                    <div className="mb-2 mt-4 text-lg font-medium text-blue-800">
                                       {logo.link}
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground text-blue-600">
                                       Beautifully designed components that you
                                       can copy and paste into your apps.
                                       Accessible. Customizable. Open Source.
                                    </p>
                                 </a>
                              </NavigationMenuLink>
                           </li>
                           <li>
                              <NavigationMenuLink>
                                 <a href="#">{logo.new}</a>
                              </NavigationMenuLink>
                           </li>
                        </ul>
                     </NavigationMenuContent>
                  </NavigationMenuItem>
               ))}
            </NavigationMenuList>
         </NavigationMenu>

         <Input
            className="bg-blue-600 bg-opacity-30 rounded-[5px] border-none mt-10 px-5 py-6 w-96 text-center text-blue-600 text-lg"
            placeholder="Search"
         />

         {loading ? (
            <div>Loading...</div>
         ) : (
            <section className="flex flex-wrap mt-10 justify-center flex-row w-[90vw] xl:w-[1200px] gap-3">
               {item.map(data => (
                  <Card className="border-transparent shadow-xl" key={data.id}>
                     <Image
                        className="rounded-xl w-[40vw] sm:w-[25vw] md:w-[20vw] lg:w-[200px]"
                        alt=""
                        src={`https://image.tmdb.org/t/p/w342${data.posterPath}`}
                        width={200}
                        height={200}
                     />
                  </Card>
               ))}
            </section>
         )}
      </main>
   );
}
