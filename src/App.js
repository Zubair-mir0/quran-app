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
        <nav className="flex justify-between items-center mb-6">
          <Link to="/" className="text-4xl justify-between  w-[300px] flex items-center font-bold text-green-600">
          <img className="h-[100px] w-[100px] rounded-full" src="desert.jpg"/>
           Quran App</Link>
          <div className="space-x-4">
            <Link to="/memorized" className="text-blue-600 hover:underline">Memorized</Link>
            <Link to="/remaining" className="text-red-600 hover:underline">Remaining</Link>
            <Link to="/bookmarked" className="text-yellow-600 hover:underline">Bookmarked Ayah</Link>
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
