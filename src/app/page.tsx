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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Show from "./shared/api/Show";
import Movie from "./shared/api/Movie";
import { key } from "./shared/api/key";

export default function Home() {
   const [dataQuery, setDataQuery] = useState<
      {
         id: number;
         title: string;
         posterPath: string;
         year: string;
         name: string;
         profilePath: string;
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
            const responseQuery = response.data.results.map(
               (query: {
                  id: number;
                  title: string;
                  poster_path: string;
                  release_date: string;
                  name: string;
                  profile_path: string;
               }) => {
                  const {
                     id,
                     title,
                     poster_path,
                     release_date,
                     name,
                     profile_path,
                  } = query;

                  return {
                     id,
                     title,
                     posterPath: poster_path,
                     release_date,
                     name,
                     profilePath: profile_path,
                  };
               }
            );

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
         <header className="fixed backdrop-blur-sm w-full top-0 flex flex-row items-center py-8 z-20">
         <nav className="flex justify-between items-center m-auto gap-x-[740px]">
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

            <Input
               className="bg-blue-600 bg-opacity-30 border-none rounded-[5px] px-5 py-5 w-80 text-center text-blue-600 text-lg"
               placeholder="Search"
               value={searchItem}
               onChange={handleSearchChange}
            />
         </nav>
         </header>

         <div className="fixed right-56 top-20 bg-blue-900 bg-opacity-50 rounded-xl z-20">
            {searchItem === "" ? (
               <div></div>
            ) : (
               <ScrollArea className="flex flex-row w-[1200px] p-10 h-80 rounded-b-[10px]">
                  {loading ? (
                     <LoaderCircle className="animate-spin" />
                  ) : (
                     <div className="grid grid-cols-3 grid-flow-dense gap-x-5">
                        {dataQuery.map(data => (
                           <Card
                              key={data.id}
                              className="border-none mt-5 flex w-80 h-auto flex-row items-center gap-10 bg-blue-800 p-0 rounded-[10px]"
                           >
                              <Image
                                 className="rounded-xl w-20"
                                 alt=""
                                 src={`https://image.tmdb.org/t/p/w154${
                                    data.posterPath || data.profilePath
                                 }`}
                                 width={500}
                                 height={500}
                              />

                              <ul>
                                 <li className="text-center text-blue-600">
                                    {data.title || data.name}
                                 </li>
                                 <li className="text-center text-primary">
                                    {data.year}
                                 </li>
                              </ul>
                           </Card>
                        ))}
                     </div>
                  )}
                  <ScrollBar className="bg-blue-600 scrollbar-thumb-red-500" orientation="vertical" />
               </ScrollArea>
            )}
         </div>

         <section className="mt-20">
            <div className="flex flex-row gap-5 w-40">
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
