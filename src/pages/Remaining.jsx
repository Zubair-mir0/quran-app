import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Remaining() {
  const [surahs, setSurahs] = useState([]);
  const [memorized, setMemorized] = useState([]);

  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah").then((res) => {
      setSurahs(res.data.data);
    });
    setMemorized(JSON.parse(localStorage.getItem("memorizedSurahs")) || []);
  }, []);

  const remainingSurahs = surahs.filter((s) => !memorized.includes(s.number));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">❌ Remaining Surahs</h1>
      <p className="text-center mb-4">
        Remaining surahs: <b>{remainingSurahs.length}</b> / {surahs.length}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {remainingSurahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/surah/${surah.number}`}
            className="p-4 border rounded-lg shadow hover:bg-red-50 transition text-center"
          >
            {surah.number}. {surah.englishName}
          </Link>
        ))}
      </div>
    </div>
  );
}
