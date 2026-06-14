import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function PremiumBanner() {
  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)] md:p-8">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full bg-[var(--mg-surface-muted)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-muted)]">
          Premium report
        </div>
        <h2 className="mt-5 font-heading text-2xl font-semibold leading-tight text-[var(--mg-text)] md:text-3xl">
          Earnings season playbook: navigating Q4 IT sector results
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--mg-text-muted)] md:text-base">
          An in-depth analysis of major IT heavyweights ahead of disclosures, covering margin pressure,
          deal pipelines, valuation context, and key technical levels.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--mg-text-soft)]">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            8 min read
          </span>
          <span>Published 08:30 AM IST</span>
          <Link href="/blog" className="inline-flex items-center gap-2 font-medium text-[var(--mg-text)] transition hover:text-[var(--mg-text-muted)]">
            Open report
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
