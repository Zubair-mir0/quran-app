import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BookmarkedAyah() {
  const [ayah, setAyah] = useState(null);
  const [surahName, setSurahName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("bookmark-surah-")
    );

    if (keys.length === 0) {
      setLoading(false);
      return;
    }

    const key = keys[0];
    const surahId = key.split("bookmark-surah-")[1];
    const ayahId = parseInt(localStorage.getItem(key), 10);

    const fetchAyah = async () => {
      try {
        const res = await axios.get(
          `https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.asad`
        );

        const arabicAyahs = res.data.data[0].ayahs;
        const englishAyahs = res.data.data[1].ayahs;

        const found = arabicAyahs.find((a) => a.numberInSurah === ayahId);

        if (found) {
          setSurahName(res.data.data[0].englishName);
          setAyah({
            id: ayahId,
            text_ar: `${found.text} (${ayahId})`,
            text_en: englishAyahs[ayahId - 1]?.text || "Translation not available",
          });
        }
      } catch (err) {
        console.error("Error fetching bookmarked ayah:", err);
      }
      setLoading(false);
    };

    fetchAyah();
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!ayah) return <p className="text-center py-6">No ayah bookmarked</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Link
        to="/"
        className="inline-block mb-4 px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
      >
        ← Back to Surahs
      </Link>

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        Bookmarked Ayah from Surah {surahName}
      </h2>

      <div className="border-b py-4 px-3 rounded-md bg-green-50 border-green-400">
        {/* Show ayah number */}
        <p className="text-sm text-gray-500 mb-1">Ayah {ayah.id}</p>

        {/* Arabic with number */}
        <p className="text-right font-arabic text-xl mb-2">{ayah.text_ar}</p>

        {/* English translation */}
        <p className="text-left text-gray-700 italic">{ayah.text_en}</p>
      </div>
    </div>
  );
}
