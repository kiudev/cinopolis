import axios from "axios";

export default async function tvEpisodes(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id, seasonNumber } = req.query;

      await axios
            .get(
               `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${key}`
            )
            .then(response => {
               const episodesData = response.data.episodes;
               const runtimeMinutes = episodesData.runtime;
               const hours = Math.floor(runtimeMinutes / 60);
               const minutes = runtimeMinutes % 60;
               const sortEpisodes = episodesData.sort(
                  (a: any, b: any) => a.episode_number - b.episode_number
               );

               res.status(200).json(episodesData);
            })
            .catch(error => {
               console.error("Error fetching episodes:", error);
            });
   } catch (error) {
      res.status(500).json({ error: "Error receiving tv episodes" + error });
   }
}
