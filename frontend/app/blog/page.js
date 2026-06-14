import Link from "next/link";
import { ArrowRight, Moon, Newspaper, Search, SearchX, Sun } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const demoPremarket = [
  {
    id: 101,
    title: "Opening Gap Analysis: Global Spillovers",
    slug: "opening-gap-analysis-global-spillovers",
    report_date: "2026-06-04",
    overall_conclusion:
      "Identifying key support levels for Nifty 50 as global cues remain mixed, with attention on resistance zones and breakout quality.",
    report_type: "Premarket",
    read_time: 8,
  },
  {
    id: 102,
    title: "Pre-Open Checklist: Key Levels to Watch",
    slug: "pre-open-checklist-key-levels",
    report_date: "2026-06-03",
    overall_conclusion:
      "Index strength remains stock-specific. Prefer clean breakouts with volume confirmation near event risk.",
    report_type: "Premarket",
    read_time: 5,
  },
  {
    id: 103,
    title: "Nifty Bank: Pre-Market Bias and Range",
    slug: "nifty-bank-pre-market-bias-range",
    report_date: "2026-06-02",
    overall_conclusion:
      "Banking index is approaching a key confluence zone. Watch participation from PSU banks before taking directional bets.",
    report_type: "Premarket",
    read_time: 6,
  },
];

const demoPostmarket = [
  {
    id: 201,
    title: "Daily Closing Pulse: Sensex and Nifty Analysis",
    slug: "daily-closing-pulse-sensex-nifty",
    report_date: "2026-06-04",
    overall_conclusion:
      "Local markets remained resilient with mid-caps showing strength in auto and healthcare while global indices pulled back.",
    report_type: "Post-Market",
    read_time: 10,
  },
  {
    id: 202,
    title: "Sectoral Rotation Post Close: What Moved and Why",
    slug: "sectoral-rotation-post-close",
    report_date: "2026-06-03",
    overall_conclusion:
      "IT and pharma outperformed while metals saw profit booking. FII activity turned net buyer for a second session.",
    report_type: "Post-Market",
    read_time: 8,
  },
  {
    id: 203,
    title: "Post-Market Wrap: Breadth and Volume Study",
    slug: "post-market-wrap-breadth-volume",
    report_date: "2026-06-02",
    overall_conclusion:
      "Advance-decline ratio favoured bulls. Delivery volumes in large caps suggest accumulation near support.",
    report_type: "Post-Market",
    read_time: 7,
  },
];

const trendingAnalysis = [
  { category: "Macro", date: "Jun 4", title: "Interest rate trajectory: Fed signals" },
  { category: "Sector Watch", date: "Jun 3", title: "IT sector rebound: earnings surprise" },
  { category: "Weekly Recap", date: "Jun 2", title: "Volatility index hits yearly lows" },
];

const archiveMonths = [
  { label: "June 2026", count: 12, slug: "#" },
  { label: "May 2026", count: 30, slug: "#" },
  { label: "April 2026", count: 28, slug: "#" },
  { label: "March 2026", count: 31, slug: "#" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getTypeIcon(type) {
  const value = (type || "").toLowerCase();
  if (value.includes("pre")) return Sun;
  if (value.includes("post")) return Moon;
  return Newspaper;
}

function getTypeTone(type) {
  const value = (type || "").toLowerCase();
  return value.includes("pre")
    ? "text-[var(--mg-positive)] bg-[var(--mg-positive-soft)]"
    : "text-[var(--mg-text-muted)] bg-[var(--mg-surface-muted)]";
}

function truncateText(text, length = 120) {
  if (!text) return "";
  return text.length <= length ? text : `${text.substring(0, length).trim()}...`;
}

function fillWithDemo(liveData, demoData, minCount) {
  const result = [...liveData];
  const existingIds = new Set(result.map((report) => report.id));
  for (const item of demoData) {
    if (result.length >= minCount) break;
    if (!existingIds.has(item.id)) {
      result.push(item);
      existingIds.add(item.id);
    }
  }
  return result;
}

async function fetchJson(path, fallback) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallback;
  } catch {
    return fallback;
  }
}

export const metadata = {
  title: "Market Reports | MoneyGreeks",
  description:
    "Institutional-grade daily analysis covering pre-market and post-market movements.",
};

function ReportCard({ report }) {
  const Icon = getTypeIcon(report.report_type);
  const href = (report.report_type || "").toLowerCase().includes("post")
    ? `/post-market/${report.slug}`
    : `/market-data/${report.slug}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${getTypeTone(report.report_type)}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-xs text-[var(--mg-text-soft)]">{formatDate(report.report_date)}</span>
      </div>
      <div className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
        {report.report_type || "Premarket"}
      </div>
      <h3 className="mt-2 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
        {report.title}
      </h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--mg-text-muted)]">
        {truncateText(report.overall_conclusion, 130)}
      </p>
      <div className="mt-5 flex items-center justify-between text-sm text-[var(--mg-text-soft)]">
        <span>{report.read_time ? `${report.read_time} min read` : "5 min read"}</span>
        <ArrowRight className="h-4 w-4 text-[var(--mg-text)] transition group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

function FeaturedReport({ report, label }) {
  const Icon = getTypeIcon(report.report_type);
  const href = (report.report_type || "").toLowerCase().includes("post")
    ? `/post-market/${report.slug}`
    : `/market-data/${report.slug}`;

  return (
    <Link href={href} className="group block rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </span>
        <span className="text-xs text-[var(--mg-text-soft)]">{formatDate(report.report_date)}</span>
      </div>
      <h2 className="mt-5 font-heading text-2xl font-semibold leading-tight text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
        {report.title}
      </h2>
      <p className="mt-3 line-clamp-4 text-sm leading-7 text-[var(--mg-text-muted)]">
        {truncateText(report.overall_conclusion, 180)}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text)]">
        Read full analysis
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export default async function ReportsPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const activeFilter = params?.filter || "All";

  const [rawPremarket, rawPostmarket, rawNews] = await Promise.all([
    fetchJson("/report-list/", []),
    fetchJson("/post-market-list/", []),
    fetchJson("/blog-post/", []),
  ]);

  const livePremarket = rawPremarket.filter(
    (report) => !(report.report_type || "").toLowerCase().includes("post"),
  );
  const livePostmarket = rawPostmarket.map((report) => ({
    ...report,
    report_type: report.report_type || "Post-Market",
  }));
  const displayTrending =
    rawNews
      .filter((post) => post.category !== "education")
      .slice(0, 3)
      .map((news) => ({
        category: news.category || "News",
        date: formatDate(news.created_at),
        title: news.title,
        slug: news.slug,
      })) || trendingAnalysis;

  const premarketList = fillWithDemo(livePremarket, demoPremarket, 8);
  const postmarketList = fillWithDemo(livePostmarket, demoPostmarket, 8);
  const fullList = [...premarketList, ...postmarketList].sort(
    (a, b) => new Date(b.report_date) - new Date(a.report_date),
  );

  const featuredPremarket =
    fullList.find((report) => !(report.report_type || "").toLowerCase().includes("post")) ||
    premarketList[0];
  const featuredPostmarket =
    fullList.find((report) => (report.report_type || "").toLowerCase().includes("post")) ||
    postmarketList[0];

  let gridData = fullList;
  const isFiltering = query !== "" || activeFilter !== "All";

  if (query) {
    const lowerQuery = query.toLowerCase();
    gridData = gridData.filter(
      (report) =>
        report.title?.toLowerCase().includes(lowerQuery) ||
        report.overall_conclusion?.toLowerCase().includes(lowerQuery) ||
        report.report_type?.toLowerCase().includes(lowerQuery),
    );
  }

  if (activeFilter !== "All") {
    gridData = gridData.filter((report) => {
      const type = (report.report_type || "").toLowerCase();
      if (activeFilter === "Premarket") return !type.includes("post") && !type.includes("weekly");
      if (activeFilter === "Post-Market") return type.includes("post");
      if (activeFilter === "Weekly") return type.includes("weekly");
      return true;
    });
  }

  if (!isFiltering) {
    gridData = fullList.filter(
      (report) => report.id !== featuredPremarket.id && report.id !== featuredPostmarket.id,
    );
  }

  const displayCards = gridData.slice(0, isFiltering ? 20 : 6);
  const displayArchives = archiveMonths;

  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <div className="mx-auto max-w-[var(--mg-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="border-b border-[var(--mg-border)] pb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">Reports</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-[var(--mg-text)] md:text-5xl">
            Market Reports
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--mg-text-muted)]">
            Daily pre-market setups, post-market reviews, and macro catalysts for focused investors.
          </p>
        </header>

        <section className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form method="GET" className="relative flex-1">
            <input type="hidden" name="filter" value={activeFilter} />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mg-text-soft)]" aria-hidden="true" />
            <input
              name="q"
              defaultValue={query}
              className="h-12 w-full rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface)] pl-11 pr-4 text-sm outline-none transition placeholder:text-[var(--mg-text-soft)] focus:border-[var(--mg-border-strong)]"
              placeholder="Search reports by keyword, symbol, or date"
              type="text"
            />
          </form>

          <div className="flex gap-2 overflow-x-auto">
            {["All", "Premarket", "Post-Market", "Weekly"].map((filter) => (
              <Link
                key={filter}
                href={`?filter=${encodeURIComponent(filter)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  activeFilter === filter
                    ? "border-[var(--mg-accent)] bg-[var(--mg-accent)] text-white"
                    : "border-[var(--mg-border)] bg-[var(--mg-surface)] text-[var(--mg-text-muted)] hover:border-[var(--mg-border-strong)] hover:text-[var(--mg-text)]"
                }`}
              >
                {filter}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr_320px]">
          <FeaturedReport report={featuredPremarket} label="Premarket Analysis" />
          <FeaturedReport report={featuredPostmarket} label="Post-Market Analysis" />

          <aside className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)]">
            <h2 className="font-heading text-lg font-semibold text-[var(--mg-text)]">Trending Analysis</h2>
            <div className="mt-4 divide-y divide-[var(--mg-border)]">
              {(displayTrending.length ? displayTrending : trendingAnalysis).map((item) => (
                <div key={item.slug || item.title} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 text-xs text-[var(--mg-text-soft)]">
                    <span className="font-medium uppercase tracking-[0.14em]">{item.category}</span>
                    <span>{item.date}</span>
                  </div>
                  {item.slug ? (
                    <Link href={`/news-today/${item.slug}`} className="mt-2 block text-sm font-medium leading-6 text-[var(--mg-text)] hover:text-[var(--mg-text-muted)]">
                      {item.title}
                    </Link>
                  ) : (
                    <p className="mt-2 text-sm font-medium leading-6 text-[var(--mg-text)]">{item.title}</p>
                  )}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
                  {isFiltering ? "Filtered" : "Recent"}
                </p>
                <h2 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
                  {isFiltering ? "Search Results" : "Recent Dispatches"}
                </h2>
              </div>
              <Link href="/pre-market-archive" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
                All reports
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {displayCards.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {displayCards.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-10 text-center shadow-[var(--mg-shadow)]">
                <SearchX className="mx-auto h-8 w-8 text-[var(--mg-text-soft)]" aria-hidden="true" />
                <p className="mt-3 text-sm text-[var(--mg-text-muted)]">No reports matched your search criteria.</p>
              </div>
            )}
          </div>

          <aside className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-6 shadow-[var(--mg-shadow)] lg:self-start">
            <h2 className="font-heading text-lg font-semibold text-[var(--mg-text)]">Archives</h2>
            <ul className="mt-4 divide-y divide-[var(--mg-border)]">
              {displayArchives.map((month) => (
                <li key={month.label} className="py-3 first:pt-0 last:pb-0">
                  <Link href={month.slug} className="flex items-center justify-between gap-3 text-sm text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
                    <span>{month.label}</span>
                    <span className="text-xs text-[var(--mg-text-soft)]">{month.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/pre-market-archive" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text)]">
              Search full archive
              <Search className="h-4 w-4" aria-hidden="true" />
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
