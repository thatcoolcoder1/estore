import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store.ts";

const App: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const admin = user?.isAdmin;
  console.log(user)
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
                  element={<div>Admin Dashboard</div>}
                />
              </>
            ) : (
              <>
                <Route path="/" element={<HomePage />} />
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
