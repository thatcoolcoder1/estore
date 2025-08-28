import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/AuthSlice";
import axios from "axios";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string[];
  price: number;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Product[]>(
        `http://localhost:3000/api/products/search?query=${encodeURIComponent(
          query
        )}`
      );
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setResults([]);
      setError(err.response?.data?.message || "Search failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="bg-gray-950 text-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/src/assets/es.png"
              alt="eStore Logo"
              className="w-50 h-50 object-contain "
            />
            {/* <span className="text-xl font-bold text-gray-100">eStore</span> */}
          </Link>

          {/* Navigation Links + Search */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <Link
              to="/"
              className="text-gray-100 hover:text-emerald-400 transition font-medium"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-100 hover:text-emerald-400 transition font-medium">
                Products
              </button>

              <div className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform transition duration-200 ease-in-out scale-95 group-hover:scale-100 z-10">
                <ul className="py-2">
                  {[
                    { name: "Apparel", slug: "apparel" },
                    { name: "Electronics", slug: "electronics" },
                    { name: "Home Goods", slug: "home-goods" },
                    { name: "Sports", slug: "sports" },
                    { name: "Beauty", slug: "beauty" },
                    { name: "Outdoor", slug: "outdoor" },
                    { name: "Furniture", slug: "furniture" },
                  ].map((category) => (
                    <li key={category.slug}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="block px-4 py-2 text-gray-100 hover:bg-emerald-500 hover:text-gray-900 transition"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to="/order"
              className="text-gray-100 hover:text-emerald-400 transition font-medium"
            >
              Orders
            </Link>

            {/* Search */}
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-80 p-3 rounded-lg border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />

              {results.length > 0 && (
                <div className="absolute top-full mt-2 w-[32rem] max-h-[32rem] bg-gray-900 border border-gray-800 rounded-xl overflow-y-auto z-50 shadow-2xl p-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-emerald-500/50 hover:scrollbar-thumb-emerald-500/70">
                  {results.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      className="flex items-center gap-4 p-3 bg-gray-900 border border-gray-800 hover:shadow-lg hover:shadow-emerald-500/20 rounded-lg transition"
                      onClick={() => setResults([])}
                    >
                      {item.image[0] && (
                        <img
                          src={item.image[0]}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="text-emerald-400 font-semibold text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {item.description}
                        </p>
                      </div>
                      <p className="text-gray-100 font-semibold text-sm whitespace-nowrap">
                        ₹{item.price}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {loading && (
                <div className="absolute top-full mt-2 w-96 bg-gray-900 border border-gray-800 rounded-xl p-3 text-emerald-400 text-sm animate-pulse shadow-2xl">
                  Searching...
                </div>
              )}

              {error && (
                <div className="absolute top-full mt-2 w-96 bg-gray-900 border border-gray-800 rounded-xl p-3 text-red-500 text-sm shadow-2xl">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="bg-emerald-500 text-gray-950 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition"
            >
              Cart
            </Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
