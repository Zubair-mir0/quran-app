import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Surah from "./pages/Surah";
import Memorized from "./pages/Memorized";
import Remaining from "./pages/Remaining";
import BookmarkedAyah from "./pages/Bookmarked";

export default function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-2xl md:text-3xl font-bold text-green-600 mb-4 md:mb-0"
          >
            <img
              className="h-16 w-16 md:h-20 md:w-20 rounded-full mr-2"
              src="desert.jpg"
              alt="Logo"
            />
            Quran App
          </Link>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-blue-700 transition text-center"
            >
              Home
            </Link>
            <Link
              to="/memorized"
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition text-center"
            >
              Memorized
            </Link>
            <Link
              to="/remaining"
              className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition text-center"
            >
              Remaining
            </Link>
            <Link
              to="/bookmarked"
              className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition text-center"
            >
              Bookmarked Ayah
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:id" element={<Surah />} />
          <Route path="/memorized" element={<Memorized />} />
          <Route path="/remaining" element={<Remaining />} />
          <Route path="/bookmarked" element={<BookmarkedAyah />} />
        </Routes>
      </div>
    </Router>
  );
}
