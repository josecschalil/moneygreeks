import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// ─── Demo / Fallback Data ────────────────────────────────────────────────────

const demoPremarket = [
  {
    id: 101,
    title: "Opening Gap Analysis: Global Spillovers",
    slug: "opening-gap-analysis-global-spillovers",
    report_date: "2026-06-04",
    overall_conclusion:
      "Identifying key support levels for Nifty 50 as global cues remain mixed. Our analysts provide a technical breakdown ahead of the opening bell, highlighting critical resistance zones and potential breakout points.",
    report_type: "Premarket",
    read_time: 8,
  },
  {
    id: 102,
    title: "Pre-Open Checklist: Key Levels to Watch",
    slug: "pre-open-checklist-key-levels",
    report_date: "2026-06-03",
    overall_conclusion:
      "Index strength remains stock-specific. Prefer clean breakouts with volume confirmation and keep position size light near event risk.",
    report_type: "Premarket",
    read_time: 5,
  },
  {
    id: 103,
    title: "Nifty Bank: Pre-Market Bias and Range",
    slug: "nifty-bank-pre-market-bias-range",
    report_date: "2026-06-02",
    overall_conclusion:
      "Banking index is approaching a key confluence zone. Watch for participation from PSU banks before taking directional bets.",
    report_type: "Premarket",
    read_time: 6,
  },
  {
    id: 104,
    title: "European Market Open: Currency Impacts",
    slug: "european-market-open-currency-impacts",
    report_date: "2026-06-01",
    overall_conclusion:
      "Currency volatility continues to weigh on export-heavy sectors. Watch the DXY and crude oil correlation closely.",
    report_type: "Premarket",
    read_time: 7,
  },
  {
    id: 105,
    title: "Asian Cues and Domestic Triggers",
    slug: "asian-cues-domestic-triggers",
    report_date: "2026-05-30",
    overall_conclusion:
      "Asian markets opened mixed. Domestic triggers include RBI minutes and quarterly earnings from large-cap financials.",
    report_type: "Premarket",
    read_time: 6,
  },
];

const demoPostmarket = [
  {
    id: 201,
    title: "Daily Closing Pulse: SENSEX & NIFTY Analysis",
    slug: "daily-closing-pulse-sensex-nifty",
    report_date: "2026-06-04",
    overall_conclusion:
      "Global indices witnessed a minor pullback as treasury yields hit a 3-month high. Local markets remained resilient with mid-caps showing significant strength in auto and healthcare sectors.",
    report_type: "Post-Market",
    read_time: 10,
  },
  {
    id: 202,
    title: "Sectoral Rotation Post Close: What Moved and Why",
    slug: "sectoral-rotation-post-close",
    report_date: "2026-06-03",
    overall_conclusion:
      "IT and pharma outperformed while metals saw profit booking. FII activity turned net buyers for the second consecutive session.",
    report_type: "Post-Market",
    read_time: 8,
  },
  {
    id: 203,
    title: "Post-Market Wrap: Breadth and Volume Study",
    slug: "post-market-wrap-breadth-volume",
    report_date: "2026-06-02",
    overall_conclusion:
      "Advance-decline ratio favoured bulls at 2:1. Delivery volumes in large caps suggest institutional accumulation near support.",
    report_type: "Post-Market",
    read_time: 7,
  },
  {
    id: 204,
    title: "Closing Bell: Options OI Shift Analysis",
    slug: "closing-bell-options-oi-shift",
    report_date: "2026-06-01",
    overall_conclusion:
      "Call unwinding at 22500 and put writing at 22000 suggest a shift in range. Weekly expiry setup points to a bullish bias.",
    report_type: "Post-Market",
    read_time: 9,
  },
  {
    id: 205,
    title: "End of Day Review: Momentum and Reversal Signals",
    slug: "end-of-day-review-momentum-reversal",
    report_date: "2026-05-30",
    overall_conclusion:
      "Several momentum stocks showed reversal candles at key resistance. Watchlist for tomorrow includes mid-cap IT and select PSU banks.",
    report_type: "Post-Market",
    read_time: 6,
  },
];

const trendingAnalysis = [
  {
    category: "Macro",
    categoryHex: "#ba1a1a",
    date: "Jun 4",
    title: "Interest Rate Trajectory: Fed Signals",
  },
  {
    category: "Sector Watch",
    categoryHex: "#006c47",
    date: "Jun 3",
    title: "IT Sector Rebound: Earnings Surprise",
  },
  {
    category: "Weekly Recap",
    categoryHex: "#041627",
    date: "Jun 2",
    title: "Volatility Index Hits Yearly Lows",
  },
];

const archiveMonths = [
  { label: "June 2026", count: 12, slug: "#" },
  { label: "May 2026", count: 30, slug: "#" },
  { label: "April 2026", count: 28, slug: "#" },
  { label: "March 2026", count: 31, slug: "#" },
  { label: "February 2026", count: 26, slug: "#" },
];

const navLinks = [
  { label: "Market Data", href: "/market-data" },
  { label: "Intelligence Hub", href: "/intelligence-hub" },
  { label: "Reports", href: "/reports" },
  { label: "Community", href: "/community" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  if (parts.length < 3) return dateStr;
  const [year, month, day] = parts.map((p) => parseInt(p, 10));
  if (!year || !month || !day) return dateStr;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[month - 1]} ${day}`;
}

function getTypeIcon(type) {
  if (!type) return "article";
  const t = type.toLowerCase();
  if (t.includes("pre")) return "light_mode";
  if (t.includes("post")) return "dark_mode";
  if (t.includes("weekly")) return "article";
  return "article";
}

function getTypeColor(type) {
  if (!type) return "#041627";
  const t = type.toLowerCase();
  if (t.includes("pre")) return "#006c47";
  return "#041627";
}

function truncateText(text, length = 110) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

// Fill array to minCount using demo items, avoiding id duplicates
function fillWithDemo(liveData, demoData, minCount) {
  const result = [...liveData];
  const existingIds = new Set(result.map((r) => r.id));
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

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Market Reports | MarketInsight",
  description:
    "Institutional-grade daily analysis covering pre-market and post-market movements, macroeconomic catalysts and sector intelligence.",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ReportsPage({ searchParams }) {
  // Await searchParams for standard compatibility with Next.js 15
  const params = await searchParams;
  const query = params?.q || "";
  const activeFilter = params?.filter || "All";

  // Fetch both endpoints in parallel; fallback to empty so fillWithDemo takes over
  const [rawPremarket, rawPostmarket, rawNews] = await Promise.all([
    fetchJson("/report-list/", []),
    fetchJson("/post-market-list/", []),
    fetchJson("/blog-post/", []),
  ]);

  // Separate fetched data by type
  const livePremarket = rawPremarket.filter(
    (r) => !(r.report_type || "").toLowerCase().includes("post"),
  );
  // Post-market endpoint strictly returns post-market items.
  // We ensure they have a report_type property so frontend logic works seamlessly.
  const livePostmarket = rawPostmarket.map((r) => ({
    ...r,
    report_type: r.report_type || "Post-Market",
  }));

  // Trending news
  const liveNews = rawNews.filter((p) => p.category !== "education");
  const latestNews = liveNews.slice(0, 3).map((news) => ({
    category: news.category || "News",
    categoryHex: "#ba1a1a",
    date: formatDate(news.created_at),
    title: news.title,
    slug: news.slug,
  }));
  const displayTrending = latestNews.length > 0 ? latestNews : trendingAnalysis;

  // Fill up to 10 each with demo data
  const premarketList = fillWithDemo(livePremarket, demoPremarket, 10);
  const postmarketList = fillWithDemo(livePostmarket, demoPostmarket, 10);

  // Combine and SORT all data by newest date
  const fullList = [...premarketList, ...postmarketList].sort(
    (a, b) => new Date(b.report_date) - new Date(a.report_date),
  );

  // Extract featured slots
  const featuredPremarket =
    fullList.find(
      (r) => !(r.report_type || "").toLowerCase().includes("post"),
    ) || premarketList[0];
  const featuredPostmarket =
    fullList.find((r) =>
      (r.report_type || "").toLowerCase().includes("post"),
    ) || postmarketList[0];

  // Apply Searching & Filtering logic for the main grid
  let gridData = fullList;
  const isFiltering = query !== "" || activeFilter !== "All";

  if (isFiltering) {
    if (query) {
      const lowerQ = query.toLowerCase();
      gridData = gridData.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(lowerQ)) ||
          (r.overall_conclusion &&
            r.overall_conclusion.toLowerCase().includes(lowerQ)) ||
          (r.report_type && r.report_type.toLowerCase().includes(lowerQ)),
      );
    }
    if (activeFilter !== "All") {
      gridData = gridData.filter((r) => {
        const t = (r.report_type || "").toLowerCase();
        if (activeFilter === "Premarket")
          return !t.includes("post") && !t.includes("weekly");
        if (activeFilter === "Post-Market") return t.includes("post");
        if (activeFilter === "Weekly") return t.includes("weekly");
        return true;
      });
    }
  } else {
    // Default view: exclude featured items so they don't duplicate
    gridData = fullList.filter(
      (r) => r.id !== featuredPremarket.id && r.id !== featuredPostmarket.id,
    );
  }

  // Limit grid results when not filtering to keep layout clean
  const displayCards = gridData.slice(0, isFiltering ? 20 : 6);

  // Calculate dynamic archives from the REST of the gridData
  const restData = gridData.slice(6);
  const archiveMap = {};
  restData.forEach((item) => {
    if (!item.report_date) return;
    const d = new Date(item.report_date);
    if (isNaN(d.getTime())) return;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    archiveMap[key] = (archiveMap[key] || 0) + 1;
  });
  const dynamicArchives = Object.keys(archiveMap).map((key) => ({
    label: key,
    count: archiveMap[key],
    slug: `/blog?filter=All&q=${encodeURIComponent(key)}`,
  }));
  const displayArchives =
    dynamicArchives.length > 0 ? dynamicArchives : archiveMonths;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#f7f9fb", color: "#191c1e" }}
    >
      <style>{`
        .report-card {
          background-color: #ffffff;
          border: 1px solid #c4c6cd;
          padding: 20px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          height: 100%;
          justify-content: space-between;
          transition: border-color 0.2s;
          text-decoration: none;
        }
        .report-card:hover { border-color: #041627; }
        .nav-link-hover:hover { color: #041627; }
        .read-link:hover { opacity: 0.7; }
        .trending-item:hover h4 { text-decoration: underline; }
        .archive-link:hover span:first-child { text-decoration: underline; }
        .footer-link:hover { color: #041627; }
        .filter-btn:hover { color: #041627; }

        .report-card {
    background-color: #ffffff;
    border: 1px solid #c4c6cd;
    padding: 20px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 100%;
    justify-content: space-between;
    transition: border-color 0.2s;
    text-decoration: none;
  }

  .report-card:hover { border-color: #041627; }
  .nav-link-hover:hover { color: #041627; }
  .read-link:hover { opacity: 0.7; }
  .trending-item:hover h4 { text-decoration: underline; }
  .archive-link:hover span:first-child { text-decoration: underline; }
  .footer-link:hover { color: #041627; }
  .filter-btn:hover { color: #041627; }

  .page-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 64px;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 5fr 4fr 3fr;
    gap: 28px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 40px;
  }

  .reports-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    align-items: stretch;
  }

  @media (max-width: 1024px) {
    .page-container {
      padding: 32px;
    }

    .hero-grid {
      grid-template-columns: 1fr;
    }

    .content-grid {
      grid-template-columns: 1fr;
    }

    .reports-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 24px 16px;
    }

    .reports-grid {
      grid-template-columns: 1fr;
    }

    .filter-group {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .mobile-center {
      text-align: center;
    }

    .mobile-stack {
      border-right: none !important;
      border-bottom: 1px solid #c4c6cd;
      padding-right: 0 !important;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }

    .mobile-sidebar {
      border-left: none !important;
      border-top: 1px solid #c4c6cd;
      padding-left: 0 !important;
      padding-top: 24px;
    }
  }
      `}</style>

      <div className="page-container">
        {/* ── Page Header ── */}
        <section
          style={{
            marginBottom: 40,
            borderBottom: "4px solid #041627",
            paddingBottom: 20,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: "clamp(28px, 6vw, 40px)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#041627",
              marginBottom: 12,
              lineHeight: 1.1,
            }}
          >
            Market Reports
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              fontSize: 15,
              color: "#44474c",
              maxWidth: 680,
              margin: "0 auto",
              fontStyle: "italic",
              lineHeight: 1.65,
            }}
          >
            Institutional-grade daily analysis covering pre-market setups,
            post-market reviews, and macroeconomic catalysts for sophisticated
            investors.
          </p>
        </section>

        {/* ── Search & Filter ── */}
        <section
          style={{
            marginBottom: 40,
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "center",
            borderBottom: "1px solid #c4c6cd",
            paddingBottom: 20,
          }}
        >
          <form
            method="GET"
            style={{ position: "relative", flex: 1, minWidth: 220, margin: 0 }}
          >
            {/* Preserve current filter during searches */}
            <input type="hidden" name="filter" value={activeFilter} />
            <button
              type="submit"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                display: "flex",
                cursor: "pointer",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#74777d", fontSize: 18 }}
              >
                search
              </span>
            </button>
            <input
              name="q"
              defaultValue={query}
              style={{
                width: "100%",
                paddingLeft: 42,
                paddingRight: 14,
                paddingTop: 10,
                paddingBottom: 10,
                border: "none",
                backgroundColor: "#f2f4f6",
                borderRadius: 2,
                fontFamily: "'Source Serif 4', serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "#191c1e",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Search reports by keyword, symbol, or date..."
              type="text"
            />
          </form>

          <div style={{ display: "flex", gap: 20 }}>
            {["All", "Premarket", "Post-Market", "Weekly"].map((f) => {
              const isActive = activeFilter === f;
              return (
                <Link
                  key={f}
                  href={`?filter=${f}${query ? `&q=${query}` : ""}`}
                  className="filter-btn"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isActive ? "#041627" : "#44474c",
                    paddingBottom: 3,
                    borderBottom: isActive
                      ? "2px solid #041627"
                      : "2px solid transparent",
                  }}
                >
                  {f}
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Editorial Hero: Premarket | Postmarket | Trending ── */}
        <section
          style={{
            marginBottom: 40,
            borderBottom: "1px solid #c4c6cd",
            paddingBottom: 40,
          }}
        >
          <div className="hero-grid">
            {/* Col 1 — Featured Premarket */}
            <div
              className="mobile-stack"
              style={{
                borderRight: "1px solid #c4c6cd",
                paddingRight: 28,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  borderBottom: "1px solid #c4c6cd",
                  paddingBottom: 8,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: "#006c47" }}
                >
                  light_mode
                </span>
                <span
                  style={{
                    color: "#006c47",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Premarket Analysis
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#74777d",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 11,
                  }}
                >
                  {formatDate(featuredPremarket.report_date)}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(22px, 5vw, 34px)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "#041627",
                  marginBottom: 14,
                }}
              >
                {featuredPremarket.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 15,
                  color: "#44474c",
                  lineHeight: 1.7,
                  marginBottom: 20,
                  flex: 1,
                }}
              >
                {truncateText(featuredPremarket.overall_conclusion, 160)}
              </p>
              <Link
                href={`/market-data/${featuredPremarket.slug}`}
                className="read-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#041627",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Read Full Analysis
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 17 }}
                >
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Col 2 — Featured Post-Market */}
            <div
              className="mobile-stack"
              style={{
                borderRight: "1px solid #c4c6cd",
                paddingRight: 28,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  borderBottom: "1px solid #c4c6cd",
                  paddingBottom: 8,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: "#041627" }}
                >
                  dark_mode
                </span>
                <span
                  style={{
                    color: "#041627",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Post-Market Analysis
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#74777d",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: 11,
                  }}
                >
                  {formatDate(featuredPostmarket.report_date)}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: "clamp(22px, 5vw, 34px)",
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: "#041627",
                  marginBottom: 14,
                }}
              >
                {featuredPostmarket.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 14,
                  color: "#44474c",
                  lineHeight: 1.7,
                  marginBottom: 20,
                  flex: 1,
                }}
              >
                {truncateText(featuredPostmarket.overall_conclusion, 160)}
              </p>
              <Link
                href={`/post-market/${featuredPostmarket.slug}`}
                className="read-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#041627",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Read Full Analysis
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 17 }}
                >
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Col 3 — Trending */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 16,
                  color: "#041627",
                  marginBottom: 20,
                  borderBottom: "1px solid #c4c6cd",
                  paddingBottom: 8,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Trending Analysis
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {displayTrending.map((item, i) => (
                  <div
                    key={item.slug || item.title}
                    className="trending-item"
                    style={{
                      cursor: "pointer",
                      borderTop: i > 0 ? "1px solid #c4c6cd" : "none",
                      paddingTop: i > 0 ? 14 : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: item.categoryHex,
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ color: "#74777d", fontSize: 11 }}>•</span>
                      <span
                        style={{
                          color: "#74777d",
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontSize: 11,
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                    {item.slug ? (
                      <Link
                        href={`/news-today/${item.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: 15,
                            color: "#041627",
                            lineHeight: 1.35,
                          }}
                        >
                          {item.title}
                        </h4>
                      </Link>
                    ) : (
                      <h4
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontSize: 15,
                          color: "#041627",
                          lineHeight: 1.35,
                        }}
                      >
                        {item.title}
                      </h4>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Recent Dispatches + Sidebar ── */}
        <section className="content-grid">
          {/* Cards Grid */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
                borderBottom: "2px solid #041627",
                paddingBottom: 7,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 20,
                  color: "#041627",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {isFiltering ? "Search Results" : "Recent Dispatches"}
              </h3>
              <Link
                href="/pre-market-archive"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  color: "#041627",
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                All Reports
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14 }}
                >
                  north_east
                </span>
              </Link>
            </div>

            {displayCards.length > 0 ? (
              <div className="reports-grid">
                {displayCards.map((report) => {
                  const typeColor = getTypeColor(report.report_type);
                  const typeIcon = getTypeIcon(report.report_type);
                  return (
                    <Link
                      key={report.id}
                      href={
                        report.report_type.toLowerCase().includes("post")
                          ? `/post-market/${report.slug}`
                          : `/market-data/${report.slug}`
                      }
                      className="report-card"
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              backgroundColor: "#eceef0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 14, color: typeColor }}
                            >
                              {typeIcon}
                            </span>
                          </div>
                          <span
                            style={{
                              fontFamily: "'Hanken Grotesk', sans-serif",
                              fontSize: 11,
                              color: "#74777d",
                            }}
                          >
                            {formatDate(report.report_date)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: typeColor,
                            marginBottom: 7,
                          }}
                        >
                          {report.report_type || "Premarket"}
                        </div>
                        <h5
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: 16,
                            color: "#041627",
                            lineHeight: 1.3,
                            marginBottom: 10,
                          }}
                        >
                          {report.title}
                        </h5>

                        <p
                          style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: 13,
                            color: "#44474c",
                            lineHeight: 1.5,
                            marginBottom: 16,
                          }}
                        >
                          {truncateText(report.overall_conclusion, 100)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: "#74777d",
                          marginTop: "auto",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Hanken Grotesk', sans-serif",
                            fontSize: 11,
                          }}
                        >
                          {report.read_time
                            ? `${report.read_time} min read`
                            : "5 min read"}
                        </span>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18, color: "#041627" }}
                        >
                          arrow_forward
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "60px 0",
                  textAlign: "center",
                  color: "#74777d",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32, marginBottom: 10 }}
                >
                  search_off
                </span>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: 16,
                  }}
                >
                  No reports matched your search criteria.
                </p>
              </div>
            )}
          </div>

          {/* Archive Sidebar */}
          <aside
            className="mobile-sidebar"
            style={{
              borderLeft: "1px solid #c4c6cd",
              paddingLeft: 28,
            }}
          >
            <h3
              style={{
                fontFamily: "'Source Serif 4', serif",
                fontSize: 16,
                color: "#041627",
                marginBottom: 20,
                borderBottom: "1px solid #c4c6cd",
                paddingBottom: 8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Archives
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {displayArchives.map((month) => (
                <li
                  key={month.label}
                  style={{
                    borderBottom: "1px solid #c4c6cd",
                    paddingBottom: 8,
                    marginBottom: 10,
                  }}
                >
                  <Link
                    href={month.slug}
                    className="archive-link"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#191c1e",
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: 15,
                    }}
                  >
                    <span>{month.label}</span>
                    <span
                      style={{
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        fontSize: 11,
                        color: "#74777d",
                      }}
                    >
                      {month.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/pre-market-archive"
              style={{
                marginTop: 20,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                color: "#041627",
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Search Full Archive
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14 }}
              >
                search
              </span>
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}
