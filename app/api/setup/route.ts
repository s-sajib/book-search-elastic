import { client, BOOKS_INDEX } from "@/lib/elasticsearch";

export async function GET() {
  try {
    // Delete index if exists
    try {
      await client.indices.delete({ index: BOOKS_INDEX });
      console.log("Old index deleted");
    } catch (error) {
      console.error("Error deleting index:", error);
      console.log("No existing index to delete");
    }

    // Create new index with mapping
    await client.indices.create({
      index: BOOKS_INDEX,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            author: { type: "text" },
            genre: { type: "keyword" },
            publishYear: { type: "integer" },
            description: { type: "text" },
            rating: { type: "float" },
            price: { type: "float" },
          },
        },
      },
    });

    return Response.json({
      status: "success",
      message: "Books index created successfully!",
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
