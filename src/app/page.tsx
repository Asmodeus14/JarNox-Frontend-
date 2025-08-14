"use client";

import { useEffect, useState } from "react";
import PriceChart from "@/app/components/PriceChart";

interface StockPoint {
  date: string;
  close: number;
}

interface NewsItem {
  title: string;
  url: string;
}

interface MoversItem {
  symbol: string;
  change: number;
}
interface Overview {
  lastPrice: string;
  change: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const API= "https://jarnox-backend-b1oe.onrender.com";

  // Info Cards
  const [overview, setOverview] = useState<Overview | null>(null);

  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">(
    "neutral"
  );
  const [movers, setMovers] = useState<MoversItem[]>([]);

  // News
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // Fetch companies
  useEffect(() => {
    fetch(`${API}/companies`)
      .then((res) => res.json())
      .then((list) => setCompanies(list))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  // Fetch stock data + cards + news
  useEffect(() => {
    if (!selected) return;
    setLoading(true);

    // Stock Data
    fetch(`${API}/stocks/${selected}`)
      .then((res) => res.json())
      .then((points: StockPoint[]) => {
        setLabels(points.map((p) => p.date));
        setData(points.map((p) => p.close));

        // Overview Card
        const lastClose = points[points.length - 1]?.close || 0;
        const prevClose = points[points.length - 2]?.close || lastClose;
        setOverview({
          lastPrice: lastClose.toFixed(2),
          change: (lastClose - prevClose).toFixed(2),
        });

        // Sentiment
        setSentiment(
          lastClose > prevClose
            ? "bullish"
            : lastClose < prevClose
            ? "bearish"
            : "neutral"
        );

        // Mock movers
        setMovers([
          { symbol: "AAPL", change: 2.34 },
          { symbol: "MSFT", change: -1.22 },
          { symbol: "GOOGL", change: 0.78 },
        ]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // News
    setNewsLoading(true);
    fetch(`${API}/news/${selected}`)
      .then((res) => res.json())
      .then((items: NewsItem[]) => setNews(items))
      .catch(() => {
        // fallback offline news
        setNews([
          { title: `${selected} hits new high today!`, url: "#" },
          { title: `Market sentiment for ${selected} is positive`, url: "#" },
          { title: `Analysts review ${selected} performance`, url: "#" },
        ]);
      })
      .finally(() => setNewsLoading(false));
  }, [selected]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-mono relative overflow-hidden cyber-bg">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="relative w-72 border-r border-transparent p-[2px] overflow-y-auto bg-black animate-slideIn">
          <div className="absolute inset-0 animate-borderGlow pointer-events-none"></div>
          <div className="relative z-10 p-4">
            <h2 className="font-semibold mb-4 text-lg tracking-wider">
              COMPANIES
            </h2>
            <ul className="space-y-4">
              {companies.map((sym) => (
                <li
                  key={sym}
                  onClick={() => setSelected(sym)}
                  className={`p-3 rounded cursor-pointer ${
                    selected === sym
                      ? "bg-slate-900 font-bold"
                      : "hover:bg-slate-800"
                  }`}
                >
                  {sym}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Chart */}
          <h1 className="text-2xl font-bold mb-4 tracking-wide">
            {selected ? `${selected} STOCK PRICE` : "SELECT A COMPANY"}
          </h1>
          <div className="bg-black border border-gray-800 rounded p-4 shadow-lg animate-glowPulse h-96">
            {loading && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span className="animate-blink">Loading</span>
                <span className="animate-cursor">|</span>
              </div>
            )}
            {!loading && selected && <PriceChart labels={labels} data={data} />}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Overview */}
            <div className="bg-gray-900 p-4 rounded shadow-lg animate-glowPulse">
              <h3 className="font-bold mb-2">Overview</h3>
              {overview ? (
                <>
                  <p>Last Price: ${overview.lastPrice}</p>
                  <p
                    className={
                      Number(overview.change) >= 0
                        ? "text-green-400"
                        : "text-red-500"
                    }
                  >
                    Change: {overview.change}
                  </p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* Sentiment */}
            <div
              className={`p-4 rounded shadow-lg animate-glowPulse ${
                sentiment === "bullish"
                  ? "bg-green-900"
                  : sentiment === "bearish"
                  ? "bg-red-900"
                  : "bg-gray-900"
              }`}
            >
              <h3 className="font-bold mb-2">Sentiment</h3>
              <p className="text-lg">
                {sentiment === "bullish"
                  ? "📈 Bullish"
                  : sentiment === "bearish"
                  ? "📉 Bearish"
                  : "➖ Neutral"}
              </p>
            </div>

            {/* Movers */}
            <div className="bg-gray-900 p-4 rounded shadow-lg animate-glowPulse">
              <h3 className="font-bold mb-2">Top Movers</h3>
              {movers.map((m) => (
                <p
                  key={m.symbol}
                  className={m.change >= 0 ? "text-green-400" : "text-red-500"}
                >
                  {m.symbol}: {m.change > 0 ? `+${m.change}` : m.change}
                </p>
              ))}
            </div>
          </div>

          {/* News Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsLoading ? (
              <p>Loading news...</p>
            ) : (
              news.map((n, idx) => (
                <a
                  key={idx}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 p-4 rounded shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h4 className="font-bold text-lg text-blue-400 mb-2">
                    {n.title}
                  </h4>
                  <p className="text-gray-400 text-sm">Read more...</p>
                </a>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes glowPulse {
          0%,
          100% {
            box-shadow: 0 0 5px #ffffff22;
          }
          50% {
            box-shadow: 0 0 15px #ffffff33;
          }
        }
        @keyframes blink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }
        @keyframes cursorBlink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 80px 80px;
          }
        }
        @keyframes borderGlow {
          0% {
            border-color: rgba(255, 255, 255, 0.2);
          }
          50% {
            border-color: rgba(255, 255, 255, 0.6);
          }
          100% {
            border-color: rgba(255, 255, 255, 0.2);
          }
        }
        @keyframes slideIn {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-glowPulse {
          animation: glowPulse 3s infinite;
        }
        .animate-blink {
          animation: blink 1.2s infinite;
        }
        .animate-cursor {
          animation: cursorBlink 1s infinite;
        }
        .animate-gridMove {
          background-image: linear-gradient(
              90deg,
              #ffffff11 1px,
              transparent 1px
            ),
            linear-gradient(#ffffff11 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 12s linear infinite;
        }
        .animate-borderGlow {
          border-right: 2px solid;
          animation: borderGlow 4s infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
