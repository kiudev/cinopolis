import axios from "axios";

export default async function discoverCast(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { contentType, id } = req.query;

      await axios
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

            res.status(200).json(popularActors);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving cast data" + error });
   }
}