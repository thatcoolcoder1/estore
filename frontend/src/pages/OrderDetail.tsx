import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import apiClient from "../api/axios";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

interface OrderItem {
  product: string;
  title: string;
  image: string[];
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        setLoading(false);
        setError("You must be logged in to view this order.");
        return;
      }

      try {
        const response = await apiClient.get<Order>(`http://localhost:3000/api/order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err: any) {
        setError("Failed to fetch order details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-xl font-medium text-emerald-400 animate-pulse">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="bg-gray-950 min-h-screen py-10 px-6 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-emerald-400 hover:underline"
        >
          ← Back to Orders
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-emerald-400 mb-4">
            Order #{order._id}
          </h1>
          <p className="text-gray-400 mb-2">
            Placed on: {format(new Date(order.createdAt), "MMMM do, yyyy")}
          </p>
          <p className="text-gray-400 mb-4">Status: {order.status}</p>

          <h2 className="text-xl font-semibold text-gray-100 mb-2">Shipping Address</h2>
          <p className="text-gray-400 mb-4">
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <h2 className="text-xl font-semibold text-gray-100 mb-2">Payment Method</h2>
          <p className="text-gray-400 mb-4">{order.paymentMethod}</p>

          <h2 className="text-xl font-semibold text-gray-100 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.product}
                className="flex items-center gap-4 bg-gray-800 rounded-xl p-4 hover:shadow-emerald-500/20 transition"
              >
                <img
                  src={item.image[0]}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-100">{item.title}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <span className="text-lg font-bold text-emerald-400">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4 mt-4 text-right">
            <span className="text-2xl font-bold text-emerald-400">
              Total: ₹{order.totalPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
