import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BookmarkedAyah() {
  const [ayah, setAyah] = useState(null);
  const [surahName, setSurahName] = useState("");
  const [surahId, setSurahId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("bookmark-surah-"));
    if (keys.length === 0) {
      setLoading(false);
      return;
    }

    const key = keys[0];
    const surahIdLocal = key.split("bookmark-surah-")[1];
    const ayahId = parseInt(localStorage.getItem(key), 10);

    setSurahId(surahIdLocal);

    const fetchAyah = async () => {
      try {
        const res = await axios.get(
          `https://api.alquran.cloud/v1/surah/${surahIdLocal}/editions/quran-uthmani,en.asad`
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
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <Link
        to="/"
        className="inline-block mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        ← Back to Surahs
      </Link>

      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 text-center">
        Bookmarked Ayah from Surah {surahName}
      </h2>

      <Link to={`/surah/${surahId}`} className="block border p-3 rounded-md bg-green-50 border-green-400 hover:bg-green-100 transition">
        <p className="text-sm text-gray-500 mb-1">Ayah {ayah.id}</p>
        <p className="text-right font-arabic text-xl md:text-2xl mb-2">{ayah.text_ar}</p>
        <p className="text-left text-gray-700 italic">{ayah.text_en}</p>
      </Link>
    </div>
  );
}
