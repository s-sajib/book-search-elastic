import SearchForm from "./components/search-form";
import SearchResults from "./components/search-result";
import { BOOKS_INDEX, client } from "@/lib/elasticsearch";

interface SearchPageProps {
  searchParams: {
    q?: string;
    genre?: string;
  };
}

async function searchBooks(query: string, genre?: string) {
  if (!query && !genre) {
    return { hits: { hits: [], total: { value: 0 } } };
  }

  // Build the Elasticsearch query
  let searchQuery: any;

  if (query && genre) {
    // BOTH text search AND genre filter
    searchQuery = {
      bool: {
        must: [
          {
            multi_match: {
              query: query,
              fields: ["title", "author", "description"],
            },
          },
        ],
        filter: [
          {
            term: {
              genre: genre,
            },
          },
        ],
      },
    };
  } else if (query) {
    // Only text search
    searchQuery = {
      multi_match: {
        query: query,
        fields: ["title", "author", "description"],
      },
    };
  } else if (genre) {
    // Only genre filter
    searchQuery = {
      term: {
        genre: genre,
      },
    };
  }

  return await client.search({
    index: BOOKS_INDEX,
    body: {
      query: searchQuery,
      size: 10,
    },
  });
}

// Update the component
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const genre = searchParams.genre || "";

  const results = await searchBooks(query, genre || undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>

      <SearchForm initialQuery={query} initialGenre={genre} />

      <SearchResults
        results={results.hits.hits}
        total={results.hits.total?.value || 0}
        query={query}
        genre={genre}
      />
    </div>
  );
}
