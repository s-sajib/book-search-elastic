interface Aggregation {
  genres?: {
    buckets: Array<{ key: string; doc_count: number }>;
  };
  avg_rating?: {
    value: number;
  };
  price_ranges?: {
    buckets: Array<{ key: string; doc_count: number }>;
  };
  publish_years?: {
    buckets: Array<{ key: string; doc_count: number }>;
  };
}

interface SearchSummaryProps {
  aggregations: Aggregation;
  total: number;
  query?: string;
  genre?: string;
}

export default function SearchSummary({
  aggregations,
  total,
  query,
  genre,
}: SearchSummaryProps) {
  if (total === 0) return null;

  const topGenre = aggregations.genres?.buckets[0];
  const avgRating = aggregations.avg_rating?.value;
  const topPriceRange = aggregations.price_ranges?.buckets.reduce(
    (prev, current) => (prev.doc_count > current.doc_count ? prev : current)
  );

  return (
    <div className="border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        Search Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        {/* Total Results */}
        <div className="border border-primary rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-gray-600">Books Found</div>
        </div>

        {/* Average Rating */}
        {avgRating && (
          <div className="border border-primary rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {avgRating.toFixed(1)}
            </div>
            <div className="text-gray-600">Avg Rating</div>
          </div>
        )}

        {/* Top Genre */}
        {topGenre && (
          <div className="border border-primary rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-600">
              {topGenre.key}
            </div>
            <div className="text-gray-600">Most Common Genre</div>
            <div className="text-sm text-gray-500">
              ({topGenre.doc_count} books)
            </div>
          </div>
        )}

        {/* Popular Price Range */}
        {topPriceRange && (
          <div className="border border-primary rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-orange-600">
              {topPriceRange.key}
            </div>
            <div className="text-gray-600">Popular Price Range</div>
            <div className="text-sm text-gray-500">
              ({topPriceRange.doc_count}
              books)
            </div>
          </div>
        )}
      </div>

      {/* Search Context */}
      {(query || genre) && (
        <div className="mt-4 text-sm text-gray-600">
          {query && (
            <span>
              Searching for: <strong>"{query}"</strong>
            </span>
          )}
          {query && genre && <span> • </span>}
          {genre && (
            <span>
              Filtered by: <strong>{genre}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
