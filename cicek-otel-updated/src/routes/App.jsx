// src/routes/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Sayfaları import et
import HomeTR from "./HomeTR";
import HomeEN from "./HomeEN";
import About from "./About";
import Admin from "./Admin";
import Login from "./Login";
import UserLogin from "./UserLogin";
import MyReservations from "./MyReservations";
import MyInfo from "./MyInfo";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeTR />} />
        <Route path="/home-en" element={<HomeEN />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-info" element={<MyInfo />} />
      </Routes>
    </>
  );
}

export default App;
