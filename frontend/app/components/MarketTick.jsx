import { marketItems } from "../news-today/data";
import Icon from "./Icon";

export default function MarketTicker({ compact = false }) {
  const items = compact
    ? marketItems.concat([
        { name: "EUR/USD", value: "1.0742", change: "-0.21%", trend: "down" },
        { name: "VIX", value: "18.45", change: "+4.20%", trend: "up" },
      ])
    : marketItems;

  return (
    <aside className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name={compact ? "monitoring" : "bolt"} className="text-[var(--mg-positive)]" filled />
          {compact ? "Indices" : "Market Live"}
        </h2>
        <span className="text-xs text-[var(--mg-text-soft)]">{compact ? "LIVE" : "Updated now"}</span>
      </div>

      <div className="mt-4 divide-y divide-[var(--mg-border)]">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <div className="text-sm font-medium text-[var(--mg-text)]">
                {item.name.replace("DOW JONES", "DOW").replace("US 10-YR YIELD", "US 10Y")}
              </div>
              <div className="mt-1 text-xs text-[var(--mg-text-soft)]">{item.value}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${item.trend === "up" ? "text-[var(--mg-positive)]" : "text-[var(--mg-negative)]"}`}>
                {item.change}
              </div>
              {item.points && <div className="mt-1 text-xs text-[var(--mg-text-soft)]">{item.points}</div>}
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <button className="mt-5 w-full rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--mg-text-muted)] transition hover:border-[var(--mg-border-strong)] hover:text-[var(--mg-text)]">
          View All Markets
        </button>
      )}
    </aside>
  );
}
