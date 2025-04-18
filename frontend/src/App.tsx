import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";
import { Groups } from "./pages/Groups";
import { Investments } from "./pages/Investments";
import { MainLayout } from "./layouts/MainLayout";
import { GroupDetails } from "./pages/GroupDetails";
import { GroupInvestments } from "./pages/InvestmentPoolDetails";


export function App() {
  // For mock data purposes, we'll assume the user is not logged in initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleAuth = () => {
    setIsLoggedIn(true);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? <Login onLogin={handleAuth} /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !isLoggedIn ? <SignUp onSignUp={handleAuth} /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/groups"
            element={isLoggedIn ? <Groups /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/investments"
            element={isLoggedIn ? <Investments /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/investments/:groupId" element={<GroupInvestments/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
