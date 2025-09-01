import React from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Google from "./pages/Google";
import Github from "./pages/Github";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/google" element={<Google />} />
      <Route path="/auth/github" element={<Github />} />
    </Routes>
  );
}
