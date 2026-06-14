"use client";

const stocks = [
  {
    name: "TATA MOTORS",
    badge: "Breakout alert",
    price: "Rs 1,024.50",
    change: "+24.30 (2.4%)",
    up: true,
    path: "M0,30 C10,28 20,35 30,32 C40,29 50,25 60,22 C70,19 80,24 90,20 C100,16 110,18 120,15",
  },
  {
    name: "HDFC BANK",
    badge: "Earnings update",
    price: "Rs 1,540.20",
    change: "-12.50 (0.8%)",
    up: false,
    path: "M0,20 C10,22 20,18 30,24 C40,28 50,26 60,30 C70,32 80,28 90,35 C100,38 110,34 120,36",
  },
  {
    name: "INFY",
    badge: "Volume shocker",
    price: "Rs 1,485.75",
    change: "+18.20 (1.2%)",
    up: true,
    path: "M0,32 C10,30 20,28 30,25 C40,22 50,26 60,22 C70,18 80,20 90,16 C100,14 110,16 120,12",
  },
];

export default function StocksInFocus() {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          Watchlist
        </p>
        <h2 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
          Stocks in Focus
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stocks.map((stock) => (
          <article
            key={stock.name}
            className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-heading text-sm font-semibold text-[var(--mg-text)]">{stock.name}</div>
                <div className="mt-2 inline-flex rounded-full bg-[var(--mg-surface-muted)] px-2.5 py-1 text-xs text-[var(--mg-text-muted)]">
                  {stock.badge}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--mg-text)]">{stock.price}</div>
                <div className={`mt-1 text-xs font-medium ${stock.up ? "text-[var(--mg-positive)]" : "text-[var(--mg-negative)]"}`}>
                  {stock.change}
                </div>
              </div>
            </div>
            <svg className="mt-6 h-16 w-full" viewBox="0 0 120 50" preserveAspectRatio="none" aria-hidden="true">
              <path
                d={stock.path}
                fill="none"
                className={stock.up ? "stroke-[var(--mg-positive)]" : "stroke-[var(--mg-negative)]"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        ))}
      </div>
    </section>
  );
}
