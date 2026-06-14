import Link from "next/link";
import { ArrowLeft, Clock3, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Threads | MoneyGreeks",
  description: "Community-driven financial discussions are coming soon to MoneyGreeks.",
};

const features = [
  "Threaded discussions on market reports",
  "Community-verified stock ideas",
  "Analyst Q&A and debate forums",
  "Upvote signal, downvote noise",
];

export default function ThreadsPage() {
  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[var(--mg-container)] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)]">
          <MessageSquare className="h-9 w-9 text-[var(--mg-text-muted)]" aria-hidden="true" />
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--mg-warning)]" />
          Coming soon
        </div>

        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-semibold leading-tight text-[var(--mg-text)] md:text-6xl">
          Threads is on its way.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[var(--mg-text-muted)]">
          We are building a focused space for traders and analysts to discuss ideas,
          dissect reports, and challenge each other&apos;s theses with signal over noise.
        </p>

        <ul className="mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface)] px-4 py-3 text-sm text-[var(--mg-text-muted)]">
              <Clock3 className="h-4 w-4 shrink-0 text-[var(--mg-text-soft)]" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <Link href="/" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--mg-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Markets
        </Link>
      </section>
    </main>
  );
}
