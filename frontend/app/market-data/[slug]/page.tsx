import { ArrowUp, ArrowDown, Clock, Calendar, User } from "lucide-react";
import TopGainers from "@/app/components/topGainers";
import TopSectors from "@/app/components/topSectors";
import RecommendedPosts from "@/app/components/recommended";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  defaultOpenGraphImage,
  getSiteUrl,
  splitKeywords,
} from "@/app/utils/seo";
interface GlobalMarketIndex {
  id: number;
  index_name: string;
  prev_close: number;
  trend: "up" | "down";
  open_price: number;
  change: number;
  change_percent: number;
}
interface IndianMarketIndex {
  id: number;
  index_name: string;
  prev_close: number;
  trend: "up" | "down";
  open_price: number;
  change: number;
  change_percent: number;
}
interface OptionChainSummary {
  id: number;
  symbol: string;
  expiry: string;
  pcr: string | number | null;
  max_call_oi_strike: string | number | null;
  max_call_oi: number;
  max_put_oi_strike: string | number | null;
  max_put_oi: number;
  underlying_value: string | number | null;
  analysis: string;
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMarketNumber(value: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function getPcrView(value: string | number | null) {
  const pcr = Number(value);
  if (Number.isNaN(pcr)) {
    return {
      label: "Unclear",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    };
  }
  if (pcr >= 1.2) {
    return {
      label: "Put heavy",
      className: "bg-green-50 text-green-700 border-green-200",
    };
  }
  if (pcr <= 0.8) {
    return {
      label: "Call heavy",
      className: "bg-red-50 text-red-700 border-red-200",
    };
  }
  return {
    label: "Balanced",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  };
}

function getDistanceFromSpot(
  strike: string | number | null,
  underlying: string | number | null,
) {
  const strikeValue = Number(strike);
  const underlyingValue = Number(underlying);
  if (
    Number.isNaN(strikeValue) ||
    Number.isNaN(underlyingValue) ||
    underlyingValue <= 0
  ) {
    return "";
  }
  const distance = Math.abs(((strikeValue - underlyingValue) / underlyingValue) * 100);
  return `${formatMarketNumber(distance)}% from spot`;
}

function getConclusionView(text: string) {
  const fallback =
    "The market setup is being prepared from the latest available data. Traders should wait for opening confirmation and manage risk carefully.";
  const source = String(text || fallback).trim();
  const disclaimer =
    "This report is for market preparation and education only, not a direct buy or sell recommendation.";
  const body = source.replace(disclaimer, "").trim();
  const readableBody = body
    .replace(/\s+(Sector rotation is important today\.)/g, "\n\n$1")
    .replace(/\s+(The safer approach is)/g, "\n\n$1");
  const paragraphs = readableBody
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    paragraphs: paragraphs.length ? paragraphs : [fallback],
    disclaimer: source.includes(disclaimer) ? disclaimer : "",
  };
}

function getOpeningBriefing({
  globalIndices,
  indianIndices,
  marketBreadth,
  institutionalFlows,
  optionChainSummaries,
}: {
  globalIndices: GlobalMarketIndex[];
  indianIndices: IndianMarketIndex[];
  marketBreadth?: {
    advancing?: number;
    declining?: number;
    advance_decline_ratio?: string | number;
  };
  institutionalFlows: InstitutionalActivity[];
  optionChainSummaries: OptionChainSummary[];
}) {
  const giftNifty = globalIndices.find((item) =>
    item.index_name?.toLowerCase().includes("gift"),
  );
  const indiaVix = indianIndices.find((item) =>
    item.index_name?.toLowerCase().includes("vix"),
  );
  const niftyOptions =
    optionChainSummaries.find((item) => item.symbol?.toUpperCase() === "NIFTY") ||
    optionChainSummaries[0];
  const fiiNet = Number(
    institutionalFlows.find((item) =>
      String(item.institution_type).toUpperCase().includes("FII"),
    )?.net_value,
  );
  const diiNet = Number(
    institutionalFlows.find((item) =>
      String(item.institution_type).toUpperCase().includes("DII"),
    )?.net_value,
  );
  const giftChange = Number(giftNifty?.change_percent);
  const vixChange = Number(indiaVix?.change_percent);
  const breadthRatio = Number(marketBreadth?.advance_decline_ratio);

  let score = 0;
  if (!Number.isNaN(giftChange)) score += giftChange > 0.15 ? 1 : giftChange < -0.15 ? -1 : 0;
  if (!Number.isNaN(breadthRatio)) score += breadthRatio >= 1.2 ? 1 : breadthRatio < 0.9 ? -1 : 0;
  if (!Number.isNaN(fiiNet) && !Number.isNaN(diiNet)) {
    score += fiiNet > 0 && diiNet > 0 ? 1 : fiiNet < 0 && diiNet < 0 ? -1 : 0;
  }
  if (!Number.isNaN(vixChange)) score += vixChange < -3 ? 1 : vixChange > 3 ? -1 : 0;

  const stance =
    score >= 2
      ? "Constructive, but confirmation-first"
      : score <= -2
        ? "Cautious, risk control first"
        : "Selective, wait for range break";
  const stanceClass =
    score >= 2
      ? "border-green-200 bg-green-50 text-green-800"
      : score <= -2
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

  const drivers = [
    {
      label: "Global Cue",
      value: giftNifty
        ? `${giftNifty.index_name}: ${formatMarketNumber(giftNifty.change_percent)}%`
        : "GIFT Nifty unavailable",
      detail:
        !Number.isNaN(giftChange) && giftChange < -0.15
          ? "Opening cue is soft. Let price reclaim the opening range before trusting long trades."
          : !Number.isNaN(giftChange) && giftChange > 0.15
            ? "Opening cue is supportive. Still avoid chasing the first move without follow-through."
            : "Global cue is flat to mixed, so stock and sector selection matter more.",
    },
    {
      label: "Market Internals",
      value: Number.isNaN(breadthRatio)
        ? "Breadth unavailable"
        : `A/D ratio: ${formatMarketNumber(breadthRatio)}`,
      detail:
        !Number.isNaN(breadthRatio) && breadthRatio < 0.9
          ? "Breadth is weak. Broad-market longs need extra confirmation."
          : !Number.isNaN(breadthRatio) && breadthRatio >= 1.2
            ? "Breadth is supportive. Pullbacks may find better participation."
            : "Breadth is balanced. Expect selective movement rather than a clean broad trend.",
    },
    {
      label: "Risk Gauge",
      value: indiaVix
        ? `India VIX: ${formatMarketNumber(indiaVix.open_price)} (${formatMarketNumber(indiaVix.change_percent)}%)`
        : "India VIX unavailable",
      detail:
        !Number.isNaN(vixChange) && vixChange > 3
          ? "Volatility is rising. Keep position size smaller and respect stops."
          : !Number.isNaN(vixChange) && vixChange < -3
            ? "Volatility is cooling. Intraday swings may be more orderly."
            : "Volatility is not giving a strong warning signal yet.",
    },
  ];

  const levels = niftyOptions
    ? {
        putWall: formatMarketNumber(niftyOptions.max_put_oi_strike),
        callWall: formatMarketNumber(niftyOptions.max_call_oi_strike),
        putDistance: getDistanceFromSpot(
          niftyOptions.max_put_oi_strike,
          niftyOptions.underlying_value,
        ),
        callDistance: getDistanceFromSpot(
          niftyOptions.max_call_oi_strike,
          niftyOptions.underlying_value,
        ),
        pcr: formatMarketNumber(niftyOptions.pcr),
        expiry: niftyOptions.expiry || "-",
      }
    : null;

  return {
    stance,
    stanceClass,
    drivers,
    levels,
    flow:
      Number.isNaN(fiiNet) || Number.isNaN(diiNet)
        ? "Institutional flow is unavailable."
        : fiiNet < 0 && diiNet > 0
          ? `FII net ${formatMarketNumber(fiiNet)} vs DII net ${formatMarketNumber(diiNet)}: domestic support is absorbing foreign selling.`
          : fiiNet > 0 && diiNet > 0
            ? "Both FII and DII flows are positive, which supports dips if price confirms."
            : fiiNet < 0 && diiNet < 0
              ? "Both FII and DII flows are negative, so failed bounces deserve caution."
              : "Institutional flow is mixed; price action should lead the decision.",
  };
}

export interface InstitutionalActivity {
  id: number;
  institution_type: "FII" | "DII" | string;
  date: string;
  buy_value: string;
  sell_value: string;
  net_value: string;
  report: number;
  trend: "up" | "down";
}

async function getMarketData(slug: string) {
  console.log("Fetching data for slug:", slug);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${slug}/`, {
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn("Backend reports endpoint unavailable. Trying local premarket file fallback.");
  }

  // Fallback: Read local file from frontend/public/data/premarket/[slug].json
  try {
    const filePath = path.join(process.cwd(), "public", "data", "premarket", `${slug}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error("Failed to read local premarket file fallback:", err);
  }

  notFound();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMarketData(slug);
  if (!data) return { title: "Pre-Market Data | MoneyGreeks" };

  const metaTitle = data.meta_title || `${data.title} | MoneyGreeks`;
  const metaDescription = data.meta_description || "Complete analysis of Indian stock market opening with GIFTNIFTY, NIFTY50, BANKNIFTY, BSE SENSEX performance.";
  const metaKeywords = data.meta_keywords ? splitKeywords(data.meta_keywords) : ["India Market", "NIFTY", "Sensex", "Stock Market", "Market Open", "Trading"];
  const canonicalUrl = `${getSiteUrl()}/market-data/${slug}`;
  const imageUrl = absoluteUrl(data.featured_image || defaultOpenGraphImage());
  const datePublished = data.created_at || data.report_date;
  const dateModified = data.updated_at || datePublished;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: datePublished,
      modifiedTime: dateModified,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MarketBlogPost({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMarketData(slug);
  const metadata = {
    title: data.title,
    description:
      "Complete analysis of Indian stock market opening with GIFTNIFTY, NIFTY50, BANKNIFTY, BSE SENSEX performance and top gainers/losers.",
    author: "Market Analyst Team",
    publishDate: data.report_date,
    keywords: [
      "India Market",
      "NIFTY",
      "Sensex",
      "Stock Market",
      "Market Open",
      "Trading",
    ],
    canonicalUrl: `${getSiteUrl()}/market-data/${slug}`,
  };
  const globalIndices = Array.isArray(data?.global_indices)
    ? data.global_indices
    : [];
  const IndianIndices = Array.isArray(data?.indian_indices)
    ? data.indian_indices
    : [];
  const FIIDII_DATA = Array.isArray(data?.institutional_flows)
    ? data.institutional_flows
    : [];
  const globalAnalysis = data?.global_analysis;
  const MarketBreadth = data?.market_breadth;
  const optionChainSummaries: OptionChainSummary[] = Array.isArray(
    data?.option_chain_summaries,
  )
    ? data.option_chain_summaries
    : [];
  const conclusionView = getConclusionView(data?.overall_conclusion);
  const openingBriefing = getOpeningBriefing({
    globalIndices,
    indianIndices: IndianIndices,
    marketBreadth: MarketBreadth,
    institutionalFlows: FIIDII_DATA,
    optionChainSummaries,
  });

  const jsonLd = buildArticleJsonLd({
    type: "Report",
    title: data.title,
    description: data.meta_description || metadata.description,
    url: metadata.canonicalUrl,
    image: absoluteUrl(data.featured_image || defaultOpenGraphImage()),
    datePublished: data.report_date || data.created_at,
    dateModified: data.updated_at || data.report_date || data.created_at,
    author: data.analyst || metadata.author,
    section: "Pre-Market",
    keywords: splitKeywords(data.meta_keywords || metadata.keywords),
    wordCount: undefined,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: "Market Data", url: `${getSiteUrl()}/market-data` },
    { name: data.title, url: metadata.canonicalUrl },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li className="before:content-['›'] before:mx-2">
              <Link href="/" className="hover:text-blue-600">
                Moneygreeks
              </Link>
            </li>
            <li className="before:content-['›'] before:mx-2 text-blue-600 font-medium">
              pre-market-data
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {/* Article Header */}
            <article>
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {metadata.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{metadata.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <time>{formatDate(metadata.publishDate)}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 min read</span>
                  </div>
                </div>

                <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 px-4 py-4 md:px-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Pre-Open Briefing
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                          {openingBriefing.stance}
                        </h2>
                      </div>
                      <span
                        className={`w-fit rounded-md border px-3 py-1 text-xs font-semibold ${openingBriefing.stanceClass}`}
                      >
                        Opening read
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                    {openingBriefing.drivers.map((driver) => (
                      <div key={driver.label} className="p-4 md:p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {driver.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900">
                          {driver.value}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {driver.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-0 border-t border-gray-200 md:grid-cols-[1.1fr_1fr]">
                    <div className="p-4 md:p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Institutional Read
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {openingBriefing.flow}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 p-4 md:border-l md:border-t-0 md:p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Expiry OI Context
                      </p>
                      {openingBriefing.levels ? (
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-md bg-green-50 px-2 py-2">
                            <p className="text-[11px] font-medium text-green-700">
                              Put OI Wall
                            </p>
                            <p className="mt-1 text-sm font-semibold text-green-800">
                              {openingBriefing.levels.putWall}
                            </p>
                            <p className="mt-1 text-[11px] text-green-700">
                              {openingBriefing.levels.putDistance}
                            </p>
                          </div>
                          <div className="rounded-md bg-blue-50 px-2 py-2">
                            <p className="text-[11px] font-medium text-blue-700">
                              PCR
                            </p>
                            <p className="mt-1 text-sm font-semibold text-blue-800">
                              {openingBriefing.levels.pcr}
                            </p>
                          </div>
                          <div className="rounded-md bg-red-50 px-2 py-2">
                            <p className="text-[11px] font-medium text-red-700">
                              Call OI Wall
                            </p>
                            <p className="mt-1 text-sm font-semibold text-red-800">
                              {openingBriefing.levels.callWall}
                            </p>
                            <p className="mt-1 text-[11px] text-red-700">
                              {openingBriefing.levels.callDistance}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          Options levels are not available for this report.
                        </p>
                      )}
                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        These are expiry OI walls, not direct intraday support or resistance. Use them only as context.
                      </p>
                    </div>
                  </div>
                </section>
              </header>
              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Global Market
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live</span>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200/80">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Index
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Prev Close
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          LTP
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Change
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Change %
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalIndices.map((index: GlobalMarketIndex) => (
                        <tr
                          key={index.id}
                          className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                            {index.index_name}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.prev_close}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.open_price}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                index.trend === "down"
                                  ? "bg-red-50 text-red-600 border border-red-200/50"
                                  : "bg-green-50 text-green-600 border border-green-200/50"
                              }`}
                            >
                              {index.change_percent > 0 ? "+" : ""}
                              {index.change_percent}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {index.trend === "down" ? (
                              <ArrowDown
                                size={16}
                                className="inline text-red-500"
                              />
                            ) : (
                              <ArrowUp
                                size={16}
                                className="inline text-green-500"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-2.5">
                  {globalIndices.map((index: GlobalMarketIndex) => (
                    <div
                      key={index.id}
                      className="relative bg-white rounded-xl p-4 border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base mb-0.5">
                            {index.index_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              LTP: {index.open_price}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0 ${
                            index.trend === "down" ? "bg-red-50" : "bg-green-50"
                          }`}
                        >
                          {index.trend === "down" ? (
                            <ArrowDown size={14} className="text-red-600" />
                          ) : (
                            <ArrowUp size={14} className="text-green-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change_percent > 0 ? "+" : ""}
                            {index.change_percent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Previous Close
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {index.prev_close}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Change</p>
                          <p
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                          index.trend === "down" ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
                {/* Note Section */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Note:</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>
                          • Open prices are based on pre-market indicators and
                          may differ slightly at actual market open.
                        </li>
                        <li>
                          • Traders are advised to wait for the first 30 minutes
                          of trading to gauge market direction more accurately.
                        </li>
                        <li>
                          • Always use proper risk management techniques,
                          especially on days with higher volatility.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Indian Market
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live</span>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200/80">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Index
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Prev Close
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          LTP
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Change
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Change %
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {IndianIndices.map((index: IndianMarketIndex) => (
                        <tr
                          key={index.id}
                          className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                            {index.index_name}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.prev_close}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.open_price}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                index.trend === "down"
                                  ? "bg-red-50 text-red-600 border border-red-200/50"
                                  : "bg-green-50 text-green-600 border border-green-200/50"
                              }`}
                            >
                              {index.change_percent > 0 ? "+" : ""}
                              {index.change_percent}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {index.trend === "down" ? (
                              <ArrowDown
                                size={16}
                                className="inline text-red-500"
                              />
                            ) : (
                              <ArrowUp
                                size={16}
                                className="inline text-green-500"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-2.5">
                  {IndianIndices.map((index: IndianMarketIndex) => (
                    <div
                      key={index.id}
                      className="relative bg-white rounded-xl p-4 border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base mb-0.5">
                            {index.index_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              LTP: {index.open_price}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0 ${
                            index.trend === "down" ? "bg-red-50" : "bg-green-50"
                          }`}
                        >
                          {index.trend === "down" ? (
                            <ArrowDown size={14} className="text-red-600" />
                          ) : (
                            <ArrowUp size={14} className="text-green-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change_percent > 0 ? "+" : ""}
                            {index.change_percent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Previous Close
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {index.prev_close}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Change</p>
                          <p
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                          index.trend === "down" ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    Institutional Money Flow [ Combined NSE,BSE and MSEI ]
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live</span>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200/80">
                        <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Category
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Buy Value
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Sell Value
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Net Value
                        </th>

                        <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {FIIDII_DATA.map((index: InstitutionalActivity) => (
                        <tr
                          key={index.id}
                          className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                            {index.date}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.buy_value}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.sell_value}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.net_value}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          ></td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                index.trend === "down"
                                  ? "bg-red-50 text-red-600 border border-red-200/50"
                                  : "bg-green-50 text-green-600 border border-green-200/50"
                              }`}
                            ></span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {index.trend === "down" ? (
                              <ArrowDown
                                size={16}
                                className="inline text-red-500"
                              />
                            ) : (
                              <ArrowUp
                                size={16}
                                className="inline text-green-500"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-2.5">
                  {FIIDII_DATA.map((index: InstitutionalActivity) => (
                    <div
                      key={index.id}
                      className="relative bg-white rounded-xl p-4 border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base mb-0.5">
                            {index.institution_type}
                          </h3>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Buy Value
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {index.buy_value}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0 ${
                            index.trend === "down" ? "bg-red-50" : "bg-green-50"
                          }`}
                        >
                          {index.trend === "down" ? (
                            <ArrowDown size={14} className="text-red-600" />
                          ) : (
                            <ArrowUp size={14} className="text-green-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            Net: {index.net_value}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Sell Value
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {index.sell_value}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Date</p>
                          <p
                            className={`text-sm font-medium ${
                              index.trend === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.date}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                          index.trend === "down" ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bg-white rounded-lg shadow-sm p-6 mb-8 prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Market Sentiments Explained in Detail:
                </h2>
                <p className="mb-4 text-gray-700">
                  {globalAnalysis?.analysis ||
                    "Market sentiment is being prepared from the latest available data. Traders should verify global cues and wait for opening confirmation before taking a directional view."}
                </p>
              </section>
              {optionChainSummaries.length > 0 && (
                <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                  <div className="flex items-center justify-between mb-5 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                      Options Setup
                    </h2>
                    <span className="text-xs font-medium text-gray-500">
                      Expiry OI walls
                    </span>
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200/80">
                          <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Index
                          </th>
                          <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Underlying
                          </th>
                          <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            PCR Stance
                          </th>
                          <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Call OI Wall
                          </th>
                          <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Put OI Wall
                          </th>
                          <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Expiry
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {optionChainSummaries.map((item) => {
                          const pcrView = getPcrView(item.pcr);
                          return (
                            <tr
                              key={item.id}
                              className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
                            >
                              <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                                {item.symbol}
                              </td>
                              <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                                {formatMarketNumber(item.underlying_value)}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <span
                                  className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${pcrView.className}`}
                                >
                                  {formatMarketNumber(item.pcr)} ·{" "}
                                  {pcrView.label}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="text-sm font-medium text-red-600">
                                  {formatMarketNumber(item.max_call_oi_strike)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  OI {formatMarketNumber(item.max_call_oi)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {getDistanceFromSpot(
                                    item.max_call_oi_strike,
                                    item.underlying_value,
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="text-sm font-medium text-green-600">
                                  {formatMarketNumber(item.max_put_oi_strike)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  OI {formatMarketNumber(item.max_put_oi)}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {getDistanceFromSpot(
                                    item.max_put_oi_strike,
                                    item.underlying_value,
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                                {item.expiry || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-2.5">
                    {optionChainSummaries.map((item) => {
                      const pcrView = getPcrView(item.pcr);
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-4 border border-gray-200/70"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900 text-base">
                                {item.symbol}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Underlying:{" "}
                                {formatMarketNumber(item.underlying_value)}
                              </p>
                            </div>
                            <span
                              className={`rounded-md border px-2 py-1 text-xs font-medium ${pcrView.className}`}
                            >
                              PCR {formatMarketNumber(item.pcr)} ·{" "}
                              {pcrView.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                            <p className="text-xs text-gray-500">
                                Call OI Wall
                              </p>
                              <p className="font-medium text-red-600">
                                {formatMarketNumber(item.max_call_oi_strike)}
                              </p>
                              <p className="text-xs text-gray-500">
                                OI {formatMarketNumber(item.max_call_oi)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {getDistanceFromSpot(
                                  item.max_call_oi_strike,
                                  item.underlying_value,
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Put OI Wall
                              </p>
                              <p className="font-medium text-green-600">
                                {formatMarketNumber(item.max_put_oi_strike)}
                              </p>
                              <p className="text-xs text-gray-500">
                                OI {formatMarketNumber(item.max_put_oi)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {getDistanceFromSpot(
                                  item.max_put_oi_strike,
                                  item.underlying_value,
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-gray-500">
                            Expiry: {item.expiry || "-"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-3">
                    <p className="rounded-md bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                      Highest OI strikes can be far from spot. Treat this section as expiry positioning context, not a day-trading level map.
                    </p>
                    {optionChainSummaries.map((item) => (
                      <p
                        key={`${item.id}-analysis`}
                        className="text-sm leading-6 text-gray-700"
                      >
                        {item.analysis}
                      </p>
                    ))}
                  </div>
                </section>
              )}
              <TopGainers stockmovers={data?.stock_movers} />

              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-5">
                  Previous Day&apos;s Market Breadth
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-50/80 to-green-100/60 rounded-lg p-4 border border-green-200/60 hover:border-green-300/60 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-600 rounded-md p-1.5 shadow-sm">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 4l8 8h-6v8h-4v-8H4z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Advancing
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">
                        ▲
                      </span>
                    </div>
                    <div className="text-2xl font-semibold text-green-700 mb-1">
                      {MarketBreadth?.advancing || 0}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      stocks
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50/80 to-red-100/60 rounded-lg p-4 border border-red-200/60 hover:border-red-300/60 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-500 rounded-md p-1.5 shadow-sm">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 20l-8-8h6V4h4v8h6z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Declining
                        </span>
                      </div>
                      <span className="text-xs text-red-500 font-medium">
                        ▼
                      </span>
                    </div>
                    <div className="text-2xl font-semibold text-red-600 mb-1">
                      {MarketBreadth?.declining || 0}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      stocks
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50/80 to-red-100/60 rounded-lg p-4 border border-red-200/60 hover:border-red-300/60 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-500 rounded-md p-1.5 shadow-sm">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 13h8V3h2v10h8v2h-8v8h-2v-8H3z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          AD Ratio
                        </span>
                      </div>
                      <span className="text-xs text-red-500 font-medium">
                        ▼
                      </span>
                    </div>
                    <div className="text-2xl font-semibold text-red-600 mb-1">
                      {MarketBreadth?.advance_decline_ratio || 0}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      ratio
                    </div>
                  </div>
                </div>
              </section>
              <TopSectors sectors={data?.sector_performance} />
              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      Final Conclusion
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 border-l-4 border-blue-500 pl-4 md:pl-5">
                  {conclusionView.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-7 text-gray-700"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {conclusionView.disclaimer && (
                  <p className="mt-5 rounded-md bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
                    {conclusionView.disclaimer}
                  </p>
                )}
              </section>

              <div className="w-full max-w-6xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">
                  About Author
                </h1>
                <div className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-700 text-2xl font-bold">
                        JC
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Jose C S
                      </h2>
                      <p className="text-md text-gray-700 mb-4">
                        Founder, CEO MoneyGreeks
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Jose is a technical analyst, market researcher, educator
                        and trader with 5+ years of experience. He is an expert
                        in the area of patterns, price and time analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Sponsored
                </h3>
                <span className="text-xs text-gray-400">Ad</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center">
                <iframe
                  title="Ad Placeholder 300x250"
                  className="w-[300px] h-[250px]"
                  srcDoc={`
          <html>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;">
              <div style="text-align:center;color:#6b7280;">
                <strong>300 × 250</strong><br/>
                Google Ad Placeholder
              </div>
            </body>
          </html>
        `}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Sponsored
                </h3>
                <span className="text-xs text-gray-400">Ad</span>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center">
                <iframe
                  title="Ad Placeholder 300x600"
                  className="w-[300px] h-[600px]"
                  srcDoc={`
          <html>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f3f4f6;font-family:sans-serif;">
              <div style="text-align:center;color:#6b7280;">
                <strong>300 × 600</strong><br/>
                Google Ad Placeholder
              </div>
            </body>
          </html>
        `}
                />
              </div>
            </div>

            {/* Info / FAQ Section (unchanged) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Pre-Market Insights
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "What are the key global market cues for today?",
                    a: "Global markets are showing mixed signals. US indices closed with volatility, while Asian markets are trading cautiously, suggesting a muted to slightly positive opening.",
                  },
                  {
                    q: "How is the Indian market expected to open?",
                    a: "Pre-market indicators suggest a marginal gap-up opening, though early volatility is expected during the first 30 minutes of trade.",
                  },
                  {
                    q: "What does the pre-market index data indicate?",
                    a: "Index movements indicate strong price action compared to previous closes. These levels are indicative and may adjust after market open.",
                  },
                  {
                    q: "What is the trend in institutional money flow?",
                    a: "Institutional data shows higher selling activity compared to buying, indicating cautious participation from FIIs and DIIs.",
                  },
                  {
                    q: "Which stocks are in focus today?",
                    a: "Stocks with significant pre-market price changes and higher volumes are expected to remain active during intraday trade.",
                  },
                  {
                    q: "What does the market breadth suggest?",
                    a: "The advance-decline ratio indicates a balanced market, suggesting selective stock-specific action rather than broad-based movement.",
                  },
                  {
                    q: "Which sectors are showing early strength?",
                    a: "Select sectors are showing strong pre-market momentum, indicating potential sector rotation during the trading session.",
                  },
                  {
                    q: "What should be the trading approach for today?",
                    a: "Traders are advised to focus on price action, respect key levels, and manage risk carefully due to expected volatility.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">
                        {item.q}
                      </span>
                      <span className="text-gray-400">+</span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <RecommendedPosts />
      </div>
    </div>
  );
}
