import axios from "axios";

export default async function movieVideos(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      axios
            .get(
               `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&append_to_response=videos`
            )
            .then(response => {
               const videos = response.data.results;
               const trailers = videos.filter((v: any) => v.type === "Trailer");

               res.status(200).json(trailers);
            })
   } catch (error) {
      res.status(500).json({ error: "Error receiving movie details" + error });
   }
}
