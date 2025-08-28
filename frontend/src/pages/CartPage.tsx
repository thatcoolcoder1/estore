// src/pages/CartPage.tsx
import React, { useEffect, useState } from "react";
// import axios from "axios";
import apiClient from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import {
  removeItemFromCart,
  updateItemQuantity,
  clearCart,
  setCart,
} from "../features/CartSlice";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
// import apiClient from "../api/axios";

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

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient
        .get<Cart>("http://localhost:3000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCart(response.data));
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Your cart is empty.");
        } else {
          setError("Failed to fetch cart data. Please RELOGIN");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, dispatch]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateItemQuantity({ productId, quantity: newQuantity }));
    try {
      await apiClient.put(
        "http://localhost:3000/api/cart/",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    dispatch(removeItemFromCart(productId));
    try {
      await apiClient.delete("http://localhost:3000/api/cart/item", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      } as any);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
    try {
      await apiClient.delete("http://localhost:3000/api/cart/", {
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
  <div className="bg-gray-950 min-h-screen py-12 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-100 mb-10 flex items-center gap-3">
        <ShoppingBag size={36} className="text-emerald-500" />
        Your Cart
      </h1>

      {cart && cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div
                key={item.product}
                className="flex items-center bg-gray-900 rounded-xl border border-gray-800 p-6 hover:shadow-emerald-500/20 transition"
              >
                <img
                  src={item.image[0]}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-lg border border-gray-800"
                />

                {/* Product Info */}
                <div className="flex-1 ml-6">
                  <h2 className="text-lg font-semibold text-gray-100">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 mt-1">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
                      onClick={() =>
                        handleUpdateQuantity(item.product, item.quantity - 1)
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 rounded-md bg-gray-800 text-gray-200 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      className="p-2 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
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
                  <div className="text-lg font-bold text-gray-100">
                    ₹{item.price * item.quantity}
                  </div>
                  <button
                    className="text-red-400 hover:text-red-500 flex items-center gap-1 text-sm"
                    onClick={() => handleRemoveItem(item.product)}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-fit sticky top-20">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-400 mb-3">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-400 mb-3">
              <span>Shipping</span>
              <span className="text-emerald-400 font-medium">Free</span>
            </div>
            <hr className="my-4 border-gray-800" />
            <div className="flex justify-between text-xl font-bold text-gray-100 mb-6">
              <span>Total</span>
              <span>₹{cart.totalPrice}</span>
            </div>

            <button className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow hover:bg-emerald-600 transition" onClick={()=>{navigate("/checkout")}}>
              Proceed to Checkout
            </button>
            <button
              className="w-full py-3 mt-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            <button
              className="w-full py-3 mt-3 border border-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-lg text-gray-400">Your cart is empty. 🛒</p>
          <button
            className="mt-6 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow hover:bg-emerald-600 transition"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  </div>
);

};

export default CartPage;
