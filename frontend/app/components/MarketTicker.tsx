import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const indices = [
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
  { name: "USD/INR", value: "83.31", change: "+0.05 (0.06%)", up: true },
];

export default function MarketTicker() {
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
