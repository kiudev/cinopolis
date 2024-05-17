import axios from "axios";

export default async function movieDetails(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
         .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}`)
         .then(response => {
            const details = response.data;
            const runtimeMinutes = details.runtime;
            const hours = Math.floor(runtimeMinutes / 60);
            const minutes = runtimeMinutes % 60;

            const movieDetails = {
               title: details.title,
               posterPath: details.poster_path,
               backdropPath: details.backdrop_path,
               genres: details.genres,
               voteAvg: Number(details.vote_average.toFixed(1)),
               voteCount: details.vote_count,
               year: details.release_date.slice(0, 4),
               overview: details.overview,
               hours,
               minutes,
               tagline: details.tagline,
            };
            
            res.status(200).json(movieDetails);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving movie details" + error });
   }
}
