import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Flame,
  Gauge,
  Landmark,
  LineChart,
  Newspaper,
  PieChart,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const fallbackPremarket = [
  {
    id: 1,
    title: "Pre-Market Report: Nifty, Bank Nifty and Global Cues",
    slug: "pre-market-report-nifty-bank-nifty-global-cues",
    report_date: "2026-06-04",
    image_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    overall_conclusion:
      "Start the session with a neutral-to-positive bias while tracking overnight global cues, FII/DII flows, India VIX, and the first 30-minute opening range before taking directional trades.",
  },
  {
    id: 2,
    title: "Opening Bell Setup: Watch Support, Resistance and Volume",
    slug: "opening-bell-support-resistance-volume",
    report_date: "2026-06-03",
    image_url: "https://images.unsplash.com/photo-1642790106117-e829e14a795f",
    overall_conclusion:
      "Index strength remains stock-specific. Prefer clean breakouts with volume confirmation and keep position size light near event risk.",
  },
  {
    id: 3,
    title: "Weekly Options Map: Key Strikes and Expiry Risk",
    slug: "weekly-options-map-expiry-risk",
    report_date: "2026-06-02",
    image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    overall_conclusion:
      "Options data suggests a defined range. Avoid chasing late moves and monitor unwinding at heavy call and put writing zones.",
  },
];

const fallbackPosts = [
  {
    id: 11,
    slug: "how-to-build-a-trading-day-routine",
    title: "How to Build a Trading Day Routine",
    subtitle:
      "A practical routine for scanning news, index structure, sector rotation, watchlists, entries, exits and post-market review.",
    category: "Trading Process",
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    created_at: "2026-06-01",
  },
  {
    id: 12,
    slug: "risk-management-rules-for-intraday-traders",
    title: "Risk Management Rules for Intraday Traders",
    subtitle:
      "Position sizing, stop-loss discipline, daily loss limits and trade journaling rules that keep traders in the game.",
    category: "Risk",
    featured_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    created_at: "2026-05-29",
  },
  {
    id: 13,
    slug: "fii-dii-data-explained",
    title: "FII and DII Data Explained",
    subtitle:
      "How institutional flows affect market sentiment, index direction, sector leadership and short-term volatility.",
    category: "Market Basics",
    featured_image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    created_at: "2026-05-26",
  },
  {
    id: 14,
    slug: "support-resistance-and-market-structure",
    title: "Support, Resistance and Market Structure",
    subtitle:
      "Learn how traders mark key levels, identify false breakouts and separate clean setups from noisy price action.",
    category: "Technical Analysis",
    featured_image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
    created_at: "2026-05-20",
  },
];

const marketPulse = [
  { label: "Global Cues", value: "Mixed", tone: "bg-amber-100 text-amber-800", icon: Landmark },
  { label: "India VIX", value: "Watch", tone: "bg-rose-100 text-rose-800", icon: Gauge },
  { label: "Sector Bias", value: "Rotational", tone: "bg-cyan-100 text-cyan-800", icon: PieChart },
  { label: "Risk Mode", value: "Selective", tone: "bg-emerald-100 text-emerald-800", icon: ShieldCheck },
];

const morningChecklist = [
  "Review overnight US, Asian markets and commodity moves.",
  "Mark Nifty and Bank Nifty support, resistance and gap zones.",
  "Check FII/DII flows, India VIX and major corporate actions.",
  "Shortlist 6-10 liquid stocks from leading and weak sectors.",
  "Define entry, stop-loss, target and max loss before the bell.",
];

const toolModules = [
  {
    title: "Pre-Market Briefing",
    text: "A daily opening-bell note covering global cues, indices, flows, volatility and likely trading ranges.",
    icon: Newspaper,
    href: "/pre-market-archive",
  },
  {
    title: "Watchlist Builder",
    text: "Create a focused list from sector leaders, earnings names, high-volume movers and clean chart structures.",
    icon: Target,
    href: "#watchlist",
  },
  {
    title: "Risk Desk",
    text: "Plan position size, daily loss limit, trade count and stop discipline before emotions enter the trade.",
    icon: ShieldCheck,
    href: "#risk",
  },
  {
    title: "Learning Tracks",
    text: "Move from basics to practical execution with guides on options, price action, flows and psychology.",
    icon: BookOpen,
    href: "#learn",
  },
];

const watchlistIdeas = [
  { name: "Index Leaders", detail: "Stocks outperforming Nifty with rising volume", icon: TrendingUp },
  { name: "Weakness Basket", detail: "Breakdowns below support with poor sector breadth", icon: TrendingDown },
  { name: "Event Radar", detail: "Earnings, RBI policy, Fed cues, crude and currency moves", icon: CalendarDays },
  { name: "Momentum Scan", detail: "Gap-up strength that holds above VWAP after the open", icon: Flame },
];

const strategyPlaybooks = [
  {
    name: "Opening Range Breakout",
    use: "Best when index breadth is strong and the first 15-30 minutes form a tight range.",
    rule: "Enter only after confirmation, keep stop below range, avoid the first candle chase.",
  },
  {
    name: "Pullback to Level",
    use: "Useful on trending days when price retests a breakout zone or VWAP with lower selling pressure.",
    rule: "Wait for rejection, define stop first, and scale only after price moves in favor.",
  },
  {
    name: "Range Fade",
    use: "Works on low-volatility sessions when price repeatedly rejects well-marked support and resistance.",
    rule: "Trade smaller, book faster, and step aside if the range breaks with volume.",
  },
];

const glossary = [
  ["Open Interest", "Outstanding derivative contracts that help read participation and possible pressure zones."],
  ["VWAP", "Volume-weighted average price, often used by intraday traders as a fair-value reference."],
  ["Breadth", "The number of advancing versus declining stocks, useful for confirming index strength."],
  ["Gap Zone", "The price area created when the market opens away from the previous close."],
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
  title: "Finance Blog and Trading Day Desk | MoneyGreeks",
  description:
    "Daily pre-market reports, trader checklists, market insights, watchlist ideas, risk planning and finance education from MoneyGreeks.",
};

export default async function BlogPage() {
  const [premarketData, blogPostData] = await Promise.all([
    fetchJson("/report-list/", []),
    fetchJson("/blog-post/", fallbackPosts),
  ]);

  const latestPremarket = premarketData[0] || fallbackPremarket[0];
  const hasPublishedPremarket = premarketData.length > 0;
  const olderPremarkets = premarketData.slice(1, 4);
  const blogPosts = blogPostData.slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
            alt="Trader desk with financial charts"
            fill
            priority
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative mx-auto grid min-h-[560px] max-w-7xl content-end gap-10 px-6 pb-12 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pb-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              <Clock3 size={15} />
              Start your trading day
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Finance insights for traders before, during and after the market.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-100 sm:text-lg">
              MoneyGreeks can be more than a blog: use it as a daily market desk with pre-market reports, watchlist ideas, risk planning, trading playbooks and finance education in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={hasPublishedPremarket ? `/market-data/${latestPremarket.slug}` : "/pre-market-archive"}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-100"
              >
                {hasPublishedPremarket ? "Read today's briefing" : "View report archive"}
                <ArrowRight size={17} />
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center gap-2 rounded-lg border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore features
                <BarChart3 size={17} />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:justify-self-end">
            {marketPulse.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/20 bg-white/12 p-5 backdrop-blur">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-200">{item.label}</span>
                    <Icon size={20} />
                  </div>
                  <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${item.tone}`}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Today&apos;s pre-market report
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950">{latestPremarket.title}</h2>
            <p className="mt-4 leading-7 text-gray-600">{latestPremarket.overall_conclusion}</p>
            <Link
              href={hasPublishedPremarket ? `/market-data/${latestPremarket.slug}` : "/pre-market-archive"}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              {hasPublishedPremarket ? "Open report" : "View archive"}
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {morningChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Feature-rich finance hub</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            Build the site around trader workflows, not only articles.
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            A helpful finance blog can combine daily analysis, evergreen education, market data, decision tools and a journal-like routine for repeat visitors.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {toolModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-gray-950 hover:shadow-lg"
              >
                <Icon className="text-gray-950" size={26} />
                <h3 className="mt-5 text-lg font-bold text-gray-950">{module.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{module.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-950">
                  View module
                  <ArrowRight className="transition group-hover:translate-x-1" size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">Latest analysis</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Market insights and recent briefs</h2>
            <p className="mt-4 leading-7 text-gray-300">
              Blend backend-published articles with curated sections that help traders prepare, execute and review.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog-post/${post.slug}`} className="group overflow-hidden rounded-lg bg-white text-gray-950">
                <div className="relative h-44 bg-gray-100">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span>{post.category || "Insight"}</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.subtitle || post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="watchlist" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-700">Watchlist engine</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            Help traders narrow the market before the opening bell.
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            The biggest value is focus. A daily blog can point users toward the sectors, price levels and event risks that deserve attention.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {watchlistIdeas.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="rounded-lg border border-gray-200 p-5">
                  <Icon size={23} className="text-rose-700" />
                  <h3 className="mt-4 font-bold text-gray-950">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div id="risk" className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center gap-3">
            <WalletCards className="text-emerald-700" size={28} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Risk planner</p>
              <h3 className="text-2xl font-bold text-gray-950">Before-trade rules</h3>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Capital at risk", "Limit each idea to a fixed percentage of capital."],
              ["Daily stop", "Stop trading after the planned daily loss is hit."],
              ["Trade count", "Avoid overtrading by setting a maximum number of attempts."],
              ["Review note", "Log the setup, mistake, emotion and improvement after market close."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4 rounded-lg bg-white p-4">
                <ClipboardCheck className="mt-1 shrink-0 text-emerald-700" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-950">{title}</h4>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Strategy playbooks</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">Turn education into execution rules.</h2>
            </div>
            <Link href="/blog-archive" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950">
              Browse all insights
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {strategyPlaybooks.map((strategy) => (
              <article key={strategy.name} className="rounded-lg border border-gray-200 bg-white p-6">
                <LineChart className="text-cyan-700" size={26} />
                <h3 className="mt-5 text-xl font-bold text-gray-950">{strategy.name}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{strategy.use}</p>
                <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm font-medium leading-6 text-gray-800">
                  {strategy.rule}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="learn" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Learning center</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">Make finance easier to understand.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Add glossary pages, beginner tracks, options explainers, macro notes and short post-market reviews to serve traders at different levels.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {glossary.map(([term, definition]) => (
            <div key={term} className="rounded-lg border border-gray-200 p-5">
              <h3 className="font-bold text-gray-950">{term}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{definition}</p>
            </div>
          ))}
        </div>
      </section>

      {olderPremarkets.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Archive</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Recent pre-market reports</h2>
            </div>
            <Link href="/pre-market-archive" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950">
              View archive
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {olderPremarkets.map((post) => (
              <Link key={post.slug} href={`/market-data/${post.slug}`} className="group">
                <article className="h-full rounded-lg border border-gray-200 bg-white p-5 transition hover:border-gray-950 hover:shadow-lg">
                  <div className="relative mb-5 h-44 overflow-hidden rounded-lg bg-gray-100">
                    <Image src={post.image_url} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{formatDate(post.report_date)}</p>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-gray-950">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.overall_conclusion}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
