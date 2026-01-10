import React from "react";
import { ArrowUp, ArrowDown, Clock, Calendar, User } from "lucide-react";
import TopGainers from "@/app/components/topGainers";
import TopSectors from "@/app/components/topSectors";
const MarketBlogPost = () => {
  // SEO metadata
  const metadata = {
    title: "India Market Open Summary - January 5, 2026",
    description:
      "Complete analysis of Indian stock market opening with GIFTNIFTY, NIFTY50, BANKNIFTY, BSE SENSEX performance and top gainers/losers.",
    author: "Market Analyst Team",
    publishDate: "2026-01-05T09:15:00Z",
    keywords: [
      "India Market",
      "NIFTY",
      "Sensex",
      "Stock Market",
      "Market Open",
      "Trading",
    ],
    canonicalUrl:
      "https://example.com/market-summary/india-market-open-january-5-2026",
  };

  const indices = [
    {
      name: "GIFTNIFTY",
      previousClose: 26417.5,
      open: 26422.0,
      change: -101.0,
      changePercent: 0.38,
      outlook: "down",
    },
    {
      name: "NIFTY50",
      previousClose: 26250.3,
      open: 26189.7,
      change: -63.95,
      changePercent: 0.24,
      outlook: "down",
    },
    {
      name: "BANKNIFTY",
      previousClose: 60044.2,
      open: 59957.8,
      change: 177.0,
      changePercent: 0.29,
      outlook: "up",
    },
    {
      name: "BSESENSEX",
      previousClose: 85439.62,
      open: 85331.14,
      change: -348.76,
      changePercent: 0.41,
      outlook: "down",
    },
    {
      name: "INDVIX",
      previousClose: 10.02,
      open: 10.02,
      change: 0.15,
      changePercent: 1.5,
      outlook: "up",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
            </li>
            <li className="before:content-['›'] before:mx-2">
              <a href="/streetview" className="hover:text-blue-600">
                Streetview
              </a>
            </li>
            <li className="before:content-['›'] before:mx-2 text-blue-600 font-medium">
              Streetopen
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
                  India Market Open Summary
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{metadata.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <time dateTime={metadata.publishDate}>January 5, 2026</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 min read</span>
                  </div>
                </div>
              </header>
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
                          Open
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
                      {indices.map((index) => (
                        <tr
                          key={index.name}
                          className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
                        >
                          <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                            {index.name}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.previousClose.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                            {index.open.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right text-sm font-medium ${
                              index.outlook === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                index.outlook === "down"
                                  ? "bg-red-50 text-red-600 border border-red-200/50"
                                  : "bg-green-50 text-green-600 border border-green-200/50"
                              }`}
                            >
                              {index.changePercent > 0 ? "+" : ""}
                              {index.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            {index.outlook === "down" ? (
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
                  {indices.map((index) => (
                    <div
                      key={index.name}
                      className="relative bg-white rounded-xl p-4 border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-base mb-0.5">
                            {index.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Open:{" "}
                              {index.open.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0 ${
                            index.outlook === "down"
                              ? "bg-red-50"
                              : "bg-green-50"
                          }`}
                        >
                          {index.outlook === "down" ? (
                            <ArrowDown size={14} className="text-red-600" />
                          ) : (
                            <ArrowUp size={14} className="text-green-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              index.outlook === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.changePercent > 0 ? "+" : ""}
                            {index.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Previous Close
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {index.previousClose.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Change</p>
                          <p
                            className={`text-sm font-medium ${
                              index.outlook === "down"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {index.change > 0 ? "+" : ""}
                            {index.change.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                          index.outlook === "down"
                            ? "bg-red-500"
                            : "bg-green-500"
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

              {/* Duplicate Sections from Original File */}
              <section className="bg-white rounded-lg shadow-sm p-6 mb-8 prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Market Analysis
                </h2>
                <p className="text-gray-700 mb-4">
                  The Indian equity markets opened on a mixed note today with
                  significant volatility across major indices. GIFTNIFTY showed
                  early weakness, declining 0.38% from its previous close,
                  indicating a cautious start to the trading session.
                </p>
                <p className="text-gray-700 mb-4">
                  Banking stocks showed resilience with BANKNIFTY gaining 0.29%,
                  driven by strong performance from major banking stocks. The
                  volatility index (INDVIX) spiked 1.50%, suggesting increased
                  market uncertainty and potential for wider price swings during
                  the session.
                </p>
                <p className="text-gray-700 mb-4">
                  Among individual stocks, UNIONBANK emerged as the top gainer
                  with a 2.46% increase, followed by INDUSINDBK at 2.34%. The
                  banking sector continues to attract investor attention amid
                  expectations of policy support and improved credit growth.
                </p>
              </section>

              {/* Repeated components as per source request */}
              <TopGainers />

              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-5">
                  Previous Day's Market Breadth
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
                      1174
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
                      1875
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
                      0.626
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      ratio
                    </div>
                  </div>
                </div>
              </section>
              <TopSectors />
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

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Streetview Live
                </h3>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  LIVE
                </span>
              </div>
              <div className="bg-gray-900 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-400">Live Chart Placeholder</p>
              </div>
              <button className="w-full mt-4 text-blue-600 font-medium hover:text-blue-700">
                View
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Market Closing Bell
                </h3>
                <span className="text-xs text-gray-500">January 05, 2026</span>
              </div>
              <div className="bg-gray-900 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-400">Closing Chart Placeholder</p>
              </div>
              <button className="w-full mt-4 text-blue-600 font-medium hover:text-blue-700">
                View All
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Know More
              </h3>
              <div className="space-y-3">
                {[
                  "What is Streetqazm, and how does it work?",
                  "How accurate are your research calls?",
                  "Can I change my subscription plan later?",
                  "What is a Research Call?",
                ].map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <span className="text-sm text-gray-700">{question}</span>
                    <span className="text-gray-400 group-hover:text-gray-600">
                      +
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MarketBlogPost;
