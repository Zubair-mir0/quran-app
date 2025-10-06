import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [memorized, setMemorized] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);

  const ayahs = [
    {
      surah: "Al-Qamar (54:40)",
      text: "And We have certainly made the Quran easy to remember, so is there anyone who will remember?",
      description:
        "This verse emphasizes that the Quran is inherently easy to learn and remember, and it encourages believers to take heed.",
    },
    {
      surah: "Al-Qiyamah (75:16-18)",
      text: "Do not rush your tongue trying to memorize ˹a revelation of˺ the Quran. It is certainly upon Us to ˹make you˺ memorize and recite it. So when We have recited a revelation, then follow its recitation.",
      description:
        "This ayah assures the Prophet that the memorization of the Quran is a divine process facilitated by Allah.",
    },
    {
      surah: "Al-Ahzab (33:34)",
      text: "And remember what is recited in your houses.",
      description: "This verse encourages the continuous remembrance and recitation of the Quran within one's home.",
    },
    {
      surah: "Al-Muzzammil (73:20)",
      text: "Recite as much as is feasible.",
      description:
        "This verse emphasizes the importance of consistent and manageable engagement with the Quran, encouraging recitation to the best of one's ability.",
    },
  ];

  // Rotate ayahs every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAyahIndex((prev) => (prev + 1) % ayahs.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load surahs, memorized, bookmarks
  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah").then((res) => {
      setSurahs(res.data.data);
    });
    setMemorized(JSON.parse(localStorage.getItem("memorizedSurahs")) || []);

    // Get bookmarked surahs
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("bookmark-surah-")
    );
    const bookmarkedIds = keys.map((k) => parseInt(k.split("bookmark-surah-")[1]));
    setBookmarks(bookmarkedIds);
  }, []);

  const currentAyah = ayahs[currentAyahIndex];

  // Filter surahs by search query
  const filteredSurahs = surahs.filter((s) =>
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
    

      {/* Quran Ayah Card */}
      <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded-lg shadow-md animate-fadeIn">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-green-700">
          Quran Ayah
        </h2>
        <p className="text-green-900 font-semibold mb-1">{currentAyah.surah}</p>
        <p className="text-gray-800 italic mb-2">{currentAyah.text}</p>
        <p className="text-gray-600 text-sm">{currentAyah.description}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search Surah..."
          className="w-full sm:w-1/2 p-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Surah List */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Surah List
      </h1>
      <p className="text-center mb-4">
        ✅ Memorized: <b>{memorized.length}</b> / {surahs.length}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSurahs.map((surah) => {
          const isBookmarked = bookmarks.includes(surah.number);
          return (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className={`p-4 border rounded-lg shadow text-center transition hover:bg-gray-50 ${
                isBookmarked ? "bg-green-100 border-green-500" : "bg-white"
              }`}
            >
              {surah.number}. {surah.englishName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
