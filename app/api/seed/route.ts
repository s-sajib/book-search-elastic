import { client, BOOKS_INDEX } from "@/lib/elasticsearch";
import { sampleBooks } from "@/data/sample-book";

export async function GET() {
  try {
    // Add books to Elasticsearch
    for (const book of sampleBooks) {
      await client.index({
        index: BOOKS_INDEX,
        id: book.id,
        body: book,
      });
    }

    // Refresh index to make documents searchable immediately
    await client.indices.refresh({ index: BOOKS_INDEX });

    return Response.json({
      status: "success",
      message: `${sampleBooks.length} books added successfully!`,
      books: sampleBooks.length,
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
