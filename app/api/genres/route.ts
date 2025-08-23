import { client, BOOKS_INDEX } from "@/lib/elasticsearch";

export async function GET() {
  try {
    // Use aggregation to get unique genres
    const response = await client.search({
      index: BOOKS_INDEX,
      body: {
        size: 0, // Don't return documents, just aggregations
        aggs: {
          unique_genres: {
            terms: {
              field: "genre", // Genre is already a keyword field
              size: 100, // Limit to 100 unique genres
              order: {
                _key: "asc" // Sort alphabetically
              }
            }
          }
        }
      }
    });

    // Extract genre names from aggregation buckets
    const genres = response.aggregations?.unique_genres?.buckets?.map(
      (bucket: any) => bucket.key
    ) || [];

    return Response.json({
      status: "success",
      genres: genres
    });
  } catch (error: any) {
    console.error("Error fetching genres:", error);
    return Response.json(
      {
        status: "error",
        message: error.message,
        genres: [] // Return empty array as fallback
      },
      { status: 500 }
    );
  }
}