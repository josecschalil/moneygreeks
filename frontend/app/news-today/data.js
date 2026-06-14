export const images = {
  hero: "https://unsplash.com/photos/5QgIuuBxKwM/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8ZmluYW5jaWFsJTIwY2hhcnRzfGVufDB8fDB8fA%3D%3D&force=true&w=1920",
  skyscrapers:
    "https://unsplash.com/photos/9wg5jCEPBsw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8c2t5c2NyYXBlcnN8ZW58MHx8MHx8&force=true&w=1920",
  bitcoin:
    "https://unsplash.com/photos/8lnbXtxFGZw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8Yml0Y29pbnxlbnwwfHwwfHw%3D&force=true&w=1920",
  coins:
    "https://unsplash.com/photos/5QgIuuBxKwM/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8ZmluYW5jaWFsJTIwY2hhcnRzfGVufDB8fDB8fA%3D%3D&force=true&w=1920",
  dashboard:
    "https://unsplash.com/photos/7KLa-xLbSXA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8ZGF0YSUyMGRhc2JvYXJkfGVufDB8fDB8fA%3D%3D&force=true&w=1920",
};

export const navItems = [
  "Market Data",
  "Intelligence Hub",
  "Reports",
  "Community",
];

export const marketItems = [
  {
    name: "S&P 500",
    value: "4,450.32",
    change: "-1.24%",
    points: "-55.80",
    trend: "down",
  },
  {
    name: "NASDAQ",
    value: "13,761.50",
    change: "-1.85%",
    points: "-259.20",
    trend: "down",
  },
  {
    name: "DOW JONES",
    value: "34,645.99",
    change: "+0.15%",
    points: "+52.30",
    trend: "up",
  },
  {
    name: "US 10-YR YIELD",
    value: "4.28%",
    change: "+0.05",
    points: "",
    trend: "up",
  },
  {
    name: "US 10-YR YELD",
    value: "4.28%",
    change: "+0.05",
    points: "",
    trend: "up",
  },
];

export const latestArticles = [
  {
    slug: "tech-sector-earnings",
    category: "Equities",
    readTime: "5 min read",
    title: "Tech Sector Earnings Beat Estimates Despite Supply Chain Woes",
    description:
      "Major tech firms report robust quarterly earnings, signaling resilient consumer demand amidst ongoing global supply challenges.",
    image: images.skyscrapers,
    alt: "Modern corporate glass skyscrapers against a blue sky.",
  },
  {
    slug: "institutional-adoption-bitcoin",
    category: "Crypto",
    readTime: "8 min read",
    title: "Institutional Adoption Drives Bitcoin Stabilization",
    description:
      "Analysis reveals a shift in cryptocurrency market dynamics as large-scale institutional investments reduce historical volatility patterns.",
    image: images.bitcoin,
    alt: "Physical Bitcoin coin sitting on a stylized circuit board.",
  },
  {
    slug: "european-markets-trade-tariffs",
    category: "Macro",
    readTime: "6 min read",
    title: "European Markets React to New Trade Tariffs",
    description:
      "Evaluating the immediate economic impact and long-term strategic realignments following the latest cross-border trade policy shifts.",
    image: images.coins,
    alt: "Stacks of coins with a rising line graph overlay.",
  },
];

export const deepDiveArticles = [
  {
    slug: "algorithmic-edge-ai",
    category: "Data Strategy",
    readTime: "12 min read",
    title: "The Algorithmic Edge: How AI is Reshaping Quant Trading",
    description:
      "An in-depth look into the proprietary machine learning models currently dominating high-frequency trading desks and their implications for market liquidity.",
    image: images.dashboard,
    alt: "Data analytics dashboard showing various charts and graphs.",
  },
  {
    slug: "commercial-real-estate-post-hybrid",
    category: "Real Estate",
    readTime: "10 min read",
    title: "Commercial Real Estate in the Post-Hybrid Era",
    description:
      "Examining the structural shifts in urban commercial property valuations as corporations finalize long-term remote work policies.",
    image: images.skyscrapers,
    alt: "Modern residential real estate development.",
  },
];

export const mostRead = [
  {
    title: "Treasury Yields Hit 15-Year High Ahead of Fed Meeting",
    meta: "Macro • 2 hours ago",
  },
  {
    title: "Energy Sector Leads Gains as Oil Prices Rebound",
    meta: "Commodities • 4 hours ago",
  },
  {
    title: "M&A Activity Slows in Q3 Amidst Regulatory Scrutiny",
    meta: "Corporate • 6 hours ago",
  },
];

export const trendingTopics = [
  { tag: "#InterestRates", direction: "arrow_upward", trend: "down" },
  { tag: "#AI", direction: "arrow_upward", trend: "up" },
  { tag: "#OilPrices", direction: "arrow_upward", trend: "down" },
  { tag: "#Eurozone", direction: "arrow_downward", trend: "down" },
  { tag: "#TechEarnings", direction: "arrow_upward", trend: "up" },
];

export const feedItems = [
  {
    time: "10:45:12",
    hot: true,
    title: "Treasury yields tick higher as market digests latest jobs report",
    body: "Bond markets reacted swiftly to stronger-than-expected nonfarm payroll data, pushing the 10-year yield above 4.3%.",
    tags: ["MACRO", "$TNX"],
  },
  {
    time: "10:30:45",
    title: "OPEC+ announces surprise production cut, oil surges",
    body: "Crude futures jump over 5% following the unexpected cartel decision to reduce output by 1M bpd starting next month.",
    tags: ["COMM", "$CL_F"],
  },
  {
    time: "10:15:00",
    title: "Euro slumps against Dollar amid renewed recession fears",
    body: "PMI data points to a deeper contraction in the Eurozone manufacturing sector than previously anticipated.",
    tags: ["FX", "EUR/USD"],
  },
  {
    time: "09:50:22",
    title: "Mega-cap tech stocks rally on upbeat forward guidance",
    body: "Cloud revenue growth across major providers offsets concerns over slowing consumer hardware sales.",
    tags: ["EQTY", "$QQQ"],
  },
  {
    time: "09:30:00",
    title: "US Markets Open: Mixed start to the trading day",
    body: "Dow Jones opens flat, Nasdaq leads early gains on tech strength.",
    tags: ["MKT"],
  },
  {
    time: "09:05:15",
    title: "Gold prices consolidate near record highs",
    body: "Safe-haven demand persists amidst ongoing geopolitical uncertainties in Eastern Europe.",
    tags: ["COMM", "$GC_F"],
  },
  {
    time: "08:45:00",
    title: "Bank of Japan maintains ultra-loose monetary policy",
    body: "Yen weakens further as BOJ bucks the global tightening trend, keeping rates negative.",
    tags: ["CB", "USD/JPY"],
  },
  {
    time: "08:15:30",
    title: "Retail sales miss expectations, raising consumer spending concerns",
    body: "Inflation continues to weigh heavily on household budgets, leading to a 0.4% drop in MoM sales.",
    tags: ["ECON", "$XRT"],
  },
  {
    time: "07:50:10",
    title: "Automakers pivot to EV strategy amidst regulatory pressure",
    body: "Legacy manufacturers outline ambitious electrification timelines to meet new EPA standards.",
    tags: ["AUTO"],
  },
];

export const quickHits = [
  {
    type: "Upgrades",
    tone: "up",
    time: "10:40 AM",
    text: "Analysts upgrade major bank stocks citing robust net interest income prospects for Q3.",
  },
  {
    type: "Downgrades",
    tone: "down",
    time: "10:25 AM",
    text: "Semiconductor outlook dimmed as supply chain issues persist and channel inventory builds.",
  },
  {
    type: "M&A News",
    time: "10:10 AM",
    text: "Healthcare giant announces $10B acquisition of rare-disease biotech firm.",
  },
  {
    type: "Earnings",
    time: "09:55 AM",
    text: "Retail sector earnings largely beat lowered expectations, discretionary spending holds up.",
  },
  {
    type: "Regulatory",
    time: "09:40 AM",
    text: "New SEC rules on crypto staking expected next week, market participants on edge.",
  },
  {
    type: "Macro",
    time: "09:20 AM",
    text: "Global shipping rates normalize after two years of extreme pandemic-induced turbulence.",
  },
  {
    type: "IPO",
    tone: "up",
    time: "08:50 AM",
    text: "Prominent tech unicorn files confidential S-1 for late Q4 public offering.",
  },
  {
    type: "Dividends",
    tone: "down",
    time: "08:35 AM",
    text: "Major telecom unexpectedly cuts dividend by 50% to fund massive 5G infrastructure expansion.",
  },
  {
    type: "Options",
    time: "08:15 AM",
    text: "Unusual call activity detected in mid-cap energy names ahead of earnings season.",
  },
  {
    type: "Insider",
    time: "08:00 AM",
    text: "CEO of struggling EV startup purchases $5M in open market shares, stock surges 8% pre-market.",
  },
];

export const compactIndices = [
  { name: "S&P 500", value: "4,450.32", change: "-1.24%", trend: "down" },
  { name: "NASDAQ", value: "13,761.50", change: "-1.85%", trend: "down" },
  { name: "DOW", value: "34,645.99", change: "+0.15%", trend: "up" },
  { name: "US 10Y", value: "4.28%", change: "+0.05", trend: "up" },
  { name: "EUR/USD", value: "1.0742", change: "-0.21%", trend: "down" },
  { name: "VIX", value: "18.45", change: "+4.20%", trend: "up" },
];

export const sectors = [
  { name: "Tech", value: "+1.4%", trend: "up", strength: 1 },
  { name: "Energy", value: "-0.8%", trend: "down", strength: 1 },
  { name: "Health", value: "+0.2%", trend: "up", strength: 0 },
  { name: "Finance", value: "-1.5%", trend: "down", strength: 2 },
  { name: "Utils", value: "0.0%", trend: "flat", strength: 0 },
  { name: "Consumer", value: "+2.1%", trend: "up", strength: 2 },
  { name: "Indust", value: "-0.5%", trend: "down", strength: 1 },
  { name: "Materials", value: "+0.7%", trend: "up", strength: 1 },
];
