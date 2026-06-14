import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Mock Post-Market Report Data ────────────────────────────────────────────
// Replace this with a real API fetch when your backend endpoint is ready.

const MOCK_REPORT = {
  title: "Post-Market Wrap: Nifty Holds 24,500 as IT Leads Recovery",
  date: "2026-06-12",
  analyst: "Jose C S",
  analystDesignation: "Founder & Head Analyst, MoneyGreeks",
  report_type: "Post-Market",

  // ── 1. Market Summary
  marketSummary: {
    indices: [
      { name: "Nifty 50",         close: 24521.35, change: 148.20,  changePct: 0.61,  direction: "up" },
      { name: "Sensex",           close: 80684.45, change: 497.30,  changePct: 0.62,  direction: "up" },
      { name: "Bank Nifty",       close: 52318.70, change: -112.55, changePct: -0.22, direction: "down" },
      { name: "Nifty Midcap 100", close: 57843.20, change: 320.45,  changePct: 0.56,  direction: "up" },
      { name: "Nifty Smallcap 100", close: 18921.30, change: 89.75, changePct: 0.48,  direction: "up" },
      { name: "India VIX",        close: 13.42,    change: -0.38,   changePct: -2.75, direction: "down" },
    ],
    breadth: {
      advances: 1847,
      declines: 894,
      unchanged: 121,
      ratio: "2.07:1",
      sentiment: "Bullish",
    },
  },

  // ── 2. Top Movers
  topGainers: [
    { symbol: "INFY",    name: "Infosys",              price: 1634.50, change: 3.82 },
    { symbol: "TCS",     name: "Tata Consultancy",     price: 3512.20, change: 2.91 },
    { symbol: "WIPRO",   name: "Wipro",                price: 482.35,  change: 2.47 },
    { symbol: "SUNPHARMA", name: "Sun Pharma",         price: 1788.90, change: 2.15 },
    { symbol: "HCLTECH", name: "HCL Technologies",     price: 1642.10, change: 1.98 },
  ],
  topLosers: [
    { symbol: "BAJFINANCE", name: "Bajaj Finance",     price: 6821.30, change: -2.34 },
    { symbol: "AXISBANK",   name: "Axis Bank",         price: 1089.45, change: -1.87 },
    { symbol: "KOTAKBANK",  name: "Kotak Bank",        price: 1724.80, change: -1.43 },
    { symbol: "TATAMOTORS", name: "Tata Motors",       price: 944.20,  change: -1.21 },
    { symbol: "ICICIBANK",  name: "ICICI Bank",        price: 1318.70, change: -0.88 },
  ],
  volumeShockers: [
    { symbol: "ZOMATO",   name: "Zomato",           volume: "4.2x", remark: "Breakout candle on high delivery" },
    { symbol: "IRCTC",    name: "IRCTC",            volume: "3.8x", remark: "Accumulation near weekly support" },
    { symbol: "ADANIPORTS", name: "Adani Ports",    volume: "3.1x", remark: "Institutional block deal detected" },
  ],
  circuitStocks: {
    upperCircuit: ["RAILTEL", "RITES", "MAZDOCK", "COCHINSHIP"],
    lowerCircuit: ["YESBANK", "PCJEWELLER", "SUZLON"],
  },

  // ── 3. FII / DII Activity
  fiidii: {
    fii: { buy: 14823.42, sell: 12104.67, net: 2718.75, activity: "Net Buyers" },
    dii: { buy: 8932.10,  sell: 10218.45, net: -1286.35, activity: "Net Sellers" },
    note: "FII turned net buyers for the 3rd consecutive session. Provisional data from NSE.",
    derivativesNote: "FII net long in index futures: ₹1,842 Cr. Increase in long positions suggests cautious optimism.",
  },

  // ── 4. Sectoral Roundup
  sectors: [
    { name: "Nifty IT",         change: 2.34,  direction: "up",   leader: "INFY (+3.8%)" },
    { name: "Nifty Pharma",     change: 1.41,  direction: "up",   leader: "SUNPHARMA (+2.1%)" },
    { name: "Nifty FMCG",       change: 0.73,  direction: "up",   leader: "HINDUNILVR (+1.2%)" },
    { name: "Nifty Realty",     change: 0.62,  direction: "up",   leader: "DLF (+1.4%)" },
    { name: "Nifty Energy",     change: 0.18,  direction: "up",   leader: "RELIANCE (+0.4%)" },
    { name: "Nifty Auto",       change: -0.12, direction: "down", leader: "TATAMOTORS (-1.2%)" },
    { name: "Nifty Metal",      change: -0.55, direction: "down", leader: "TATASTEEL (-1.8%)" },
    { name: "Nifty PSU Bank",   change: -0.88, direction: "down", leader: "PNB (-2.1%)" },
    { name: "Nifty Bank",       change: -0.22, direction: "down", leader: "AXISBANK (-1.9%)" },
    { name: "Nifty Media",      change: 0.31,  direction: "up",   leader: "PVRINOX (+0.9%)" },
    { name: "Nifty Infra",      change: -0.19, direction: "down", leader: "L&T (-0.7%)" },
    { name: "Nifty Healthcare", change: 1.28,  direction: "up",   leader: "APOLLOHOSP (+2.3%)" },
  ],

  // ── 5. F&O Pulse
  fo: {
    nifty: {
      spot:        24521.35,
      futuresClose: 24538.10,
      basis:       16.75,
      pcr:         1.18,
      maxPain:     24500,
      ivPercentile: "34th",
    },
    bankNifty: {
      spot:        52318.70,
      futuresClose: 52344.20,
      basis:       25.50,
      pcr:         0.94,
      maxPain:     52000,
      ivPercentile: "41st",
    },
    oiActivity: [
      { strike: "24600 CE", oi: "High Call OI",      interpretation: "Strong resistance zone" },
      { strike: "24400 PE", oi: "Fresh Put Writing",  interpretation: "Support building near 24,400" },
      { strike: "24500 CE", oi: "Call Unwinding",     interpretation: "Bears losing grip at 24,500" },
    ],
    activeOptions: [
      { instrument: "NIFTY 24500 CE", volume: "18.4L", oi: "42.1L" },
      { instrument: "NIFTY 24400 PE", volume: "14.2L", oi: "38.7L" },
      { instrument: "BANKNIFTY 52500 CE", volume: "9.8L", oi: "22.3L" },
    ],
  },

  // ── 6. Global Markets
  global: {
    us: [
      { name: "Dow Jones",  value: "42,841",  change: 0.34, direction: "up" },
      { name: "S&P 500",    value: "5,921",   change: 0.52, direction: "up" },
      { name: "Nasdaq",     value: "19,340",  change: 0.81, direction: "up" },
    ],
    asia: [
      { name: "Nikkei 225", value: "38,648",  change: -0.21, direction: "down" },
      { name: "Hang Seng",  value: "18,431",  change: 0.67,  direction: "up" },
      { name: "SGX Nifty",  value: "24,548",  change: 0.18,  direction: "up" },
      { name: "Shanghai",   value: "3,362",   change: -0.14, direction: "down" },
    ],
    commodities: [
      { name: "Crude Oil (Brent)", value: "$82.40", change: 0.31,  direction: "up" },
      { name: "Gold (MCX)",        value: "₹73,240", change: -0.18, direction: "down" },
      { name: "Silver (MCX)",      value: "₹91,820", change: 0.22,  direction: "up" },
      { name: "USD/INR",           value: "83.42",  change: -0.08, direction: "down" },
    ],
  },

  // ── 7. Corporate Actions & Analyst Calls
  corporateActions: [
    { event: "Results", company: "TCS Q1FY27",      detail: "Revenue ₹63,437 Cr, up 4.4% YoY. PAT ₹12,760 Cr." },
    { event: "Dividend", company: "HINDUNILVR",      detail: "₹19/share declared. Ex-date: June 18." },
    { event: "Board Meeting", company: "RELIANCE",   detail: "June 14 — AGM agenda includes new energy updates." },
    { event: "Buyback", company: "WIPRO",            detail: "₹11,000 Cr buyback approved at ₹530/share." },
  ],
  analystCalls: [
    { broker: "Morgan Stanley", stock: "INFY",       action: "Upgrade", target: "₹1,820", prev: "Neutral → Overweight" },
    { broker: "Kotak Securities", stock: "BAJFINANCE", action: "Downgrade", target: "₹6,500", prev: "Buy → Reduce" },
    { broker: "Nomura", stock: "HDFCBANK",          action: "Buy",     target: "₹1,980", prev: "Maintained" },
  ],

  // ── 8. Technical Outlook for Tomorrow
  technical: {
    nifty: {
      bias: "Bullish",
      support: ["24,400", "24,280", "24,150"],
      resistance: ["24,600", "24,720", "24,880"],
      pattern: "Bullish engulfing candle formed on daily chart. RSI at 58 — room to move higher. MACD signal line crossover on 15-min chart.",
    },
    bankNifty: {
      bias: "Neutral",
      support: ["52,000", "51,750", "51,400"],
      resistance: ["52,500", "52,800", "53,200"],
      pattern: "Range-bound near 52,000–52,500. Watch for breakout on either side with volume. Bearish divergence on hourly RSI.",
    },
    watchlist: [
      { symbol: "INFY",      setup: "Breakout above ₹1,640 with volume. Target ₹1,700." },
      { symbol: "SUNPHARMA", setup: "Continuation trade above ₹1,800. Stop at ₹1,760." },
      { symbol: "DLF",       setup: "Accumulation zone — watch ₹880 for fresh entry." },
      { symbol: "ZOMATO",    setup: "High volume breakout — potential swing trade to ₹235." },
    ],
    conclusion: "Market structure improved today with IT and Pharma leading the charge. VIX cooling down is positive for bulls. Bank Nifty remains the wildcard — watch ICICI and HDFC Bank for directional cues. Traders should stay selective and not over-leverage heading into next week's derivatives expiry.",
  },

  // ── 9. Quick Snapshot
  quickSnapshot: [
    { label: "Market Bias", value: "Bullish", color: "text-green-600" },
    { label: "VIX", value: "13.42 (Cooling)", color: "text-green-600" },
    { label: "Nifty PCR", value: "1.18 (Bullish)", color: "text-green-600" },
    { label: "FII Flow", value: "Net Buyers", color: "text-green-600" },
    { label: "Bank Nifty", value: "Neutral", color: "text-yellow-600" },
    { label: "Breadth", value: "2.07:1 (Strong)", color: "text-green-600" }
  ]
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ChangeChip({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isUp = value > 0;
  const isDown = value < 0;
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold";
  const color = isUp ? "bg-green-50 text-green-700" : isDown ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-500";
  const sign = isUp ? "+" : "";
  return (
    <span className={`${base} ${color}`}>
      {isUp ? <TrendingUp size={11} /> : isDown ? <TrendingDown size={11} /> : <Minus size={11} />}
      {sign}{value.toFixed(2)}{suffix}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider font-serif">{children}</h2>
      <div className="flex-1 h-px bg-gray-100"></div>
    </div>
  );
}

// ─── Metadata ────────────────────────────────────────────────────────────────

async function getPostMarketReport(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/post-market-list/${slug}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getPostMarketReport(slug);
  
  if (!report) return { title: "Post-Market Report | MoneyGreeks" };

  const metaTitle = report.meta_title || `${report.title} | MoneyGreeks`;
  const metaDescription = report.meta_description || report.overall_conclusion || report.report_data?.technical?.conclusion || "Daily Post-Market Analysis";
  const metaKeywords = report.meta_keywords ? report.meta_keywords.split(',').map((k: string) => k.trim()) : [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      publishedTime: report.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function PostMarketReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const backendReport = await getPostMarketReport(slug);

  if (!backendReport) {
    notFound();
  }

  // Use backend structured data, but fallback to MOCK_REPORT if any section is missing for safety
  const report_data = backendReport.report_data || MOCK_REPORT;

  const { marketSummary, topGainers, topLosers, volumeShockers, circuitStocks,
          fiidii, sectors, fo, global: globalMkts, corporateActions, analystCalls, technical, quickSnapshot } = report_data;


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": backendReport.title,
    "datePublished": backendReport.report_date,
    "author": [{
        "@type": "Person",
        "name": backendReport.analyst || "Jose C S",
    }],
    "publisher": {
      "@type": "Organization",
      "name": "MoneyGreeks",
    },
    "description": backendReport.meta_description || backendReport.overall_conclusion || ""
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-full h-1 bg-gray-900"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Reports
          </Link>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded mb-4">
              Post-Market Report
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 font-serif leading-tight mb-4">
              {backendReport.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{backendReport.analyst}</span>
              <span className="text-gray-300">·</span>
              <span>{backendReport.analyst_designation}</span>
              <span className="text-gray-300">·</span>
              <span>{new Date(backendReport.report_date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column (main) */}
          <div className="xl:col-span-2 space-y-6">

            {/* ── 1. Market Summary ─────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>1 · Market Summary</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {marketSummary.indices.map((idx: any) => (
                  <div key={idx.name} className={`rounded-xl p-4 border ${idx.direction === "up" ? "border-green-100 bg-green-50/40" : "border-red-100 bg-red-50/40"}`}>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{idx.name}</p>
                    <p className="text-xl font-black text-gray-900">{idx.close.toLocaleString("en-IN")}</p>
                    <div className="mt-1">
                      <ChangeChip value={idx.changePct} />
                      <span className={`text-xs ml-1 font-semibold ${idx.direction === "up" ? "text-green-600" : "text-red-600"}`}>
                        ({idx.change > 0 ? "+" : ""}{idx.change.toFixed(2)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Market Breadth */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Market Breadth</p>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">▲ {marketSummary.breadth.advances} Advances</span>
                    <span className="font-bold text-red-600">▼ {marketSummary.breadth.declines} Declines</span>
                    <span className="font-bold text-gray-400">— {marketSummary.breadth.unchanged} Unchanged</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">A/D Ratio</p>
                  <p className="font-black text-gray-900">{marketSummary.breadth.ratio}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${marketSummary.breadth.sentiment === "Bullish" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {marketSummary.breadth.sentiment}
                  </span>
                </div>
              </div>
            </section>

            {/* ── 2. Top Movers ─────────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>2 · Top Movers</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">Top Gainers</p>
                  <div className="space-y-2">
                    {topGainers.map((s: any) => (
                      <div key={s.symbol} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{s.symbol}</span>
                          <span className="text-gray-400 text-xs ml-2">{s.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹{s.price}</p>
                          <ChangeChip value={s.change} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Top Losers</p>
                  <div className="space-y-2">
                    {topLosers.map((s: any) => (
                      <div key={s.symbol} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{s.symbol}</span>
                          <span className="text-gray-400 text-xs ml-2">{s.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹{s.price}</p>
                          <ChangeChip value={s.change} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Shockers */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">⚡ Volume Shockers</p>
                <div className="space-y-2">
                  {volumeShockers.map((s: any) => (
                    <div key={s.symbol} className="flex items-center gap-3">
                      <span className="font-black text-gray-900 text-sm w-24">{s.symbol}</span>
                      <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">{s.volume} avg vol</span>
                      <span className="text-gray-500 text-xs">{s.remark}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circuit Stocks */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">Upper Circuit</p>
                  <div className="flex flex-wrap gap-1">
                    {circuitStocks.upperCircuit.map((s: any) => <span key={s} className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">{s}</span>)}
                  </div>
                </div>
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-2">Lower Circuit</p>
                  <div className="flex flex-wrap gap-1">
                    {circuitStocks.lowerCircuit.map((s: any) => <span key={s} className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded">{s}</span>)}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. FII / DII ──────────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>3 · FII / DII Activity</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "FII (Foreign Institutions)", data: fiidii.fii, color: "blue" },
                  { label: "DII (Domestic Institutions)", data: fiidii.dii, color: "purple" },
                ].map(({ label, data, color }) => (
                  <div key={label} className={`rounded-xl p-4 border ${color === "blue" ? "border-blue-100 bg-blue-50/30" : "border-purple-100 bg-purple-50/30"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${color === "blue" ? "text-blue-600" : "text-purple-600"}`}>{label}</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Buy</p>
                        <p className="font-bold text-green-600 text-sm">₹{data.buy.toLocaleString("en-IN")} Cr</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Sell</p>
                        <p className="font-bold text-red-500 text-sm">₹{data.sell.toLocaleString("en-IN")} Cr</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase">Net</p>
                        <p className={`font-black text-sm ${data.net > 0 ? "text-green-700" : "text-red-600"}`}>
                          {data.net > 0 ? "+" : ""}₹{Math.abs(data.net).toLocaleString("en-IN")} Cr
                        </p>
                      </div>
                    </div>
                    <p className={`mt-2 text-xs font-bold text-center ${data.net > 0 ? "text-green-600" : "text-red-500"}`}>{data.activity}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">{fiidii.note}</p>
              <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-3">{fiidii.derivativesNote}</p>
            </section>

            {/* ── 4. Sectoral Roundup ───────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>4 · Sectoral Roundup</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sectors.sort((a: any, b: any) => b.change - a.change).map((sec: any) => (
                  <div key={sec.name} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{sec.name}</p>
                      <p className="text-[11px] text-gray-400">{sec.leader}</p>
                    </div>
                    <ChangeChip value={sec.change} />
                  </div>
                ))}
              </div>
            </section>

            {/* ── 5. F&O Pulse ──────────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>5 · F&O Pulse</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Nifty 50", data: fo.nifty },
                  { label: "Bank Nifty", data: fo.bankNifty },
                ].map(({ label, data }: any) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{label} Derivatives</p>
                    <div className="grid grid-cols-3 gap-y-3 text-sm">
                      {[
                        { k: "Spot Close", v: data.spot.toLocaleString("en-IN") },
                        { k: "Futures", v: data.futuresClose.toLocaleString("en-IN") },
                        { k: "Basis", v: `+${data.basis}` },
                        { k: "PCR", v: data.pcr },
                        { k: "Max Pain", v: data.maxPain.toLocaleString("en-IN") },
                        { k: "IV Percentile", v: data.ivPercentile },
                      ].map(({ k, v }: any) => (
                        <div key={k}>
                          <p className="text-[10px] text-gray-400 uppercase">{k}</p>
                          <p className="font-bold text-gray-900">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* OI Activity */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Open Interest Signals</p>
                <div className="space-y-2">
                  {fo.oiActivity.map((oi: any) => (
                    <div key={oi.strike} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className="bg-gray-900 text-white text-[11px] font-bold px-2 py-0.5 rounded whitespace-nowrap">{oi.strike}</span>
                      <span className="text-xs text-indigo-600 font-semibold">{oi.oi}</span>
                      <span className="text-xs text-gray-500">→ {oi.interpretation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Active Options */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Most Active Options</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-3 py-2 text-[10px] font-bold uppercase text-gray-400">Instrument</th>
                        <th className="px-3 py-2 text-[10px] font-bold uppercase text-gray-400">Volume</th>
                        <th className="px-3 py-2 text-[10px] font-bold uppercase text-gray-400">OI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fo.activeOptions.map((opt: any) => (
                        <tr key={opt.instrument} className="border-b border-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{opt.instrument}</td>
                          <td className="px-3 py-2 text-gray-600">{opt.volume}</td>
                          <td className="px-3 py-2 text-gray-600">{opt.oi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── 7. Corporate Actions & Analyst Calls ─────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>7 · Corporate Actions & Analyst Calls</SectionTitle>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Corporate Actions</p>
                  <div className="space-y-3">
                    {corporateActions.map((ca: any) => (
                      <div key={ca.company} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-[10px] font-black uppercase bg-gray-900 text-white px-2 py-1 rounded h-fit whitespace-nowrap">{ca.event}</span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{ca.company}</p>
                          <p className="text-xs text-gray-500">{ca.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Broker Calls</p>
                  <div className="space-y-3">
                    {analystCalls.map((ac: any) => (
                      <div key={`${ac.broker}-${ac.stock}`} className="py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-gray-900 text-sm">{ac.stock}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ac.action === "Upgrade" ? "bg-green-100 text-green-700" : ac.action === "Downgrade" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"}`}>
                            {ac.action}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{ac.broker} · Target: <span className="font-semibold text-gray-700">{ac.target}</span></p>
                        <p className="text-[11px] text-gray-400">{ac.prev}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 8. Technical Outlook ──────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6">
              <SectionTitle>8 · Technical Outlook for Tomorrow</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Nifty 50", data: technical.nifty },
                  { label: "Bank Nifty", data: technical.bankNifty },
                ].map(({ label, data }: any) => (
                  <div key={label} className={`rounded-xl border p-4 ${data.bias === "Bullish" ? "border-green-100 bg-green-50/30" : data.bias === "Bearish" ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-900">{label}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${data.bias === "Bullish" ? "bg-green-100 text-green-700" : data.bias === "Bearish" ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-600"}`}>
                        {data.bias}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-green-600 mb-1">Support</p>
                        {data.support.map((s: any) => <p key={s} className="text-xs font-semibold text-gray-700">{s}</p>)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-red-500 mb-1">Resistance</p>
                        {data.resistance.map((r: any) => <p key={r} className="text-xs font-semibold text-gray-700">{r}</p>)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{data.pattern}</p>
                  </div>
                ))}
              </div>

              {/* Watchlist for Tomorrow */}
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">📋 Watchlist for Tomorrow</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {technical.watchlist.map((w: any) => (
                    <div key={w.symbol} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-black text-gray-900 text-sm whitespace-nowrap">{w.symbol}</span>
                      <p className="text-xs text-gray-500">{w.setup}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyst Conclusion */}
              <div className="bg-gray-900 text-white rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Analyst Conclusion</p>
                <p className="text-sm leading-relaxed text-gray-200">{technical.conclusion}</p>
                <p className="text-xs text-gray-500 mt-3">— {backendReport.analyst}, {backendReport.analyst_designation}</p>
              </div>
            </section>

          </div>

          {/* ── Right Sidebar ────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* ── 6. Global Markets ─────────────────────────────────── */}
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <SectionTitle>6 · Global Markets</SectionTitle>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">🇺🇸 US Markets (Previous Close)</p>
                  {globalMkts.us.map((m: any) => (
                    <div key={m.name} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 font-medium">{m.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{m.value}</p>
                        <ChangeChip value={m.change} />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">🌏 Asian Markets</p>
                  {globalMkts.asia.map((m: any) => (
                    <div key={m.name} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 font-medium">{m.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{m.value}</p>
                        <ChangeChip value={m.change} />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">🛢️ Commodities & Currency</p>
                  {globalMkts.commodities.map((m: any) => (
                    <div key={m.name} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700 font-medium">{m.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{m.value}</p>
                        <ChangeChip value={m.change} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Summary Card */}
            <section className="bg-gray-900 text-white rounded-2xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Snapshot</p>
              <div className="space-y-3 text-sm">
                {(quickSnapshot || []).map(({ label, value, color }: any) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-400">{label}</span>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Ad Slot */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sponsored</p>
                <span className="text-[10px] border border-gray-200 px-1 rounded text-gray-300">Ad</span>
              </div>
              <div className="flex justify-center bg-gray-50 rounded-lg overflow-hidden">
                <iframe
                  title="Ad 300x250"
                  className="w-[300px] h-[250px]"
                  srcDoc={`<html><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;"><div style="color:#9ca3af;text-align:center;font-size:11px;"><strong>300 × 250</strong><br/>Advertisement</div></body></html>`}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
