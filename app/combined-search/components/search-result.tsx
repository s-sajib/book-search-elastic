import { Book } from "@/types/book";

interface SearchResultsProps {
  results: Array<{
    _source: Book;
    _score?: number;
  }>;
  total: number;
  query: string;
  genre?: string;
}

export default function SearchResults({
  results,
  total,
  query,
  genre,
}: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-gray-500 text-center py-8">
        Enter a search term to find books
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No books found for "{query}"
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6">
        {results.map((hit) => {
          const book = hit._source;
          const score = hit._score;

          return (
            <div
              key={book.id}
              className="border border-gray-200 rounded-lg p-6
  hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    by <span className="font-medium">{book.author}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${book.price}
                  </div>
                  {score && (
                    <div className="text-xs text-gray-400">
                      Relevance Score: {score.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.genre.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-blue-500 text-gray-100 text-sm
  rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-gray-400 mb-3">{book.description}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Published: {book.publishYear}</span>
                  <span>Rating: {book.rating}/5</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
