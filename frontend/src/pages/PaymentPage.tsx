import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import apiClient from "../api/axios";
import { useSelector,useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { clearCart } from "../features/CartSlice";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Interfaces
interface CartItem {
  product: string;
  title: string;
  image: string[];
  price: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

const PaymentPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const cartState = useSelector((state: RootState) => state.cart); // cart from redux

  useEffect(() => {
    if (!token || !cartState) {
      setLoading(false);
      setError("Cart or user session is missing.");
      return;
    }
    setCart(cartState);
    setLoading(false);
  }, [token, cartState]);
  const handlePayment = async () => {
  if (!cart || !token || !user) {
    alert("Cart or user details are missing.");
    return;
  }

  try {
    // 1. Create a Razorpay order on backend
    const { data } = await apiClient.post<RazorpayOrderResponse>(
      "http://localhost:3000/api/payments/create-order",
      {
        amount: cart.totalPrice,
        currency: "INR",
        receipt: `cart_${Date.now()}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const options = {
      key: key,
      amount: data.amount,
      currency: data.currency,
      name: user.name,
      description: "Payment for your Cart",
      order_id: data.id,
      handler: () => {
        // Frontend does not verify, just notify user
        alert("Payment successful! Redirecting...");
        dispatch(clearCart())
        navigate("/order");
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#10B981",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", (res: any) => {
      alert("Payment failed: " + res.error.description);
    });
    rzp1.open();
  } catch (paymentError) {
    console.error("Error during payment process:", paymentError);
    alert("Error initiating payment. Please try again.");
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-emerald-400">
        <p className="text-xl font-medium animate-pulse">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-xl font-medium text-gray-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-emerald-400 mb-6">
          Checkout & Pay
        </h1>

        {/* Cart Items */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-6">
          {cart.items.map((item) => (
            <div
              key={item.product}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl"
            >
              <img
                src={item.image[0]}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-100">{item.title}</p>
                <p className="text-sm text-gray-400">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <p className="font-medium text-emerald-400">
                ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-6">
          <span className="text-lg font-semibold text-gray-200">Total:</span>
          <span className="text-2xl font-bold text-emerald-400">
            ₹{cart.totalPrice}
          </span>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl shadow hover:bg-emerald-600 transition"
        >
          Pay Securely
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;


