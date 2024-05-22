import axios from "axios";

export default async function personCredits(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { id } = req.query;

      await axios
         .get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${key}`)
         .then(response => {
            const credits = response.data.cast;
            
            res.status(200).json(credits);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving person credits" + error });
   }
}
