import { BookOpen, Play } from "lucide-react";
import Link from "next/link";

const bars = ["h-10", "h-16", "h-12", "h-20", "h-14", "h-24", "h-[4.5rem]", "h-16"];

export default function AcademyBanner() {
  return (
    <section className="grid overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)] md:grid-cols-[1fr_320px]">
      <div className="p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-muted)]">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          MoneyGreeks Academy
        </div>
        <h2 className="mt-5 font-heading text-2xl font-semibold leading-tight text-[var(--mg-text)] md:text-3xl">
          Master technical analysis with calm, structured lessons.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--mg-text-muted)] md:text-base">
          Learn chart reading, market structure, risk management, and trading psychology through a practical curriculum built for Indian markets.
        </p>
        <Link
          href="/education"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--mg-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
        >
          Explore academy
          <Play className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="hidden border-l border-[var(--mg-border)] bg-[var(--mg-surface-soft)] p-8 md:flex md:items-end md:justify-center">
        <div className="flex h-40 items-end gap-3">
          {bars.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`${height} w-5 rounded-full bg-[var(--mg-surface-muted)]`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
