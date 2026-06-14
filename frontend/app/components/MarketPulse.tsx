import { Activity, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Advances", value: "1,462", tone: "positive" },
  { label: "Declines", value: "845", tone: "negative" },
  { label: "Unchanged", value: "112", tone: "neutral" },
];

export default function MarketPulse() {
  return (
    <section className="overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)]">
      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_220px] md:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--mg-text-muted)]">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Pre-market action
          </div>
          <h1 className="mt-5 max-w-2xl font-heading text-3xl font-semibold leading-tight text-[var(--mg-text)] sm:text-4xl">
            Broadly bullish setup with selective sector leadership.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--mg-text-muted)]">
            Asian markets indicate a positive start after a tech-led rally on Wall Street.
            GIFT Nifty suggests a gap-up opening near 80 points, with IT and Auto likely to stay in focus.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] p-4">
                <div className="text-xs text-[var(--mg-text-soft)]">{stat.label}</div>
                <div
                  className={`mt-1 font-heading text-xl font-semibold ${
                    stat.tone === "positive"
                      ? "text-[var(--mg-positive)]"
                      : stat.tone === "negative"
                        ? "text-[var(--mg-negative)]"
                        : "text-[var(--mg-text)]"
                  }`}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center rounded-[18px] border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] p-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mg-positive-soft)] text-[var(--mg-positive)]">
              <ArrowUpRight className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-4 font-heading text-4xl font-semibold text-[var(--mg-text)]">68%</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
              Bullish sentiment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
