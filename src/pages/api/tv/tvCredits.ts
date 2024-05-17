import axios from "axios";

export default async function tvCredits(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
            .get(
               `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${key}`
            )
            .then(response => {
               const cast = response.data.cast;

               const filterCast = cast.splice(0, 4);
               const popularCast = filterCast.sort(
                  (a: any, b: any) => b.popularity - a.popularity
               );

               const crew = response.data.crew;

               const executiveProducer = crew.filter(
                  (c: any) => c.job === "Executive Producer"
               );
               const popularProducer = executiveProducer.sort(
                  (a: any, b: any) => (b.popularity = a.popularity)
               );

               res.status(200).json({ cast: cast, popularCast: popularCast, popularProducer: popularProducer, crew: crew })
            })
            .catch(error => {
               console.error("Error fetching tv credits:", error);
            });
   } catch (error) {
      res.status(500).json({ error: "Error receiving tv credits" + error });
   }
}
