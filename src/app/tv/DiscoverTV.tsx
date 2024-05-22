import { useState, useEffect } from "react";
import axios from "axios";

import { ChangeEvent } from "react";
import { useMediaQuery } from "usehooks-ts";
import DiscoverLayout from "@/components/layout/DiscoverLayout";
import { LoaderPinwheel } from "lucide-react";

interface Props {
   loading: boolean;
   setLoading: Function;
   currentPage: number;
   contentType: string;
}

export default function DiscoverMovies({
   loading,
   setLoading,
   currentPage,
   contentType,
}: Props) {
   const [data, setData] = useState<
      {
         id: number;
         posterPath: string;
         title: string;
         year: string;
         voteAverage: number;
         voteCount: number;
         backdropPath: string;
         overview: string;
         genreId: number[];
      }[]
   >([]);
   const [selected, setSelected] = useState<
      | {
           id: number;
           posterPath: string;
           title: string;
           year: string;
           voteAverage: number;
           voteCount: number;
           backdropPath: string;
           overview: string;
           cast?: any[];
        }
      | false
   >(false);

   const [backdrop, setBackdrop] = useState<{ filePath: string }[]>([]);

   const [hovered, setHovered] = useState<number>(0);
   const [dialogOpen, setDialogOpen] = useState<boolean>(false);
   const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
   const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
   const [voteAvg, setVoteAvg] = useState<number>(0);
   const [voteCount, setVoteCount] = useState<string>("");
   const [providers, setProviders] = useState<
      { id: number; logo: string; name: string }[]
   >([]);
   const [selectedProvider, setSelectedProvider] = useState<number>(0);

   const mobile = useMediaQuery("only screen and (max-width : 1024px)");

   useEffect(() => {
      const getData = async (pageNumber: number) => {
         try {
            const response = await axios.get("/api/discover/discoverDataTV", {
               params: {
                  contentType: contentType,
                  pageNumber: pageNumber,
                  selectedGenres: selectedGenres.join(","),
                  voteAvg: voteAvg,
                  voteCount: voteCount,
                  selectedProvider: selectedProvider,
               },
            });

            setLoading(response.data.loading);
            setData(response.data.results);
         } catch (error) {
            console.error(error);
         }
      };
      getData(currentPage);
   }, [currentPage, selectedGenres, voteAvg, voteCount, selectedProvider]);

   const getCast = async (id: number) => {
      try {
         await axios
            .get(`/api/discover/discoverCast`, {
               params: {
                  id: id,
                  contentType: contentType,
               },
            })
            .then(response => {
               setSelected(prevData => {
                  if (prevData === false) {
                     return prevData;
                  } else {
                     return { ...prevData, cast: response.data };
                  }
               });
            });
      } catch (error) {
         console.error("Error loading movie details", error);
      }
   };

   // const getImages = (id: number) => {
   //    try {
   //       axios
   //          .get(
   //             `https://api.themoviedb.org/3/${contentType}/${id}/images?api_key=${key}`
   //          )
   //          .then(response => {
   //             const images = response.data.backdrops.map((backdrop: any) => ({
   //                filePath: backdrop.file_path,
   //             }));

   //             setBackdrop(images);
   //          });
   //    } catch (error) {
   //       console.error("Error loading images", error);
   //    }
   // };

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   const handleSelected = (id: number) => {
      const resultFound = data.find(result => result.id === id);

      if (resultFound) {
         getCast(id);
         // getImages(id);
         setSelected(resultFound);
         setDialogOpen(true);
      }
   };

   const handleOpenChange = () => {
      setDialogOpen(!dialogOpen);
   };

   useEffect(() => {
      const getGenres = () => {
         try {
            axios.get(`/api/discover/discoverGenres`).then(response => {
               setGenres(response.data);
            });
         } catch (error) {
            console.error("Error getting genres" + error);
         }
      };

      getGenres();
   }, []);

   const handleGenreClick = (genreId: number) => {
      if (selectedGenres.includes(genreId)) {
         setSelectedGenres(selectedGenres.filter(g => g !== genreId));
      } else {
         setSelectedGenres([...selectedGenres, genreId]);
      }
   };

   const handleVoteAvg = (event: ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setVoteAvg(parseInt(event.target.value));
   };

   const handleVoteCount = (value: string) => {
      setLoading(true);
      setVoteCount(value);
   };

   useEffect(() => {
      const getProviders = async () => {
         try {
            await axios
               .get(`/api/discover/discoverProviders`, {
                  params: {
                     contentType: contentType,
                  },
               })
               .then(response => {
                  setProviders(response.data);
               });
         } catch (error) {
            console.error("Error getting providers " + error);
         }
      };

      getProviders();
   }, []);

   const handleProviderClick = (value: number) => {
      if (selectedProvider === value) {
         setSelectedProvider(0);
      } else {
         setSelectedProvider(value);
      }
   };

   return (
      <>
         {loading ? (
            <div className="flex justify-center items-center w-full h-screen">
               <LoaderPinwheel
                  size={48}
                  className="text-blue-600 animate-spin"
               />
            </div>
         ) : (
            <>
               <DiscoverLayout
                  contentType={contentType}
                  genres={genres}
                  handleGenreClick={handleGenreClick}
                  selectedGenres={selectedGenres}
                  voteAvg={voteAvg}
                  handleVoteAvg={handleVoteAvg}
                  handleVoteCount={handleVoteCount}
                  voteCount={voteCount}
                  providers={providers}
                  handleProviderClick={handleProviderClick}
                  selectedProvider={selectedProvider}
                  loading={loading}
                  dialogOpen={dialogOpen}
                  handleOpenChange={handleOpenChange}
                  data={data}
                  handleSelected={handleSelected}
                  setDialogOpen={setDialogOpen}
                  mobile={mobile}
                  handleMouseEnter={handleMouseEnter}
                  setHovered={setHovered}
                  hovered={hovered}
                  selected={selected}
               />
            </>
         )}
      </>
   );
}
