import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../features/CartSlice.ts";
import type { RootState } from "../app/store.ts";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string[];
  price: number;
  category: string;
  countInStock: number;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setError("Category not found in URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get<Product[]>(
          `http://localhost:3000/api/products/category/${category}`
        );
        setProducts(response.data);
      } catch (err: any) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = async (product: Product) => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const cartItem = {
        product: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
      };

      dispatch(addItemToCart(cartItem));

      await axios.post(
        "http://localhost:3000/api/cart/",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`${product.title} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-xl font-medium text-gray-300 animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center">
          <button
            className="mr-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 font-medium transition"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-emerald-400 tracking-wide">
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : ""}
          </h1>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-900 rounded-2xl border border-gray-800 shadow-md hover:shadow-emerald-500/20 transition duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <Link to={`/product/${product._id}`}>
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={product.image[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {product.description || "No description available"}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-400">
                      ₹{product.price}
                    </span>
                    <button
                      className="px-4 py-2 text-sm font-medium bg-emerald-500 text-black rounded-lg hover:bg-emerald-400 transition"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-lg text-gray-400 text-center py-20">
            No products found in this category.
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
