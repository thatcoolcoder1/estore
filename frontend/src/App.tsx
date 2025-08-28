import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store.ts";
import { logout } from "./features/AuthSlice.ts";
import { useDispatch } from "react-redux";
import CategoryPage from "./pages/CategoryPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrderDetail from "./pages/OrderDetail.tsx";
import Navbar from "./components/Navbar.tsx";

const App: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const dispatch = useDispatch();
  const admin = user?.isAdmin;

  const logout1 = () => {
    dispatch(logout());
  };

  return (
    <BrowserRouter>
      {/* Show Navbar only if logged in and not admin */}
      {isAuthenticated && !admin && <Navbar />}

      <Routes>
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        {isAuthenticated && (
          <>
            {admin ? (
              <>
                <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
                <Route
                  path="/admin-dashboard"
                  element={
                    <div>
                      Admin Dashboard{" "}
                      <button onClick={logout1}>click me</button>
                    </div>
                  }
                />
              </>
            ) : (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart/" element={<CartPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/pay" element={<PaymentPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:id/" element={<OrderDetail />} />
              </>
            )}

            {/* Prevent access to login/register */}
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
