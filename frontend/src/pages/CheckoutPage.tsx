import React, { useState } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
// import axios from "axios";
// import { clearCart } from "../features/CartSlice";
import apiClient from "../api/axios";
// import { clearCart } from "../features/CartSlice";

// interface OrderItem {
//   product: string;
//   title: string;
//   image: string[];
//   price: number;
//   quantity: number;
// }
// // interface Order {
//   _id: string;
//   user: string;
//   items: OrderItem[];
//   totalPrice: number;
//   shippingAddress: {
//     address: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
//   paymentMethod: string;
//   isPaid: boolean;
//   paidAt?: string;
//   isDelivered: boolean;
//   deliveredAt?: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }
interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

const CheckoutPage: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user || !cart || cart.items.length === 0) {
      alert("Cart or user details are missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Hit PAYMENT create-order route (not order one)
      const paymentRes = await apiClient.post<RazorpayOrderResponse>(
        "/api/order/create-order",
        {
          shippingAddress,
          paymentMethod: "Razorpay",
          // items: cart.items,
          // amount: cart.totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id, amount, currency } = paymentRes.data;
      // try {
      //   await apiClient.delete("/api/cart/", {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      // } catch (err) {
      //   console.error("Failed to clear cart:", err);
      // }
      // dispatch(clearCart());

      // Navigate to dedicated /pay page with order details
      navigate("/pay", {
        state: { id, amount, currency, shippingAddress },
      });
    } catch (checkoutError: any) {
      console.error("Error during checkout:", checkoutError);
      setError(
        checkoutError.response?.data?.message || "Error processing checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart?.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-xl font-medium text-gray-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 text-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8 tracking-tight">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 h-fit border border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cart?.items.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center gap-4 bg-gray-800/50 p-3 rounded-xl"
                >
                  <img
                    src={item.image[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">{item.title}</p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-700" />
            <div className="flex justify-between text-xl font-bold text-gray-200 mb-2">
              <span>Total</span>
              <span className="text-emerald-400">₹{cart?.totalPrice}</span>
            </div>
          </div>

          {/* Shipping Form & Payment */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              {["address", "city", "postalCode", "country"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-400"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={
                      shippingAddress[field as keyof typeof shippingAddress]
                    }
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl shadow-sm text-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              ))}
              {error && (
                <p className="text-red-500 text-center bg-red-500/10 p-2 rounded-lg">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-500 text-gray-950 font-semibold rounded-xl shadow hover:bg-emerald-400 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
