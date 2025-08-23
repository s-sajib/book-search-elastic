"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PopularSearch {
  key: string;
  doc_count: number;
}

interface SearchOverTime {
  key_as_string: string;
  doc_count: number;
}

interface AnalyticsData {
  popular_searches: PopularSearch[];
  searches_over_time: SearchOverTime[];
  total_unique_searches: number;
  avg_results_per_search: number;
  avg_search_time: number;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center border border-black bg-gray-100 m-5">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-5 text-center border border-red-500 bg-red-100 m-5">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="p-5 border-2 border-black m-5">
      <h2 className="text-2xl font-bold mb-5 underline">
        Search Analytics Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="p-4 border-2 border-gray-600 shadow-lg">
          <h3 className="text-lg mb-3 font-bold">Total Stats</h3>
          <div className="text-3xl font-black">
            {analytics.total_unique_searches}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            Unique Searches
          </div>
        </div>

        <div className="p-4 border-2 border-gray-600 shadow-lg">
          <h3 className="text-lg mb-3 font-bold">Average Results</h3>
          <div className="text-3xl font-black">
            {analytics.avg_results_per_search.toFixed(1)}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            Results per Search
          </div>
        </div>

        <div className="p-4 border-2 border-gray-600 shadow-lg">
          <h3 className="text-lg mb-3 font-bold">Today</h3>
          <div className="text-3xl font-black">
            {analytics.searches_over_time.reduce(
              (total, day) => total + day.doc_count,
              0
            )}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            Total Searches
          </div>
        </div>

        <div className="p-4 border-2 border-gray-600 shadow-lg">
          <h3 className="text-lg mb-3 font-bold">Avg Speed</h3>
          <div className="text-3xl font-black">
            {analytics.avg_search_time.toFixed(4)}s
          </div>
          <div className="text-sm text-gray-700 font-medium">Search Time</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="p-4 border border-black">
          <h3 className="text-xl mb-4 font-bold border-b-2 border-gray-400 pb-2">
            Popular Searches
          </h3>
          {analytics.popular_searches.length === 0 ? (
            <div className="text-gray-500 text-center p-5 border">
              No searches yet
            </div>
          ) : (
            <div className="space-y-2">
              {analytics.popular_searches.slice(0, 8).map((search, index) => (
                <Link
                  key={search.key}
                  href={`/combined-search?q=${encodeURIComponent(search.key)}`}
                  className="block"
                >
                  <div className="flex justify-between items-center p-3 border border-gray-400 hover:border-gray-600 cursor-pointer">
                    <span className="font-bold">
                      #{index + 1} "{search.key}"
                    </span>
                    <span className="px-2 py-1 text-xs border border-black font-bold">
                      {search.doc_count} searches
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border border-black">
          <h3 className="text-xl mb-4 font-bold border-b-2 border-gray-400 pb-2">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="p-3 border border-gray-400">
              <div className="font-bold">Most Popular</div>
              <div className="text-sm font-medium">
                {analytics.popular_searches[0]?.key || "No data"}
              </div>
            </div>

            <div className="p-3 border border-gray-400">
              <div className="font-bold">Search Types</div>
              <div className="text-sm font-medium">
                {analytics.popular_searches.length} different queries
              </div>
            </div>

            <div className="p-3 border border-gray-400">
              <div className="font-bold">Search Activity Level</div>
              <div className="text-sm font-medium">
                {analytics.searches_over_time.length > 0 ? "Active" : "Quiet"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
