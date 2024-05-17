import axios from "axios";

export default async function query(req: any, res: any) {
   try {
      const key = process.env.TMDB_API_KEY;
      const { title } = req.query;

      const response = await axios.get(
         `https://api.themoviedb.org/3/search/multi?query=${title}&api_key=${key}`
      );

      const responseQuery = response.data.results.map((query: any) => {
         const {
            id,
            title,
            poster_path,
            release_date,
            name,
            profile_path,
            first_air_date,
            known_for_department,
            known_for,
            media_type,
         } = query;

         const releaseDateObj = new Date(release_date);
         const firstAirDateObj = new Date(first_air_date);

         const year = releaseDateObj.getFullYear();
         const firstAirYear = firstAirDateObj.getFullYear();

         return {
            id,
            title,
            posterPath: poster_path,
            year,
            name,
            profilePath: profile_path,
            firstAirYear,
            knownForDepartment: known_for_department,
            knownFor: known_for,
            mediaType: media_type,
         };
      });

      res.status(200).json(responseQuery);
   } catch (error) {
      res.status(500).json({ error: "Error al obtener los datos" });
   }
}
