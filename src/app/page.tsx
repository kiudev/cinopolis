"use client";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useState, useEffect, forwardRef } from "react";
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
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationEllipsis,
   PaginationPrevious,
   PaginationNext,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Home() {
   const [data, setData] = useState<
      { id: number; posterPath: string; title: string }[]
   >([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchItem, setSearchItem] = useState("");
   const [dataQuery, setDataQuery] = useState<
      { id: number; title: string; posterPath: string; year: string }[]
   >([]);

   const key = "d7d9147d7ae46dbada53ea4a821b8ded";

   const getData = (pageNumber: number) => {
      axios
         .get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${key}&page=${pageNumber}`
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

            setData(data);

            setTimeout(() => {
               setLoading(false);
            }, 1000);
         });
   };

   const getQuery = (title: string) => {
      axios
         .get(
            `https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${key}`
         )
         .then(response => {
            const responseQuery = response.data.results.map(
               (query: {
                  id: number;
                  title: string;
                  poster_path: string;
                  release_date: string;
               }) => {
                  const { id, title, poster_path, release_date } = query;
                  const year = release_date.slice(0, 4);

                  return {
                     id,
                     title,
                     posterPath: poster_path,
                     year,
                  };
               }
            );

            setDataQuery(responseQuery);

            setTimeout(() => {
               setLoading(false);
            }, 5000);
         });
   };

   useEffect(() => {
      getQuery(searchItem);
   }, [searchItem]);

   useEffect(() => {
      getData(currentPage);
   }, [currentPage]);

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

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchItem(event.target.value);
   };

   return (
      <main className="flex min-h-screen flex-col items-center justify-between p-10 bg-gradient-to-b from-blue-800 from-50% to-blue-900 to-200%">
         <nav className="fixed backdrop-blur-sm w-screen top-0 flex justify-center py-5">
            <NavigationMenu className="mt-5">
               <NavigationMenuList>
                  {streamingLogos.map(logo => (
                     <NavigationMenuItem
                        key={logo.id}
                        className="flex flex-row"
                     >
                        <NavigationMenuTrigger className="text-blue-600 hover:text-blue-600">
                           <Image
                              src={logo.image}
                              width={50}
                              height={50}
                              alt={logo.name}
                           />
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className="rounded-xl bg-blue-700">
                           <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <li className="row-span-3">
                                 <NavigationMenuLink asChild>
                                    <a
                                       className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                       href="/"
                                    >
                                       <div className="mb-2 mt-4 text-lg font-medium text-blue-600">
                                          {logo.link}
                                       </div>
                                       <p className="text-sm leading-tight text-muted-foreground text-blue-600">
                                          Beautifully designed components that
                                          you can copy and paste into your apps.
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
         </nav>

         <Input
            className="bg-blue-600 bg-opacity-30 border-none rounded-t-[5px] px-5 py-5 w-80 text-center text-blue-600 text-lg mt-20"
            placeholder="Search"
            value={searchItem}
            onChange={handleSearchChange}
         />
         <div className="absolute top-40 bg-blue-600 bg-opacity-20">
            {searchItem === "" ? (
               <div></div>
            ) : (
               <ScrollArea className="flex flex-row overflow-x-auto w-[1000px] h-80 p-10 rounded-b-[10px]">
                  {loading ? (
                     <p>Loading...</p>
                  ) : (
                     <div className="flex flex-row flex-wrap justify-center gap-x-5">
                        {dataQuery.map(data => (
                           <Card
                              key={data.id}
                              className="border-none mt-5 flex w-80 flex-row items-center gap-10 bg-blue-600 bg-opacity-30 p-2 rounded-[10px]"
                           >
                              <Image
                                 className="rounded-xl w-20"
                                 alt=""
                                 src={`https://image.tmdb.org/t/p/w154${data.posterPath}`}
                                 width={500}
                                 height={500}
                              />

                              <ul>
                                 <li className="text-center text-primary">
                                    {data.title}
                                 </li>
                                 <li className="text-center text-primary">
                                    {data.year}
                                 </li>
                              </ul>
                           </Card>
                        ))}
                     </div>
                  )}
               </ScrollArea>
            )}
         </div>

         {loading ? (
            <div className="flex justify-center items-center">Loading...</div>
         ) : (
            <section className="flex flex-wrap mt-10 justify-center items-center min-h-20 flex-row w-[90vw] xl:w-[1000px] gap-3">
               {data.map(item => (
                  <Card className="border-none shadow-xl" key={item.id}>
                     <Image
                        className="rounded-xl sm:w-[25vw] md:w-[20vw] lg:w-[190px]"
                        alt=""
                        src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                        width={500}
                        height={500}
                     />
                  </Card>
               ))}
            </section>
         )}

         <PaginationSection
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
         />
      </main>
   );
}

const ListItem = forwardRef<
   React.ElementRef<"a">,
   React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <a
               ref={ref}
               className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
               </p>
            </a>
         </NavigationMenuLink>
      </li>
   );
});
ListItem.displayName = "ListItem";

function PaginationSection({
   currentPage,
   setCurrentPage,
}: {
   currentPage: any;
   setCurrentPage: any;
}) {
   const handlePrevPage = () => {
      setCurrentPage(currentPage - 1);
   };

   const handleNextPage = () => {
      setCurrentPage(currentPage + 1);
   };

   return (
      <Pagination className="mt-10">
         <PaginationContent className="text-blue-600 border border-blue-600 border-opacity-50">
            <PaginationItem>
               <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => handlePrevPage()}
               />
            </PaginationItem>

            <p>{currentPage}</p>

            <PaginationItem>
               <PaginationNext
                  className="cursor-pointer"
                  onClick={() => handleNextPage()}
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
}
