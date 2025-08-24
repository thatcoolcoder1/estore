import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/AuthSlice";

const categories = [
  {
    name: "Apparel",
    image:
      "https://images.pexels.com/photos/1035685/pexels-photo-1035685.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Electronics",
    image:
      "https://images.pexels.com/photos/5614135/pexels-photo-5614135.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Home Goods",
    image:
      "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Beauty",
    image:
      "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Sports",
    image:
      "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Outdoor",
    image:
      "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Furniture",
    image:
      "https://images.pexels.com/photos/2387754/pexels-photo-2387754.jpeg?auto=compress&cs=tinysrgb&h=350",
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&q=80",
  },
  {
    name: "Tools",
    image:
      "https://images.unsplash.com/photo-1581090700227-4c4c0d7a4a0f?w=600&h=600&q=80",
  },
  {
    name: "Toys",
    image:
      "https://images.unsplash.com/photo-1601758123927-1965c0c7c3ac?w=600&h=600&q=80",
  },
];

const HomePage: React.FC = () => {
  const dispatch = useDispatch();

  const logout1 = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            eStore
          </h1>
          <button
            onClick={logout1}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl mb-14">
          <img
            src="https://images.unsplash.com/photo-1441984904561-bf29c5950a36?w=1200&q=80"
            alt="Promotional Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
          Shop by Category
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name
                .toLowerCase()
                .replace(/\s/g, "-")}`}
              className="relative block group rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-6">
                  <h3 className="text-white text-xl font-semibold uppercase tracking-wide drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
