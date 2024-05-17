import axios from "axios";

export default async function discoverData(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const {
         contentType,
         pageNumber,
         selectedGenres,
         voteAvg,
         voteCount,
         selectedProvider,
      } = req.query;

      let url = `https://api.themoviedb.org/3/discover/${contentType}?api_key=${key}&page=${pageNumber}&with_genres=${selectedGenres}&vote_average.gte=${voteAvg}&sort_by=${voteCount}&watch_region=ES&language=en-US`;

      if (selectedProvider !== "0") {
         url += `&with_watch_providers=${selectedProvider}`;
      }

      const response = await axios.get(url);

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

      res.status(200).json(results);
   } catch (error) {
      res.status(500).json({ error: "Error receiving discover data" });
   }
}
