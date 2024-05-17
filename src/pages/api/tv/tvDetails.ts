import axios from "axios";

export default async function tvDetails(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
         .get(`https://api.themoviedb.org/3/tv/${id}?api_key=${key}`)
         .then(response => {
            const details = response.data;
            const runtimeMinutes = details.runtime;
            const hours = Math.floor(runtimeMinutes / 60);
            const minutes = runtimeMinutes % 60;
            const seasons = details.seasons;
            const sortSeasons = seasons.sort(
               (a: any, b: any) => a.season_number - b.season_number
            );

            const tvDetails = {
               title: details.name,
               posterPath: details.poster_path,
               backdropPath: details.backdrop_path,
               genres: details.genres,
               voteAvg: Number(details.vote_average.toFixed(1)),
               voteCount: details.vote_count,
               year: details.first_air_date.slice(0, 4),
               overview: details.overview,
               hours,
               minutes,
               tagline: details.tagline,
               numberSeasons: details.number_of_seasons,
               numberEpisodes: details.number_of_episodes,
               seasons: sortSeasons,
            };

            res.status(200).json(tvDetails);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving tv details" + error });
   }
}
