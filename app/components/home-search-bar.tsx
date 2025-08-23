"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Suggestion {
  corrections: Array<{ text: string; score: number }>;
  matches: Array<{ title: string; author: string; type: string }>;
}

export default function HomeSearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
    if (!searchQuery.trim()) return;
    router.push(`/combined-search?q=${encodeURIComponent(searchQuery)}`);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "suggestion_click",
        query: suggestion,
        results_count: 0,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions && setShowSuggestions(true)}
            placeholder="Search for books, authors..."
            className="w-full p-3 border-2 border-gray-800 rounded text-base"
          />

          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              Loading...
            </div>
          )}

          {showSuggestions && suggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 border border-gray-800 rounded mt-1 max-h-96 overflow-y-auto z-50 bg-zinc-900"
            >
              {suggestions.corrections &&
                suggestions.corrections.length > 0 && (
                  <div className="p-3 border-b border-gray-300">
                    <div className="text-xs text-gray-500 mb-2">
                      Did you mean?
                    </div>
                    {suggestions.corrections
                      .slice(0, 3)
                      .map((correction, index) => (
                        <div
                          key={index}
                          onClick={() => selectSuggestion(correction.text)}
                          className="cursor-pointer p-2 text-sm border border-gray-400 hover:border-gray-600 rounded mb-1"
                        >
                          {correction.text}
                        </div>
                      ))}
                  </div>
                )}

              {suggestions.matches && suggestions.matches.length > 0 && (
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-2">Suggestions</div>
                  {suggestions.matches.map((match, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(match.title)}
                      className="cursor-pointer p-2 text-sm border border-gray-300 hover:border-gray-500 rounded mb-1"
                    >
                      <div className="font-bold">{match.title}</div>
                      <div className="text-xs text-gray-600">
                        by {match.author}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!suggestions.corrections ||
                suggestions.corrections.length === 0) &&
                (!suggestions.matches || suggestions.matches.length === 0) && (
                  <div className="p-3 text-sm text-gray-500">
                    No suggestions found
                  </div>
                )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gray-800 text-white rounded text-base hover:bg-gray-600"
        >
          Search
        </button>
      </form>
    </div>
  );
}
