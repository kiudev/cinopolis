import { useState, useEffect } from "react";
import axios from "axios";
import { key } from "@/app/key";

import { ChangeEvent } from "react";
import { useMediaQuery } from "usehooks-ts";
import DiscoverLayout from "@/components/layout/DiscoverLayout";

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

   const getData = (pageNumber: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/discover/${contentType}?api_key=${key}&page=${pageNumber}&with_genres=${selectedGenres}&vote_average.gte=${voteAvg}&sort_by=${voteCount}${
                  "" || "&with_watch_providers="
               }${selectedProvider || ""}&watch_region=ES&language=en-US`
            )
            .then(response => {
               const results = response.data.results.map((data: any) => ({
                  id: data.id,
                  title: data.name,
                  overview: data.overview,
                  posterPath: data.poster_path,
                  year: data.first_air_date.slice(0, 4),
                  voteAverage: Number(data.vote_average.toFixed(1)),
                  voteCount: data.vote_count,
                  backdropPath: data.backdrop_path,
                  genreId: data.genre_ids,
               }));

               setData(results);
            });
      } catch (error) {
         console.error("Error loading results", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getData(currentPage);
   }, [currentPage, selectedGenres, voteAvg, voteCount, selectedProvider]);

   const getCast = (id: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/${contentType}/${id}/credits?api_key=${key}`
            )
            .then(response => {
               const castData = response.data.cast.map((actor: any) => ({
                  id: actor.id,
                  name: actor.name,
                  profilePath: actor.profile_path,
                  nameCharacter: actor.character,
                  popularity: actor.popularity,
               }));

               const sortPopularity = castData.sort(
                  (a: any, b: any) => b.popularity - a.popularity
               );

               const popularActors = sortPopularity.slice(0, 5);

               setSelected(prevData => {
                  if (prevData === false) {
                     return prevData;
                  } else {
                     return { ...prevData, cast: popularActors };
                  }
               });
            });
      } catch (error) {
         console.error("Error loading movie details", error);
      }
   };

   const getImages = (id: number) => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/${contentType}/${id}/images?api_key=${key}`
            )
            .then(response => {
               const images = response.data.backdrops.map((backdrop: any) => ({
                  filePath: backdrop.file_path,
               }));

               setBackdrop(images);
            });
      } catch (error) {
         console.error("Error loading images", error);
      }
   };

   const handleMouseEnter = (id: number) => {
      setHovered(id);
   };

   const handleSelected = (id: number) => {
      const resultFound = data.find(result => result.id === id);

      if (resultFound) {
         getCast(id);
         getImages(id);
         setSelected(resultFound);
         setDialogOpen(true);
      }
   };

   const handleOpenChange = () => {
      setDialogOpen(!dialogOpen);
   };

   const getGenres = () => {
      try {
         axios
            .get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${key}`)
            .then(response => {
               const data = response.data.genres.map((genre: any) => ({
                  id: genre.id,
                  name: genre.name,
               }));
               setGenres(data);
            });
      } catch (error) {
         console.error("Error getting genres" + error);
      }
   };

   useEffect(() => {
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

   const getProviders = () => {
      try {
         axios
            .get(
               `https://api.themoviedb.org/3/watch/providers/tv?api_key=${key}&watch_region=ES`
            )
            .then(response => {
               const data = response.data.results.map((providers: any) => ({
                  id: providers.provider_id,
                  logo: providers.logo_path,
                  name: providers.provider_name,
               }));

               setProviders(data);
            });
      } catch (error) {
         console.error("Error getting providers " + error);
      }
   };

   useEffect(() => {
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
   );
}
