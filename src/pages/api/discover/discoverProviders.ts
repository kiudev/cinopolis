import axios from "axios";

export default async function discoverProviders(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { contentType } = req.query;

      axios
         .get(
            `https://api.themoviedb.org/3/watch/providers/${contentType}?api_key=${key}&watch_region=ES`
         )
         .then(response => {
            const data = response.data.results.map((providers: any) => ({
               id: providers.provider_id,
               logo: providers.logo_path,
               name: providers.provider_name,
            }));

            res.status(200).json(data);
         });
   } catch (error) {
      res.status(500).json({ error: "Error receiving providers data" + error });
   }
}