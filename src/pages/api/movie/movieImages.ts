import axios from "axios";

export default async function movieImages(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
            .get(
               `https://api.themoviedb.org/3/movie/${id}/images?api_key=${key}`
            )
            .then(response => {
               const images = response.data.backdrops;
               const popularImages = images.sort(
                  (a: any, b: any) => b.vote_average - a.vote_average
               );
               
               res.status(200).json(popularImages);
            })
            .catch(error => {
               console.error("Error fetching movie images:", error);
            });
   } catch (error) {
      res.status(500).json({ error: "Error receiving movie images" + error });
   }
}
