import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Surah() {
  const { id } = useParams();
  const [ayahs, setAyahs] = useState([]);
  const [surahName, setSurahName] = useState("");
  const [isMemorized, setIsMemorized] = useState(false);
  const [bookmarkedAyah, setBookmarkedAyah] = useState(null);
  const [bookmarkedSurah, setBookmarkedSurah] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(
    JSON.parse(localStorage.getItem("dontShowBookmarkPrompt") || "false")
  );
  const [ayahToBookmark, setAyahToBookmark] = useState(null);

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

    const bookmarkKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("bookmark-surah-")
    );
    if (bookmarkKeys.length > 0) {
      const key = bookmarkKeys[0];
      setBookmarkedSurah(parseInt(key.split("bookmark-surah-")[1]));
      setBookmarkedAyah(parseInt(localStorage.getItem(key)));
    }
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
    // If user has opted out of prompt or no previous bookmark exists
    if (!bookmarkedAyah || dontShowAgain) {
      saveBookmark(ayahId);
      return;
    }

    // Otherwise, show prompt
    setAyahToBookmark(ayahId);
    setShowPrompt(true);
  };

  const saveBookmark = (ayahId) => {
    // Remove previous bookmark
    const previousBookmarks = Object.keys(localStorage).filter((k) =>
      k.startsWith("bookmark-surah-")
    );
    previousBookmarks.forEach((k) => localStorage.removeItem(k));

    localStorage.setItem(`bookmark-surah-${id}`, ayahId);
    setBookmarkedAyah(ayahId);
    setBookmarkedSurah(parseInt(id));
    setShowPrompt(false);
  };

  const confirmBookmark = () => {
    if (dontShowAgain) localStorage.setItem("dontShowBookmarkPrompt", true);
    if (ayahToBookmark !== null) saveBookmark(ayahToBookmark);
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
      {ayahs.map((ayah) => {
        const isBookmarked = bookmarkedAyah === ayah.id && bookmarkedSurah === parseInt(id);
        return (
          <div
            key={ayah.id}
            className={`border-b py-4 px-3 rounded-md ${
              isBookmarked ? "bg-yellow-100 border-yellow-400" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">Ayah {ayah.id}</p>
            <p className="text-right font-arabic text-2xl mb-2">{ayah.text_ar}</p>
            <p className="text-left text-gray-700 italic">{ayah.text_en}</p>

            {/* Bookmark Button */}
            <button
              onClick={() => handleBookmark(ayah.id)}
              className={`mt-3 px-4 py-1 rounded-lg text-sm shadow-md transition ${
                isBookmarked ? "bg-green-600 text-white" : "bg-gray-300 hover:bg-green-200"
              }`}
            >
              {isBookmarked ? "🔖 Unmark Bookmark" : "🔖 Bookmark"}
            </button>
          </div>
        );
      })}

      {/* Bookmark confirmation prompt */}
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md shadow-lg">
            <p className="mb-4">
              You already have a bookmark in the Quran. Do you want to remove the previous bookmark and add this one?
            </p>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              Don't show this message again
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmBookmark}
                className="px-4 py-2  text-white rounded "
              >
                Confirm 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
