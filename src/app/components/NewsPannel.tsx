// components/NewsPanel.tsx
"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  url: string;
}

export default function NewsPanel({ symbol }: { symbol: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/news/${symbol}`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error("News fetch error:", err))
      .finally(() => setLoading(false));
  }, [symbol]);

  return (
    <div className="mt-6 p-4 bg-black border border-gray-700 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-white mb-3 tracking-wide">Latest News</h2>
      {loading && <p className="text-gray-500 animate-pulse">Fetching headlines...</p>}
      {!loading && news.length > 0 && (
        <ul className="space-y-3">
          {news.map((item, idx) => (
            <li key={idx} className="hover:translate-x-1 transition-transform">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
