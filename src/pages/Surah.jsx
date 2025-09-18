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
          text_ar: `${a.text} (${a.numberInSurah})`, // add ayah number in Arabic
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
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-block mb-4 px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
      >
        ← Back to Surahs
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Surah {surahName}
      </h1>

      {/* Memorize Button */}
      <button
        onClick={toggleMemorized}
        className={`mb-6 px-5 py-2 rounded-lg shadow-md transition ${
          isMemorized
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 hover:bg-green-200"
        }`}
      >
        {isMemorized ? "✅ Memorized" : "📖 Mark as Memorized"}
      </button>

      {/* Ayahs */}
      {ayahs.map((ayah) => (
        <div
          key={ayah.id}
          className={`border-b py-4 px-3 rounded-md ${
            bookmarkedAyah === ayah.id
              ? "bg-yellow-100 border-yellow-400"
              : "bg-white"
          }`}
        >
          {/* Ayah number */}
          <p className="text-sm text-gray-500 mb-1">Ayah {ayah.id}</p>

          {/* Arabic with number at the end */}
          <p className="text-right font-arabic text-2xl mb-2">{ayah.text_ar}</p>

          {/* Translation */}
          <p className="text-left text-gray-700 italic">{ayah.text_en}</p>

          {/* Bookmark button */}
          <button
            onClick={() => handleBookmark(ayah.id)}
            className={`mt-3 px-4 py-1 rounded-lg text-sm shadow-md transition ${
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
  );
}
