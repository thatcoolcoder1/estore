// src/pages/CartPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import {
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  setCart,
} from "../features/CartSlice";
import { Trash2, Minus, Plus } from "lucide-react";

interface CartItem {
  product: string;
  title: string;
  image: string[];
  price: number;
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
}

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<Cart>("http://localhost:3000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCart(response.data));
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Your cart is empty.");
        } else {
          setError("Failed to fetch cart data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, dispatch]);

  // Update quantity
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
    try {
      await axios.put(
        "http://localhost:3000/api/cart/",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // Remove single item
  const handleRemoveItem = async (productId: string) => {
    dispatch(removeItemFromCart(productId));
    try {
      await axios.delete("http://localhost:3000/api/cart/item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      } as any);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    dispatch(clearCart());
    try {
      await axios.delete("http://localhost:3000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading your cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
          Shopping Cart
        </h1>

        {cart && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg divide-y">
              {cart.items.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center p-6 gap-6 hover:bg-gray-50 transition"
                >
                  <img
                    src={item.image[0]}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 mt-1">₹{item.price}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        className="p-2 rounded-full border hover:bg-gray-100"
                        onClick={() =>
                          handleUpdateQuantity(item.product, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="p-2 rounded-full border hover:bg-gray-100"
                        onClick={() =>
                          handleUpdateQuantity(item.product, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      onClick={() => handleRemoveItem(item.product)}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>
              <div className="flex justify-between text-gray-700 mb-3">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-3">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>

              {/* Checkout & Clear */}
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>
              <button
                className="w-full py-3 mt-3 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 transition"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <button
                className="w-full py-3 mt-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="text-lg text-gray-500 text-center mt-20">
            Your cart is empty. 🛒
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
