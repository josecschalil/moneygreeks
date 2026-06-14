import { CalendarDays, Landmark, Tags, TrendingUp } from "lucide-react";

const activity = [
  {
    name: "FII / FPI",
    sub: "Foreign institutional investors",
    amount: "- Rs 2,345 Cr",
    badge: "Net sell",
    tone: "negative",
  },
  {
    name: "DII",
    sub: "Domestic institutional investors",
    amount: "+ Rs 1,850 Cr",
    badge: "Net buy",
    tone: "positive",
  },
];

const calendar = [
  { month: "APR", day: "12", event: "India CPI Inflation", exp: "5.0%", prev: "5.09%" },
  { month: "APR", day: "15", event: "WPI Inflation", exp: "0.3%", prev: "0.2%" },
];

export default function Sidebar() {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          <Landmark className="h-4 w-4" aria-hidden="true" />
          Institutional Activity
        </h2>
        <div className="mt-4 divide-y divide-[var(--mg-border)]">
          {activity.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <div className="font-heading text-sm font-semibold text-[var(--mg-text)]">{item.name}</div>
                <div className="mt-1 text-xs text-[var(--mg-text-soft)]">{item.sub}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${item.tone === "positive" ? "text-[var(--mg-positive)]" : "text-[var(--mg-negative)]"}`}>
                  {item.amount}
                </div>
                <div className={`mt-1 rounded-full px-2 py-0.5 text-[11px] ${item.tone === "positive" ? "bg-[var(--mg-positive-soft)] text-[var(--mg-positive)]" : "bg-[var(--mg-negative-soft)] text-[var(--mg-negative)]"}`}>
                  {item.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          Economic Calendar
        </h2>
        <div className="mt-4 space-y-3">
          {calendar.map((item) => (
            <div key={`${item.month}-${item.day}`} className="flex gap-3 rounded-2xl bg-[var(--mg-surface-soft)] p-3">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface)]">
                <span className="text-[10px] font-medium text-[var(--mg-text-soft)]">{item.month}</span>
                <span className="font-heading text-lg font-semibold text-[var(--mg-text)]">{item.day}</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--mg-text)]">{item.event}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--mg-text-soft)]">
                  <span>Exp {item.exp}</span>
                  <span>Prev {item.prev}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          IPO Center
        </h2>
        <div className="mt-4 rounded-2xl bg-[var(--mg-surface-soft)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-heading text-sm font-semibold text-[var(--mg-text)]">TechNova Solutions</div>
              <div className="mt-2 inline-flex rounded-full bg-[var(--mg-positive-soft)] px-2 py-0.5 text-xs text-[var(--mg-positive)]">
                Open
              </div>
            </div>
            <div className="text-sm font-medium text-[var(--mg-positive)]">GMP +45%</div>
          </div>
          <div className="mt-3 flex justify-between text-xs text-[var(--mg-text-soft)]">
            <span>Sub 12.5x</span>
            <span>Closes today</span>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          <Tags className="h-4 w-4" aria-hidden="true" />
          Trending Tags
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["#Nifty50", "#Q4Earnings", "#Banking", "#RBI", "#EVStocks"].map((tag) => (
            <a key={tag} href="#" className="rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-3 py-1.5 text-xs text-[var(--mg-text-muted)] transition hover:border-[var(--mg-border-strong)] hover:text-[var(--mg-text)]">
              {tag}
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
}
