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

const App: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const dispatch = useDispatch();
  const admin = user?.isAdmin;
  const logout1 = () => {
    dispatch(logout());
  };
  console.log(user);
  return (
    <BrowserRouter>
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
            {/* Admin redirect */}
            {admin ? (
              <>
                <Route
                  path="/"
                  element={<Navigate to="/admin-dashboard" replace />}
                />
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
