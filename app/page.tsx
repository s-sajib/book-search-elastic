import HomeSearchBar from "./components/home-search-bar";
import AnalyticsDashboard from "./components/analytics-dashboard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="border-b-4 border-black p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-black mb-2 underline">
            BOOK SEARCH ENGINE
          </h1>
          <p className="text-lg mb-6 font-bold">
            Search thousands of books with our super advanced search
          </p>

          <HomeSearchBar />

          <div className="mt-6">
            <Link
              href="/combined-search"
              className="bg-gray-800 text-white px-6 py-2 rounded border-2 border-gray-600 font-bold hover:bg-gray-600"
            >
              Advanced Search Page
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <AnalyticsDashboard />
      </div>

      <div className="border-t-2 border-black p-6 mt-10">
        <div className="container mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/combined-search"
              className="bg-gray-800 text-white px-4 py-2 rounded border hover:bg-gray-600"
            >
              Search Books
            </Link>
            <Link
              href="/api/health"
              className="bg-gray-700 text-white px-4 py-2 rounded border hover:bg-gray-500"
            >
              ES Health
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
