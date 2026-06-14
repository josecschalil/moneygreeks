import Link from "next/link";
import { BadgeCheck, Eye, Lightbulb, Scale } from "lucide-react";

const stats = [
  { value: "15,000+", label: "Newsletter readers" },
  { value: "6+ yrs", label: "In the market" },
  { value: "Daily", label: "Pre-market reports" },
  { value: "Zero", label: "Sponsored opinions" },
];

const values = [
  {
    title: "Accuracy",
    text: "Rigorous verification so every metric and market note meets a professional standard.",
    icon: BadgeCheck,
  },
  {
    title: "Integrity",
    text: "Independent analysis designed to be useful, transparent, and free from paid opinions.",
    icon: Scale,
  },
  {
    title: "Innovation",
    text: "Modern tooling and data workflows that help investors see structure through noise.",
    icon: Lightbulb,
  },
  {
    title: "Transparency",
    text: "Clear reasoning, readable methodology, and practical context behind every report.",
    icon: Eye,
  },
];

const timeline = [
  {
    year: "2018",
    title: "The Foundation",
    text: "MoneyGreeks began as a focused research blog for retail investors looking for institutional-grade clarity.",
  },
  {
    year: "2021",
    title: "Data Integration",
    text: "The platform evolved into a data-first research workspace with market feeds and quantitative context.",
  },
  {
    year: "2024",
    title: "The Intelligence Terminal",
    text: "We expanded into daily reports, education, and structured workflows for serious market participants.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <section className="border-b border-[var(--mg-border)] bg-[var(--mg-surface)]">
        <div className="mx-auto max-w-[var(--mg-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
            <span>Est. 2018</span>
            <span className="h-px w-10 bg-[var(--mg-border-strong)]" />
            <span>Mumbai, India</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-[1.02] text-[var(--mg-text)] md:text-7xl">
                Built for people who read the fine print.
              </h1>
            </div>
            <div className="space-y-5">
              <p className="text-base leading-8 text-[var(--mg-text-muted)]">
                MoneyGreeks started as a passion project by traders who were tired of market noise.
                No sponsored content. No fluff. Just careful analysis for people who take capital seriously.
              </p>
              <Link href="/contact" className="inline-flex rounded-full bg-[var(--mg-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/80">
                Get in touch
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-[var(--mg-border)] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] p-5">
                <p className="font-heading text-2xl font-semibold text-[var(--mg-text)]">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--mg-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">Principles</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--mg-text)]">Our Core Values</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mg-surface-muted)] text-[var(--mg-text)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-[var(--mg-text)]">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--mg-text-muted)]">{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">Story</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-[var(--mg-text)]">Our Evolution</h2>
        </div>
        <div className="space-y-4">
          {timeline.map((item) => (
            <article key={item.year} className="grid gap-4 rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)] sm:grid-cols-[90px_1fr]">
              <div className="font-heading text-2xl font-semibold text-[var(--mg-text)]">{item.year}</div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-[var(--mg-text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--mg-text-muted)]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--mg-border)] bg-[var(--mg-surface)]">
        <div className="mx-auto max-w-[var(--mg-container)] px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="font-heading text-3xl font-semibold text-[var(--mg-text)]">
            Join the intelligence community.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--mg-text-muted)]">
            Get thoughtful reports, educational guides, and market context built around clarity.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/blog" className="rounded-full bg-[var(--mg-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80">
              Explore reports
            </Link>
            <Link href="/contact" className="rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-5 py-3 text-sm font-medium text-[var(--mg-text)] transition hover:border-[var(--mg-border-strong)]">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
