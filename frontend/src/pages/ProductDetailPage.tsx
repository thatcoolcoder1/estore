import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
    if (!product) {
      return;
    }

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
            quantity: 1, // Default quantity to 1
        };

        // Dispatch the action to add the item to the Redux store
        dispatch(addItemToCart(cartItem));

        // Make an API call to the backend to add the item to the database
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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found in URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get<Product>(
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-600 animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-500">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto p-8">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center">
          {/* Main Image */}
          <div className="w-full h-[500px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={activeImage || product.image[0]}
              alt={product.title}
              className="object-contain h-full w-full transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4">
            {product.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  activeImage === img
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center sticky top-10 self-start">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-6"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-semibold text-green-600 mb-8">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4">
            {product.countInStock > 0 ? (
              <button onClick={handleAddToCart} className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl shadow-md hover:bg-blue-700 transition">
                Add to Cart
              </button>
            ) : (
              <span className="text-red-500 text-lg font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-700">
              {product.category}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
