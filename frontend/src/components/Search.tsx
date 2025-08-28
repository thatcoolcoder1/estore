import React, { useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string[];
  price: number;
  category: string;
  countInStock: number;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<Product[]>(
        `http://localhost:3000/api/products/search?query=${encodeURIComponent(query)}`
      );

      if (!Array.isArray(data) || data.length === 0) {
        setResults([]);
        setError("No products found.");
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setResults([]);
      setError(err.response?.data?.message || "Search failed. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-950 text-gray-100 w-full py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="flex-1 p-2 rounded-md border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <button
            onClick={handleSearch}
            className="bg-emerald-500 text-gray-950 px-4 py-2 rounded-md hover:bg-emerald-600 transition"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-emerald-400 animate-pulse mb-4">Searching...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-3">
          {results.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`}>
              <div className="flex items-center gap-4 p-3 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-emerald-500/20 transition">
                {/* Product Thumbnail */}
                {item.image[0] && (
                  <img
                    src={item.image[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-emerald-400 font-semibold">{item.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{item.description}</p>
                  <p className="text-gray-100 font-bold mt-1">₹{item.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
