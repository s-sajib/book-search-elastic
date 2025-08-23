"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  initialQuery: string;
  initialGenre?: string;
}

export default function SearchForm({
  initialQuery,
  initialGenre = "",
}: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const router = useRouter();

  // Fetch genres from API on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoadingGenres(true);
        const response = await fetch("/api/genres");
        const data = await response.json();
        
        if (data.status === "success") {
          setGenres(data.genres || []);
        } else {
          console.error("Failed to fetch genres:", data.message);
          // Fallback to empty array
          setGenres([]);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        // Fallback to empty array
        setGenres([]);
      } finally {
        setIsLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL with both parameters
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (genre) params.set("genre", genre);

    const url = params.toString()
      ? `/combined-search?${params.toString()}`
      : "/combined-search";
    router.push(url);
  };

  const clearFilters = () => {
    setQuery("");
    setGenre("");
    router.push("/search");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, descriptions..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
  focus:ring-blue-500"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={isLoadingGenres}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
  focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {isLoadingGenres ? "Loading genres..." : "All Genres"}
          </option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {(query || genre) && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all filters
        </button>
      )}
    </form>
  );
}
