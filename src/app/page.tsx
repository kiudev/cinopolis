"use client";
import Image from "next/image";
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
   CardContent,
} from "@/components/ui/card";
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

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Show from "./shared/api/Show";
import Movie from "./shared/api/Movie";
import { key } from "./shared/api/key";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon } from "lucide-react";

export default function Home() {
   const [dataQuery, setDataQuery] = useState<
      {
         id: number;
         title: string;
         posterPath: string;
         year: string;
         name: string;
         profilePath: string;
         firstAirYear: string;
         knownForDepartment: string;
         knownFor: {
            title: string;
            name: string;
         }[];
      }[]
   >([]);

   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [searchItem, setSearchItem] = useState("");
   const [hovered, setHovered] = useState<number | false>(false);
   const [clicked, setClicked] = useState(false);

   const getQuery = (title: string) => {
      axios
         .get(
            `https://api.themoviedb.org/3/search/multi?query=${title}&api_key=${key}`
         )
         .then(response => {
            const responseQuery = response.data.results.map((query: any) => {
               const {
                  id,
                  title,
                  poster_path,
                  release_date,
                  name,
                  profile_path,
                  first_air_date,
                  known_for_department,
                  known_for,
               } = query;

               const releaseDateObj = new Date(release_date);
               const firstAirDateObj = new Date(first_air_date);

               const year = releaseDateObj.getFullYear();
               const firstAirYear = firstAirDateObj.getFullYear();

               return {
                  id,
                  title,
                  posterPath: poster_path,
                  year,
                  name,
                  profilePath: profile_path,
                  firstAirYear,
                  knownForDepartment: known_for_department,
                  knownFor: known_for,
               };
            });

            setDataQuery(responseQuery);

            // setTimeout(() => {
            //    setLoading(false);
            // }, 5000);
         });
   };

   useEffect(() => {
      getQuery(searchItem);
   }, [searchItem]);

   const handleShowClick = () => {
      setClicked(true);

      setTimeout(() => {
         setLoading(false);
      }, 1000);
   };

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

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   return (
      <main className="flex min-w-screen min-h-screen flex-col items-center justify-between p-10 bg-blue-800">
         <header className="fixed md:backdrop-blur-sm w-full top-0 flex flex-row items-center py-8 z-20">
            <nav className="flex flex-wrap justify-center lg:justify-between items-center m-auto gap-x-20 gap-y-5 lg:gap-x-44 2xl:gap-x-[740px] 2xl:gap-y-0">
               <NavigationMenu>
                  <NavigationMenuList>
                     {streamingLogos.map(logo => (
                        <NavigationMenuItem
                           key={logo.id}
                           className="flex flex-row"
                        >
                           <NavigationMenuTrigger className="text-blue-700 hover:text-blue-700 bg-blue-700 hover:bg-blue-600">
                              <Image
                                 src={logo.image}
                                 width={50}
                                 height={50}
                                 alt={logo.name}
                                 className="hover:filter hover:brightness-50"
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
                                             Beautifully designed components
                                             that you can copy and paste into
                                             your apps. Accessible.
                                             Customizable. Open Source.
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
                  className="bg-blue-700 border-none rounded-[5px] px-5 py-5 w-80 text-left text-blue-600 text-lg"
                  placeholder="Search"
                  value={searchItem}
                  onChange={handleSearchChange}
               />
            </nav>
         </header>

         <div className="fixed xl:right-56 md:right-20 lg:right-40 md:top-20 top-36 lg:top-20 bg-opacity-50 rounded-xl z-20">
            {searchItem === "" ? (
               <div></div>
            ) : (
               <ScrollArea className="flex flex-row w-[300px] lg:w-[700px] h-80 rounded-xl">
                  {loading ? (
                     <LoaderCircle className="animate-spin" />
                  ) : (
                     <div className="grid grid-flow-dense">
                        {dataQuery.map(data => (
                           <Card
                              key={data.id}
                              className="border-none flex w-full h-auto flex-row items-center bg-blue-700 p-0"
                           >
                              <div className="flex flex-wrap gap-x-3">
                                 {data.posterPath || data.profilePath ? (
                                    <Image
                                       className="w-20 p-2 rounded-xl"
                                       alt=""
                                       src={`https://image.tmdb.org/t/p/w154${
                                          data.posterPath || data.profilePath
                                       }`}
                                       width={500}
                                       height={500}
                                    />
                                 ) : (
                                    <ImageIcon className="w-16 ml-2 p-2 h-20 bg-blue-900 text-blue-600" />
                                 )}

                                 <ul>
                                    <li className="text-left text-blue-600 w-96 text-lg font-semibold mt-2">
                                       {data.title || data.name}
                                    </li>

                                    <li className="text-left text-md text-blue-600 text-opacity-60">
                                       {data.year ||
                                          data.firstAirYear ||
                                          data.knownForDepartment}
                                    </li>

                                    <div className="flex w-full gap-2 mt-2">
                                       {Array.isArray(data.knownFor) &&
                                          data.knownFor.map(
                                             (person: any, index: number) => (
                                                <ul
                                                   key={person.id}
                                                   className="flex justify-center flex-row"
                                                >
                                                   <li className="text-left text-md text-blue-600">
                                                      {person.title ||
                                                         person.name}
                                                      {index <
                                                      data.knownFor.length - 1
                                                         ? ","
                                                         : " "}
                                                   </li>
                                                </ul>
                                             )
                                          )}
                                    </div>
                                 </ul>

                                 <Separator className="bg-blue-600 w-[700px] bg-opacity-60" />
                              </div>
                           </Card>
                        ))}
                     </div>
                  )}

                  <ScrollBar orientation="vertical" />
               </ScrollArea>
            )}
         </div>

         <section className="mt-20">
            <div className="flex flex-row gap-5 w-full">
               <p
                  className={`text-3xl font-semibold ${
                     !clicked
                        ? "text-blue-600"
                        : "text-blue-600, text-opacity-60"
                  } cursor-pointer ${
                     !clicked ? "hover:text-blue-600" : "text-blue-600"
                  } hover:text-blue-600 transition-all`}
                  onClick={() => setClicked(false)}
               >
                  Movies
               </p>

               <p
                  className={`text-3xl font-semibold ${
                     clicked
                        ? "text-blue-600"
                        : "text-blue-600, text-opacity-60"
                  } ${
                     clicked ? "hover:text-blue-600" : "text-blue-600"
                  } hover:text-blue-600 cursor-pointer transition-all`}
                  onClick={() => handleShowClick()}
               >
                  TV
               </p>
            </div>

            {clicked ? (
               <Show
                  setLoading={setLoading}
                  loading={loading}
                  currentPage={currentPage}
               />
            ) : (
               <Movie
                  setLoading={setLoading}
                  loading={loading}
                  currentPage={currentPage}
               />
            )}
         </section>

         <footer className="flex flex-row justify-between items-center z-10 mt-[650px]">
            <p className="text-blue-600 absolute left-56 mt-8 text-opacity-60">
               Made with{" "}
               <a
                  href="https://kiudev.vercel.app"
                  target="_blank"
                  className="text-blue-600 hover:underline hover:underline-offset-4"
               >
                  🩵 <span className="text-blue-600 text-opacity-60">by</span>{" "}
                  Daniel Saavedra
               </a>
            </p>
            <PaginationSection
               setLoading={setLoading}
               currentPage={currentPage}
               setCurrentPage={setCurrentPage}
            />
            <p className="text-right absolute right-56 text-wrap text-blue-600 text-opacity-60 mt-8">
               Built with{" "}
               <a
                  href="https://nextjs.org"
                  className="text-blue-600 hover:underline hover:underline-offset-4"
                  target="_blank"
               >
                  Next.js
               </a>
               ,{" "}
               <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  className="text-blue-600 hover:underline hover:underline-offset-4"
               >
                  shadcn/ui
               </a>{" "}
               and{" "}
               <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  className="text-blue-600 hover:underline hover:underline-offset-4"
               >
                  Tailwind CSS
               </a>{" "}
               using{" "}
               <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  className="text-blue-600 hover:underline hover:underline-offset-4"
               >
                  TMDB
               </a>{" "}
               data.
            </p>
         </footer>
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
   setLoading,
}: {
   currentPage: any;
   setCurrentPage: any;
   setLoading: any;
}) {
   const handlePrevPage = () => {
      setLoading(true);
      setCurrentPage(currentPage - 1);

      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   const handleNextPage = () => {
      setLoading(true);
      setCurrentPage(currentPage + 1);

      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   return (
      <Pagination className="mt-10">
         <PaginationContent className="text-blue-600 border-2 border-blue-600 border-opacity-50 p-2 rounded-xl">
            <PaginationItem>
               <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => handlePrevPage()}
               />
            </PaginationItem>

            <Input
               className="w-20 px-3 py-2 text-center border-none text-xl"
               type="number"
               onChange={e => setCurrentPage(parseInt(e.target.value))}
               value={currentPage}
            />

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
