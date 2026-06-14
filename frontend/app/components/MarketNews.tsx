import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPostsByCategory } from "../utils/api";

const fallbackNews = [
  {
    category: "Economy",
    title: "RBI keeps repo rate unchanged while monitoring sticky food inflation",
    excerpt: "The Monetary Policy Committee stayed cautious, keeping liquidity and inflation in focus.",
  },
  {
    category: "Corporate",
    title: "Reliance announces strategic partnership with a global technology major",
    excerpt: "The group outlined a multi-year investment plan across platforms and infrastructure.",
  },
  {
    category: "Global Markets",
    title: "US Fed commentary supports risk sentiment across equity markets",
    excerpt: "Investors are pricing a softer path as disinflation slowly broadens across categories.",
  },
  {
    category: "Sectors",
    title: "Auto sales rise as EV adoption crosses a key threshold",
    excerpt: "Passenger vehicle demand remains resilient, with premium SUVs leading volume growth.",
  },
];

function extractText(content: unknown): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(extractText).join(" ");
  if (typeof content === "object") {
    const record = content as { text?: unknown; content?: unknown };
    if (record.text) return extractText(record.text);
    if (record.content) return extractText(record.content);
  }
  return String(content);
}

function truncateText(content: unknown, length = 100) {
  const text = extractText(content);
  if (!text) return "";
  return text.length <= length ? text : `${text.substring(0, length).trim()}...`;
}

export default async function MarketNews() {
  const liveNews = await fetchPostsByCategory("news");
  const displayNews =
    liveNews && liveNews.length > 0
      ? liveNews.slice(0, 4).map((post: any) => ({
          category: post.news_placement
            ? post.news_placement.replace("_", " ")
            : "Market News",
          title: post.title,
          excerpt: truncateText(post.summary || post.content, 120),
          slug: post.slug,
        }))
      : fallbackNews;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
            Latest
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
            Market News
          </h2>
        </div>
        <Link href="/news-today" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {displayNews.map((item: any, index: number) => (
          <Link
            key={item.slug || index}
            href={item.slug ? `/news-today/${item.slug}` : "/news-today"}
            className="group rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]"
          >
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
              {item.category}
            </div>
            <h3 className="mt-3 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
              {item.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--mg-text-muted)]">
              {item.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
