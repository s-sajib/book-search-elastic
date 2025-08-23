import AutocompleteSearch from "@/app/combined-search/components/auto-complete-search";
import SearchSummary from "@/app/combined-search/components/search-summary";
import { BOOKS_INDEX, client } from "@/lib/elasticsearch";
import AnalyticsTracker from "./components/analytics-tracker";
import SearchResults from "./components/search-result";

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

  const results = await client.search({
    index: BOOKS_INDEX,
    body: {
      query: searchQuery,
      size: 10,

      aggs: {
        genres: {
          terms: {
            field: "genre",
            size: 10,
          },
        },
        avg_rating: {
          avg: {
            field: "rating",
          },
        },
        price_ranges: {
          range: {
            field: "price",
            ranges: [
              { key: "Under $15", to: 15 },
              { key: "$15-$20", from: 15, to: 20 },
              { key: "Over $20", from: 20 },
            ],
          },
        },
        publish_years: {
          range: {
            field: "publishYear",
            ranges: [
              { key: "Classic (Before 1950)", to: 1950 },
              { key: "Mid-Century (1950-1990)", from: 1950, to: 1990 },
              { key: "Modern (1990+)", from: 1990 },
            ],
          },
        },
      },
    },
  });

  return results;
}

// Update the component
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const genre = searchParams.genre || "";

  const results = await searchBooks(query, genre || undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Search</h1>

      {/* Analytics tracking (client-side only) */}
      <AnalyticsTracker
        query={query}
        resultsCount={results.hits.total?.value || 0}
      />

      {/* <SearchForm initialQuery={query} initialGenre={genre} /> */}
      <AutocompleteSearch initialQuery={query} initialGenre={genre} />
      <SearchSummary
        aggregations={results.aggregations || {}}
        total={results.hits.total?.value || 0}
        query={query}
        genre={genre}
      />
      <SearchResults
        results={results.hits.hits}
        total={results.hits.total?.value || 0}
        query={query}
        genre={genre}
      />
    </div>
  );
}
