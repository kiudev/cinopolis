import axios from "axios";

export default async function movieCredits(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
            .get(
               `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}`
            )
            .then(response => {
               const credits = response.data;

               const cast = credits.cast;

               const filterCast = cast.splice(0, 4);
               const popularCast = filterCast.sort(
                  (a: any, b: any) => b.popularity - a.popularity
               );

               const crew = response.data.crew;

               const director = crew.filter((c: any) => c.job === "Director");
               const popularDirectors = director.sort(
                  (a: any, b: any) => (b.popularity = a.popularity)
               );

               res.status(200).json({ cast: cast, popularCast: popularCast, popularDirectors: popularDirectors, crew: crew })
            })
            .catch(error => {
               console.error("Error fetching movie credits:", error);
            });
   } catch (error) {
      res.status(500).json({ error: "Error receiving movie details" + error });
   }
}
