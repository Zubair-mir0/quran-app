import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [memorized, setMemorized] = useState([]);

  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah").then((res) => {
      setSurahs(res.data.data);
    });
    setMemorized(JSON.parse(localStorage.getItem("memorizedSurahs")) || []);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Surah List</h1>
      <p className="mb-4">
        ✅ Memorized: <b>{memorized.length}</b> / {surahs.length}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {surahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/surah/${surah.number}`}
            className="p-4 border rounded-lg shadow hover:bg-gray-50"
          >
            {surah.number}. {surah.englishName}
          </Link>
        ))}
      </div>
    </div>
  );
}
