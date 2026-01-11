import Image from "next/image";
import Link from "next/link";
async function fetchPreMarketData() {
  const res = await fetch("http://127.0.0.1:8000/report-list/", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pre-market data");
  }
  return res.json();
}

const demoData = {
  premarket: [
    {
      id: 1,
      title: "Pre Market Report – Nifty, Global Cues & FII Activity",
      slug: "pre-market-report-nifty-global-cues",
      excerpt:
        "Indian markets are expected to open flat amid mixed global cues. Asian markets trade cautiously while US futures remain subdued.",
      published_at: "Jan 12, 2026",
      cover_image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    },
    {
      id: 8,
      title: "Pre Market Report – Bank Nifty Setup & Global Markets",
      slug: "pre-market-bank-nifty-global",
      excerpt:
        "Bank Nifty shows strength with favorable options data. Global markets mixed as investors await Fed commentary.",
      published_at: "Jan 11, 2026",
      cover_image:
        "https://images.unsplash.com/photo-1642790106117-e829e14a795f",
    },
    {
      id: 9,
      title: "Pre Market Report – IT Stocks in Focus Amid Tech Earnings",
      slug: "pre-market-it-stocks-earnings",
      excerpt:
        "IT stocks could see action today as global tech earnings roll in. Nifty expected to open with slight gap up.",
      published_at: "Jan 10, 2026",
      cover_image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
    {
      id: 10,
      title: "Pre Market Report – Volatility Expected on Derivatives Expiry",
      slug: "pre-market-derivatives-expiry",
      excerpt:
        "Weekly options expiry day setup with high open interest at key strike prices. Range-bound movement likely.",
      published_at: "Jan 9, 2026",
      cover_image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    },
  ],

  featured: [
    {
      id: 2,
      title: "Why Banking Stocks Are Gaining Momentum",
      slug: "banking-stocks-gaining-momentum",
      excerpt:
        "Banking stocks are showing relative strength as credit growth improves and asset quality remains stable.",
      cover_image: "https://images.unsplash.com/photo-1559526324-593bc073d938",
    },
    {
      id: 3,
      title: "What Rising Crude Oil Prices Mean for India",
      slug: "crude-oil-impact-indian-market",
      excerpt:
        "Crude oil prices have surged again. Here's how it could impact inflation, rupee, and equity markets.",
      cover_image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
    },
    {
      id: 4,
      title: "Midcap Stocks to Watch This Earnings Season",
      slug: "midcap-stocks-earnings-season",
      excerpt:
        "Earnings season is here. These midcap stocks could see volatility and opportunity.",
      cover_image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    },
  ],

  educational: [
    {
      id: 5,
      title: "What Is Open Interest in Stock Market?",
      slug: "what-is-open-interest",
      excerpt:
        "Open Interest helps traders understand market participation and trend strength in derivatives.",
      cover_image:
        "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9",
    },
    {
      id: 6,
      title: "Difference Between FII and DII Explained",
      slug: "difference-between-fii-dii",
      excerpt:
        "FIIs and DIIs play a major role in Indian markets. Learn how their activity affects trends.",
      cover_image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
    {
      id: 7,
      title: "What Is Support and Resistance?",
      slug: "support-and-resistance-explained",
      excerpt:
        "Support and resistance are core technical analysis concepts every trader must understand.",
      cover_image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
    },
  ],
};

/* ---------------- PAGE ---------------- */

export default async function BlogPage() {
  const premarketData = await fetchPreMarketData();
  const latestPremarket = premarketData[0];
  const olderPremarkets = premarketData.slice(0, 6);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* ================= HERO - LATEST PREMARKET ================= */}
        <section>
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase text-gray-900">
                Today's Pre-Market Report
              </span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-2">
              Latest Market Analysis
            </h2>
            <p className="text-lg text-gray-600">
              Essential insights before the opening bell
            </p>
          </div>

          <Link href={`/market-data/${latestPremarket.slug}`}>
            <article className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-gray-900 transition-all duration-500 hover:shadow-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-96 md:h-auto overflow-hidden">
                  <Image
                    src={latestPremarket.image_url}
                    alt={latestPremarket.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg">
                      <svg
                        className="w-4 h-4 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900">
                        {latestPremarket.report_date}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-12 bg-gray-300"></span>
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">
                      Featured Report
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 group-hover:text-gray-700 transition-colors">
                    {latestPremarket.title}
                  </h1>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {latestPremarket.overall_conclusion}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-3 text-gray-900 font-semibold group-hover:gap-4 transition-all">
                      Read Full Analysis
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </section>

        {/* ================= PREVIOUS PREMARKET REPORTS ================= */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Previous Reports
              </h2>
              <p className="text-lg text-gray-600">
                Catch up on recent market analysis
              </p>
            </div>
            <Link
              href="/pre-market-archive"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              View Archive
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {olderPremarkets.map((post) => (
              <Link key={post.id} href={`/market-data/${post.slug}`}>
                <article className="group h-full">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-500 pb-2">
                      {post.report_date}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {post.overall_conclusion}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                        Read More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-gray-200"></div>

        {/* ================= FEATURED INSIGHTS ================= */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Market Insights
              </h2>
              <p className="text-lg text-gray-600">
                In-depth analysis and expert perspectives
              </p>
            </div>
            <Link
              href="/blog/insights"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all"
            >
              Explore All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {demoData.featured.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group h-full">
                  <div className="relative h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="h-px flex-1 bg-gray-200"></span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                        Continue Reading
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-gray-200"></div>

        {/* ================= EDUCATIONAL ================= */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Learning Center
              </h2>
              <p className="text-lg text-gray-600">
                Master the fundamentals of market trading
              </p>
            </div>
            <Link
              href="/blog/education"
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all"
            >
              All Lessons
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="space-y-6">
            {demoData.educational.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group flex flex-col sm:flex-row gap-6 p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 bg-white hover:shadow-lg">
                  <div className="relative w-full sm:w-56 h-44 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="px-4 py-1 bg-gray-100 text-gray-900 text-xs font-semibold rounded-full uppercase tracking-wide">
                        Educational
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                        Start Learning
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
