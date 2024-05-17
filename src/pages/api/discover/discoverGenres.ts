import axios from "axios";

export default async function discoverGenres(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;

      await axios
         .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}`)
         .then(response => {
            const data = response.data.genres.map((genre: any) => ({
               id: genre.id,
               name: genre.name,
            }));

            res.status(200).json(data);
         });

   } catch (error) {
      res.status(500).json({ error: "Error receiving genres list" + error });
   }
}