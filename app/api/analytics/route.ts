import { client } from "@/lib/elasticsearch";

const ANALYTICS_INDEX = "search_analytics";

// Setup analytics index mapping (run once)
async function ensureAnalyticsIndex() {
  try {
    const exists = await client.indices.exists({ index: ANALYTICS_INDEX });
    if (!exists) {
      await client.indices.create({
        index: ANALYTICS_INDEX,
        body: {
          mappings: {
            properties: {
              type: { type: "keyword" }, // 'search', 'click'
              query: {
                type: "text", // For search within queries
                fields: {
                  keyword: { type: "keyword" }, // For exact aggregations
                },
              },
              results_count: { type: "integer" },
              timestamp: { type: "date" }, // Time-series data
              user_agent: { type: "keyword" },
              ip: { type: "ip" }, // IP field type for geo analysis
            },
          },
        },
      });
      console.log("Analytics index created");
    }
  } catch (error) {
    console.error("Failed to create analytics index:", error);
  }
}

// POST: Track search events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      query,
      results_count,
      timestamp = new Date().toISOString(),
    } = body;

    // Ensure index exists
    await ensureAnalyticsIndex();

    // Index the analytics event
    await client.index({
      index: ANALYTICS_INDEX,
      body: {
        type,
        query,
        results_count,
        timestamp,
        user_agent: request.headers.get("user-agent") || "unknown",
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
      },
    });

    return Response.json({ status: "success" });
  } catch (error: any) {
    console.error("Analytics tracking error:", error);
    return Response.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve analytics insights
export async function GET() {
  try {
    const response = await client.search({
      index: ANALYTICS_INDEX,
      body: {
        query: {
          bool: {
            must: [
              { 
                terms: { 
                  type: ["search", "suggestion_click"]   // Include both event types
                }
              },
              {
                range: {
                  timestamp: {
                    gte: "now-7d", // Last 7 days
                  },
                },
              },
            ],
          },
        },
        aggs: {
          popular_searches: {
            terms: {
              field: "query.keyword", // Exact query strings
              size: 10,
            },
          },
          searches_over_time: {
            date_histogram: {
              field: "timestamp",
              calendar_interval: "1d", // Daily buckets
              format: "yyyy-MM-dd",
            },
          },
          total_searches: {
            cardinality: {
              // Unique search count
              field: "query.keyword",
            },
          },
          avg_results: {
            avg: {
              field: "results_count", // Average results per search
            },
          },
        },
        size: 0, // Only aggregations, no hits
      },
    });

    return Response.json({
      popular_searches: response.aggregations?.popular_searches?.buckets || [],
      searches_over_time:
        response.aggregations?.searches_over_time?.buckets || [],
      total_unique_searches: response.aggregations?.total_searches?.value || 0,
      avg_results_per_search: response.aggregations?.avg_results?.value || 0,
    });
  } catch (error: any) {
    // Analytics index might not exist yet or no data
    console.error("Analytics retrieval error:", error);
    return Response.json({
      popular_searches: [],
      searches_over_time: [],
      total_unique_searches: 0,
      avg_results_per_search: 0,
    });
  }
}
