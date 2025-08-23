import { client } from "@/lib/elasticsearch";

export async function GET() {
  try {
    const response = await client.info();

    return Response.json({
      status: "success",
      message: "Connected to Elasticsearch!",
      elasticsearch: {
        version: response.version.number,
        cluster_name: response.cluster_name,
        name: response.name,
      },
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Failed to connect to Elasticsearch",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
