import React from "react";
// import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { logout } from "../features/AuthSlice";
import Footer from "../components/footer";
// import Search from "../components/Search";
// import Navbar from "../components/Navbar";

const categories = [
  {
    name: "Apparel",
    image:
      "https://images.pexels.com/photos/1035685/pexels-photo-1035685.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Electronics",
    image:
      "https://images.pexels.com/photos/5614135/pexels-photo-5614135.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Home Goods",
    image:
      "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Beauty",
    image:
      "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Sports",
    image:
      "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Outdoor",
    image:
      "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Furniture",
    image:
      "https://images.pexels.com/photos/2387754/pexels-photo-2387754.jpeg?auto=compress&cs=tinysrgb&h=500",
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
  },
];

const HomePage: React.FC = () => {
  // const dispatch = useDispatch();

  // const logout1 = () => {
  //   dispatch(logout());
  // };
  const navigate = useNavigate();

  return (
    <div className="bg-[#121212] min-h-screen font-sans flex flex-col text-[#f5f5f5]">
      {/* Header */}
      {/* <Navbar/>` */}

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-10 px-6">
        {/* Banner */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img
            src="public\assets\banner.png"
            alt="Hero Banner"
            className="w-full h-[70vh] object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C3F]/80 via-transparent to-[#FF7E29]/70" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-500 drop-shadow-lg">
              AMAZING 
              <span className="bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500"> DEALS</span>
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl">
              Get the best offers on gadgets, fashion, and more.
            </p>
            <button
              className="mt-8 px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition duration-300 shadow-lg"
              onClick={() => {
                navigate("/category/electronics");
              }}
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Categories */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase()}`}
              className="group relative h-56 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
