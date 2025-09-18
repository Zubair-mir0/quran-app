import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Memorized() {
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
      <h1 className="text-2xl font-bold mb-4">✅ Memorized Surahs</h1>
      {surahs.filter((s) => memorized.includes(s.number)).map((surah) => (
        <Link key={surah.number} to={`/surah/${surah.number}`} className="block p-3 border rounded mb-2 bg-green-100">
          {surah.number}. {surah.englishName}
        </Link>
      ))}
    </div>
  );
}
