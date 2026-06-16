"use client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const FALLBACK_INDICES = [
  { name: "Nifty 50", value: "22,514.65", change: "+146.25 (0.66%)", up: true },
  {
    name: "Bank Nifty",
    value: "48,986.30",
    change: "-46.20 (0.09%)",
    up: false,
  },
  { name: "Sensex", value: "74,248.22", change: "+350.81 (0.47%)", up: true },
  {
    name: "Midcap 100",
    value: "50,123.45",
    change: "+420.15 (0.85%)",
    up: true,
  },
  { name: "India VIX", value: "11.34", change: "-0.45 (3.82%)", up: false },
];

export default function MarketTicker() {
  const [indices, setIndices] = useState(FALLBACK_INDICES);

  useEffect(() => {
    const fetchLiveIndices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/live-indian-indices/`,
        );
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.results || [];
          if (items.length > 0) {
            setIndices(
              items.slice(0, 6).map((item: any) => {
                const changeVal = parseFloat(item.change || "0");
                const pctVal = parseFloat(item.percent_change || "0");
                return {
                  name: item.name || item.index_name,
                  value: item.last_price || item.value,
                  change: `${changeVal >= 0 ? "+" : ""}${changeVal.toFixed(2)} (${pctVal.toFixed(2)}%)`,
                  up: item.up !== undefined ? item.up : changeVal >= 0,
                };
              }),
            );
          }
        }
      } catch (err) {
        console.warn(
          "Could not fetch live indian-indices, using fallback data.",
        );
      }
    };

    fetchLiveIndices();
    const intervalId = setInterval(fetchLiveIndices, 10000); // Polling every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="border-b border-[var(--mg-border)] bg-[var(--mg-surface)]">
      <div className="mx-auto flex max-w-[var(--mg-container)] flex-wrap justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {indices.map((item) => {
          const TrendIcon = item.up ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={item.name}
              className="flex-1 rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-4 py-3"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--mg-text-soft)]">
                {item.name}
              </div>
              <div className="mt-1 font-heading text-base font-semibold text-[var(--mg-text)]">
                {item.value}
              </div>
              <div
                className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                  item.up
                    ? "text-[var(--mg-positive)]"
                    : "text-[var(--mg-negative)]"
                }`}
              >
                <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.change}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
