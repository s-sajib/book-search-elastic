import { client, BOOKS_INDEX } from "@/lib/elasticsearch";
import SearchForm from "./components/search-form";
import SearchResults from "./components/search-result";

interface SearchPageProps {
  searchParams: {
    q?: string;
    genre?: string;
  };
}

async function searchBooks(query: string) {
  if (!query) return { hits: { hits: [], total: { value: 0 } } };

  return await client.search({
    index: BOOKS_INDEX,
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ["title", "author", "description"],
        },
      },
      size: 10,
    },
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const results = await searchBooks(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>

      <SearchForm initialQuery={query} />

      <SearchResults
        results={results.hits.hits}
        total={results.hits.total?.value || 0}
        query={query}
      />
    </div>
  );
}
