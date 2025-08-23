import { client, BOOKS_INDEX } from "@/lib/elasticsearch";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // If no query, return all books
    if (!query) {
      const response = await client.search({
        index: BOOKS_INDEX,
        body: {
          query: { match_all: {} },
          size: 10,
        },
      });

      return Response.json({
        status: "success",
        total: response.hits.total,
        books: response.hits.hits.map((hit) => hit._source),
      });
    }

    const genres = query?.split(",").map((g) => g.trim());
    // Search genre
    const response = await client.search({
      index: BOOKS_INDEX,
      body: {
        query: {
          terms: {
            genre: genres,
          },
        },
        size: 10,
      },
    });

    return Response.json({
      status: "success",
      total: response.hits.total,
      query: query,
      books: response.hits.hits.map((hit) => ({
        ...hit._source,
        score: hit._score, // Relevance score
      })),
    });
  } catch (error: any) {
    return Response.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
