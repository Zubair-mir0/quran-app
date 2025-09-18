import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 shadow-md mb-6 flex justify-between items-center">
      <Link
        to="/"
        className="text-lg md:text-xl font-bold hover:text-green-200 transition"
      >
        🏠 Home
      </Link>
      <h1 className="text-lg md:text-xl font-semibold">Quran App</h1>
    </nav>
  );
}
