import axios from "axios";

export default async function personDetails(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
         .get(`https://api.themoviedb.org/3/person/${id}?api_key=${key}`)
         .then(response => {
            const details = response.data;
            // const runtimeMinutes = details.runtime;
            // const hours = Math.floor(runtimeMinutes / 60);
            // const minutes = runtimeMinutes % 60;

            const personDetails = {
               biography: details.biography,
               birthday: details.birthday,
               deathday: details.deathday,
               name: details.name,
               placeOfBirth: details.place_of_birth,
               profilePath: details.profile_path,
            };
            
            res.status(200).json(personDetails);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving person details" + error });
   }
}
