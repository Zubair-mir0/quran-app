import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Surah() {
  const { id } = useParams();
  const [ayahs, setAyahs] = useState([]);
  const [surahName, setSurahName] = useState("");
  const [isMemorized, setIsMemorized] = useState(false);
  const [bookmarkedAyah, setBookmarkedAyah] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.asad`)
      .then((res) => {
        const arabicAyahs = res.data.data[0].ayahs;
        const englishAyahs = res.data.data[1].ayahs;

        const merged = arabicAyahs.map((a, i) => ({
          id: a.numberInSurah,
          text_ar: `${a.text} (${a.numberInSurah})`,
          text_en: englishAyahs[i]?.text || "Translation not available",
        }));

        setSurahName(res.data.data[0].englishName);
        setAyahs(merged);
      });

    const memorized = JSON.parse(localStorage.getItem("memorizedSurahs") || "[]");
    setIsMemorized(memorized.includes(parseInt(id)));

    const savedBookmark = localStorage.getItem(`bookmark-surah-${id}`);
    if (savedBookmark) setBookmarkedAyah(parseInt(savedBookmark));
  }, [id]);

  const toggleMemorized = () => {
    let memorized = JSON.parse(localStorage.getItem("memorizedSurahs") || "[]");
    if (isMemorized) {
      memorized = memorized.filter((s) => s !== parseInt(id));
    } else {
      memorized.push(parseInt(id));
    }
    localStorage.setItem("memorizedSurahs", JSON.stringify(memorized));
    setIsMemorized(!isMemorized);
  };

  const handleBookmark = (ayahId) => {
    localStorage.setItem(`bookmark-surah-${id}`, ayahId);
    setBookmarkedAyah(ayahId);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        to="/"
        className="inline-block mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        ← Back to Surahs
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 text-center">
        Surah {surahName}
      </h1>

      <button
        onClick={toggleMemorized}
        className={`mb-6 w-full md:w-auto px-4 py-2 rounded-lg shadow-md transition text-center ${
          isMemorized
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 hover:bg-green-200"
        }`}
      >
        {isMemorized ? "✅ Memorized" : "📖 Mark as Memorized"}
      </button>

      <div className="space-y-4">
        {ayahs.map((ayah) => (
          <div
            key={ayah.id}
            className={`border p-3 rounded-md transition ${
              bookmarkedAyah === ayah.id ? "bg-yellow-100 border-yellow-400" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">Ayah {ayah.id}</p>
            <p className="text-right font-arabic text-xl md:text-2xl mb-2">{ayah.text_ar}</p>
            <p className="text-left text-gray-700 italic">{ayah.text_en}</p>
            <button
              onClick={() => handleBookmark(ayah.id)}
              className={`mt-3 w-full md:w-auto px-4 py-1 rounded-lg text-sm shadow-md transition ${
                bookmarkedAyah === ayah.id
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gray-300 hover:bg-green-200"
              }`}
              disabled={bookmarkedAyah === ayah.id}
            >
              {bookmarkedAyah === ayah.id ? "🔖 Bookmarked" : "🔖 Bookmark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
