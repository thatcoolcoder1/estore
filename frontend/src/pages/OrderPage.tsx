import React, { useState, useEffect } from "react";
// import axios from "axios";
import apiClient from "../api/axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
// import { UseSelector } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
// import { useDispatch } from "react-redux";
// import { clearCart } from "../features/CartSlice";

// Interface for a single item within an order
interface OrderItem {
  product: string;
  title: string;
  image: string[];
  price: number;
  quantity: number;
}

// Interface for the main Order model
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

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const navigate = useNavigate();
  // Get the token from local storage instead of Redux
  const token = useSelector((state:RootState)=>state.auth.token)
  // const token = localStorage.getItem('token')
    // const clearcart = async () => {
    //   try {
    //     await apiClient.delete("/api/cart/", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //   } catch (err) {
    //     console.error("Failed to clear cart:", err);
    //   }
    // };
  // const dispatch = useDispatch();
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        setError("You must be logged in to view your orders.");
        return;
      }
      try {
        const response = await apiClient.get<Order[]>("/api/order/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        //  dispatch(clearCart());
        //  clearcart();

      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError("You have not placed any orders yet.");
        } else {
          setError("Failed to fetch order data.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading orders...
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
  <div className="bg-gray-950 min-h-screen py-10 px-6 text-gray-100">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-emerald-400 mb-8 tracking-tight">
        Your Orders
      </h1>

      {orders.length > 0 ? (
        <div className="space-y-6">

{orders.map((order) => (
  <Link
    key={order._id}
    to={`/order/${order._id}`}
    className="block"
  >
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-emerald-500/20 transition">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            Order #{order._id.substring(0, 8)}...
          </h2>
          <p className="text-sm text-gray-400">
            Placed on {format(new Date(order.createdAt), "MMMM do, yyyy")}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            order.status === "delivered"
              ? "bg-green-100 text-green-800"
              : order.status === "processing"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.status}
        </span>
      </div>

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
              <p className="text-sm text-gray-400">
                Quantity: {item.quantity}
              </p>
            </div>
            <span className="text-lg font-bold text-emerald-400">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-4 mt-4 text-right">
        <span className="text-xl font-bold text-emerald-400">
          Total: ₹{order.totalPrice}
        </span>
      </div>
    </div>
  </Link>
))}

        </div>
      ) : (
        <div className="text-lg text-gray-400 text-center mt-20">
          You have not placed any orders yet.
        </div>
      )}
    </div>
  </div>
);

};

export default OrderPage;
