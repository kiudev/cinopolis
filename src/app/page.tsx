"use client";
import Image from "next/image";
import axios from "axios";

import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
   CardContent,
} from "@/components/ui/card";
import {
   useState,
   useEffect,
   forwardRef,
   ChangeEvent,
   MouseEventHandler,
} from "react";
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

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { key } from "./key";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon } from "lucide-react";

import DiscoverMovies from "@/app/movie/DiscoverMovies";
import DiscoverTV from "@/app/tv/DiscoverTV";
import { Button } from "@/components/ui/button";

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
   const [contentType, setContentType] = useState("movie");

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
         });
   };

   useEffect(() => {
      getQuery(searchItem);
   }, [searchItem]);

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchItem(event.target.value);
   };

   return (
      <main className="flex min-w-screen min-h-screen flex-col items-center justify-between p-10 bg-blue-800">
         <header className="fixed bg-gradient-to-b from-blue-800 to-transparent w-full top-0 flex flex-col items-center py-10 z-30">
            <nav className="flex justify-between items-center m-auto gap-x-20 gap-y-5 lg:gap-x-44 2xl:gap-x-[740px] 2xl:gap-y-0 w-[90vw] 2xl:w-[1460px] flex-wrap">
               <section>
                  <div className="flex flex-row gap-5 w-full">
                     <p
                        className={`text-3xl font-semibold ${
                           contentType === "movie"
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } cursor-pointer ${
                           contentType === "movie"
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 transition-all`}
                        onClick={() => {
                           setContentType("movie");
                        }}
                     >
                        Movies
                     </p>

                     <Separator
                        className="bg-blue-700 w-0.5 h-auto"
                        orientation="vertical"
                     />

                     <p
                        className={`text-3xl font-semibold ${
                           contentType === "tv"
                              ? "text-blue-600"
                              : "text-blue-600, text-opacity-60"
                        } ${
                           contentType === "tv"
                              ? "hover:text-blue-600"
                              : "text-blue-600"
                        } hover:text-blue-600 cursor-pointer transition-all`}
                        onClick={() => {
                           setContentType("tv");
                        }}
                     >
                        TV
                     </p>
                  </div>
               </section>

               <Input
                  className="bg-blue-700 border-none rounded-[5px] px-5 py-5 text-left text-blue-600 text-lg w-80"
                  placeholder="Search"
                  value={searchItem}
                  onChange={handleSearchChange}
               />
            </nav>

            <div className="fixed xl:right-56 md:right-20 lg:right-40 md:top-20 top-36 lg:top-20 bg-opacity-50 rounded-xl">
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
                                                (
                                                   person: any,
                                                   index: number
                                                ) => (
                                                   <ul
                                                      key={person.id}
                                                      className="flex justify-center flex-row"
                                                   >
                                                      <li className="text-left text-md text-blue-600">
                                                         {person.title ||
                                                            person.name}
                                                         {index <
                                                         data.knownFor.length -
                                                            1
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
         </header>

         {contentType === "movie" ? (
            <DiscoverMovies
               setLoading={setLoading}
               loading={loading}
               currentPage={currentPage}
               contentType={contentType}
            />
         ) : (
            <DiscoverTV
               setLoading={setLoading}
               loading={loading}
               currentPage={currentPage}
               contentType={contentType}
            />
         )}

         <footer className="flex flex-row justify-between items-center">
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
      // setLoading(true);
      setCurrentPage(currentPage - 1);

      window.scrollTo({
         top: 0,
         behavior: "smooth",
      });
   };

   const handleNextPage = () => {
      // setLoading(true);
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
