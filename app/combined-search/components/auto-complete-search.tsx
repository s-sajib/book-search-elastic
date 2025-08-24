"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Suggestion {
  corrections: Array<{ text: string; score: number }>;
  matches: Array<{ title: string; author: string; type: string }>;
}

interface AutocompleteSearchProps {
  initialQuery: string;
  initialGenre?: string;
}

export default function AutocompleteSearch({
  initialQuery,
  initialGenre = "",
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
          setGenres([]);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenres([]);
      } finally {
        setIsLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Fetch suggestions on query change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions(null);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/suggestions?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (genre) params.set("genre", genre);

    const url = params.toString()
      ? `/combined-search?${params.toString()}`
      : "/combined-search";
    router.push(url);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    // Track suggestion click
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "suggestion_click",
        query: suggestion,
        results_count: 0, // Will be counted in actual search
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {}); // Silent fail
    handleSearch(suggestion);
  };

  return (
    <div className="relative mb-8">
      <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
        {/* Search Input with Autocomplete */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions && setShowSuggestions(true)}
            placeholder="Search books, authors, descriptions..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
  focus:ring-blue-500 focus:border-transparent"
          />

          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-3 top-3">
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2
  border-blue-500"
              ></div>
            </div>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0  border
  border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50 bg-zinc-900"
            >
              {/* Spelling Corrections */}
              {suggestions.corrections &&
                suggestions.corrections.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">
                      Did you mean?
                    </div>
                    {suggestions.corrections
                      .slice(0, 3)
                      .map((correction, index) => (
                        <div
                          key={index}
                          onClick={() => selectSuggestion(correction.text)}
                          className="cursor-pointer hover:border p-2 rounded text-sm
  text-blue-400"
                        >
                          🔍 {correction.text}
                        </div>
                      ))}
                  </div>
                )}

              {/* Book Matches */}
              {suggestions.matches && suggestions.matches.length > 0 && (
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-2">Suggestions</div>
                  {suggestions.matches.map((match, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(match.title)}
                      className="cursor-pointer hover:border p-2 rounded text-sm"
                    >
                      <div className="font-medium">{match.title}</div>
                      <div className="text-gray-500 text-xs">
                        by {match.author}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No suggestions */}
              {(!suggestions.corrections ||
                suggestions.corrections.length === 0) &&
                (!suggestions.matches || suggestions.matches.length === 0) && (
                  <div className="p-3 text-gray-500 text-sm">
                    No suggestions found
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Genre Filter */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={isLoadingGenres}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
  focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      {/* Clear filters */}
      {(query || genre) && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setGenre("");
            router.push("/combined-search");
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
