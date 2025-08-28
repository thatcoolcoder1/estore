import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import apiClient from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../features/CartSlice";
import type { RootState } from "../app/store";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string[];
  price: number;
  category: string;
  countInStock: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async () => {
    if (!product) return;
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

      await apiClient.post(
        "http://localhost:3000/api/cart/",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${product.title} added to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found in URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiClient.get<Product>(
          `http://localhost:3000/api/products/${id}`
        );
        setProduct(response.data);
        setActiveImage(response.data.image[0]);
      } catch (err: any) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl font-medium text-gray-300 animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl font-medium text-red-400">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-xl font-medium text-gray-400">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto bg-gray-900/80 p-10 rounded-2xl shadow-2xl border border-gray-800">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center">
          <div className="w-full h-[500px] bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700">
            <img
              src={activeImage || product.image[0]}
              alt={product.title}
              className="object-contain h-full w-full transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-transform duration-200 hover:scale-110 ${
                  activeImage === img
                    ? "border-emerald-500"
                    : "border-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center sticky top-10 self-start">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-emerald-400 hover:underline mb-6"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-extrabold text-white mb-4">
            {product.title}
          </h1>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-emerald-400 mb-8">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4">
            {product.countInStock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="px-10 py-4 bg-emerald-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-emerald-600 transition"
              >
                🛒 Add to Cart
              </button>
            ) : (
              <span className="text-red-400 text-lg font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Category:{" "}
            <span className="font-medium text-gray-200">
              {product.category}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
