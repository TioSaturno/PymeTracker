import {
  Client,
  TextSearchResponse,
  PlaceDetailsResponse,
  Language,
} from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({});

export async function getPlacesData(
  topic: string,
  location: string,
  nResults: number = 3,
) {
  const apiKey = process.env.PLACES_API_KEY;
  if (!apiKey) {
    console.error(
      "❌ Faltan credenciales: No se ha encontrado PLACES_API_KEY en .env",
    );
    return;
  }

  console.log(
    `Buscando "${topic}" en "${location}" con google maps (la api de PLACES antigua)...`,
  );

  try {
    // Text Search para obtener los IDs de los negocios
    const searchResponse: TextSearchResponse = await client.textSearch({
      params: {
        query: `${topic} ${location}`,
        key: apiKey,
        language: Language.es,
        region: "cl",
      },
    });

    const results = searchResponse.data.results.slice(0, nResults);

    if (results.length === 0) {
      console.log("No se encontraron resultados para esta búsqueda.");
      return;
    }

    console.log(
      `Se encontraron ${results.length} lugares. Obteniendo detalles de c/u...`,
    );

    const pymesData = [];

    // Por cada negocio, pedimos Place Details (para URL y Reseñas)
    for (const place of results) {
      if (!place.place_id) continue;

      try {
        const detailsResponse: PlaceDetailsResponse = await client.placeDetails(
          {
            params: {
              place_id: place.place_id,
              key: apiKey,
              language: Language.es,
              fields: [
                "name",
                "formatted_address",
                "rating",
                "user_ratings_total",
                "website",
                "reviews",
                "url",
                "price_level",
              ],
            },
          },
        );

        const d = detailsResponse.data.result;

        // Mapear price_level (0 a 4) a signos $ para el LLM (aunq quiza el de 0 a 4 le puede servir mas. hay q hacer pruebas)
        let nivelPrecio = "No especificado";
        if (d.price_level !== undefined) {
          nivelPrecio = "$".repeat(d.price_level) || "Gratis";
        }

        pymesData.push({
          nombre: d.name,
          direccion: d.formatted_address,
          rating: d.rating,
          rango_precio: nivelPrecio,
          total_resenas: d.user_ratings_total,
          google_maps_url: d.url,
          sitio_web: d.website || "No tiene sitio web",
          ultimas_resenas_texto: d.reviews
            ? d.reviews.map((r) => `"${r.text}" (${r.rating}⭐)`).slice(0, 5) // Exponemos solo los 5 textos, esto se puede cambiar si es q queremos mas reseñas.
            : [],
        });
      } catch (err) {
        console.error(
          `Error obteniendo detalles del place_id ${place.place_id}:`,
          err,
        );
      }
    }

    console.log("\n========================================");
    console.log(JSON.stringify(pymesData, null, 2));
    console.log("========================================");

    return pymesData;
  } catch (error) {
    console.error("❌ Error global de la API:", error);
  }
}

// Ejecución de prueba
// getPlacesData("cafeteria", "santiago centro", 10);
