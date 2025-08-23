import { client, BOOKS_INDEX } from "@/lib/elasticsearch";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return Response.json({ suggestions: [] });
    }

    // Get autocomplete suggestions
    const response = await client.search({
      index: BOOKS_INDEX,
      body: {
        suggest: {
          title_suggest: {
            text: query,
            term: {
              field: "title",
              suggest_mode: "popular",
              size: 5,
            },
          },
          author_suggest: {
            text: query,
            term: {
              field: "author",
              suggest_mode: "popular",
              size: 3,
            },
          },
        },
        // Also get partial matches
        query: {
          bool: {
            should: [
              {
                match_phrase_prefix: {
                  title: {
                    query: query,
                    max_expansions: 10,
                  },
                },
              },
              {
                match_phrase_prefix: {
                  author: {
                    query: query,
                    max_expansions: 10,
                  },
                },
              },
            ],
          },
        },
        _source: ["title", "author"],
        size: 5,
      },
    });

    // Extract suggestions
    const titleSuggestions =
      response.suggest?.title_suggest?.[0]?.options || [];
    const authorSuggestions =
      response.suggest?.author_suggest?.[0]?.options || [];
    const matchSuggestions = response.hits.hits.map((hit) => ({
      title: hit._source?.title,
      author: hit._source?.author,
      type: "match",
    }));

    return Response.json({
      suggestions: {
        corrections: [...titleSuggestions, ...authorSuggestions],
        matches: matchSuggestions,
      },
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
