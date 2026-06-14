"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Activity, AlertCircle, TrendingUp, BarChart3, PieChart, Info, ShieldAlert, Zap, Globe, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------
const MOCK_DATA = {
  marketPulse: {
    domestic: {
      nifty: { value: 22450.65, change: 120.4, changePercent: 0.54, trend: "up" },
      bankNifty: { value: 48930.2, change: -150.8, changePercent: -0.31, trend: "down" },
    },
    global: {
      dow: { value: 39043.32, change: 250.1, changePercent: 0.65, trend: "up" },
      nasdaq: { value: 16177.77, change: 140.5, changePercent: 0.88, trend: "up" },
      giftNifty: { value: 22510.5, change: 65.0, changePercent: 0.29, trend: "up" },
    },
    vix: { value: 12.4, change: -0.8, changePercent: -6.06, trend: "down", status: "Cooling" },
    breadth: { advancing: 1450, declining: 850, ratio: 1.71 },
  },
  sentiment: {
    bias: "Constructive",
    biasColor: "text-green-600 bg-green-50 border-green-200",
    takeaways: [
      "Global cues are supportive with US futures trading higher.",
      "Domestic institutions (DII) continue to absorb FII selling pressure.",
      "IT and Auto sectors are leading the breakout momentum.",
    ],
  },
  institutionalFlow: {
    fiiNet: -850, // in crores
    diiNet: 1250, // in crores
  },
  potentialStocks: [
    { symbol: "TCS", last: 3950.45, changePercent: 2.4, reason: "High Volume Breakout", trend: "up" },
    { symbol: "TATAMOTORS", last: 980.20, changePercent: 3.1, reason: "Sector Tailwind", trend: "up" },
    { symbol: "HDFCBANK", last: 1420.10, changePercent: -1.2, reason: "Key Support Broken", trend: "down" },
    { symbol: "RELIANCE", last: 2950.00, changePercent: 1.5, reason: "Moving Avg Crossover", trend: "up" },
  ],
  allStocks: [
    // Gainers
    { symbol: "TCS", last: 3950.45, change: 92.5, changePercent: 2.4, trend: "up", volume: "4.5M" },
    { symbol: "TATAMOTORS", last: 980.20, change: 29.4, changePercent: 3.1, trend: "up", volume: "12M" },
    { symbol: "RELIANCE", last: 2950.00, change: 43.6, changePercent: 1.5, trend: "up", volume: "6.2M" },
    { symbol: "INFY", last: 1450.80, change: 25.1, changePercent: 1.76, trend: "up", volume: "5.1M" },
    { symbol: "MARUTI", last: 12450.00, change: 180.0, changePercent: 1.47, trend: "up", volume: "800K" },
    // Losers
    { symbol: "HDFCBANK", last: 1420.10, change: -17.2, changePercent: -1.2, trend: "down", volume: "15M" },
    { symbol: "ITC", last: 410.50, change: -5.5, changePercent: -1.32, trend: "down", volume: "18M" },
    { symbol: "SBIN", last: 740.20, change: -8.1, changePercent: -1.08, trend: "down", volume: "9.5M" },
    { symbol: "KOTAKBANK", last: 1720.00, change: -22.5, changePercent: -1.29, trend: "down", volume: "3.2M" },
    { symbol: "SUNPHARMA", last: 1540.30, change: -14.2, changePercent: -0.91, trend: "down", volume: "2.1M" },
  ],
  allSectors: [
    { name: "NIFTY IT", changePercent: 2.1, trend: "up" },
    { name: "NIFTY AUTO", changePercent: 1.8, trend: "up" },
    { name: "NIFTY REALTY", changePercent: 1.2, trend: "up" },
    { name: "NIFTY METAL", changePercent: 0.8, trend: "up" },
    { name: "NIFTY ENERGY", changePercent: 0.5, trend: "up" },
    { name: "NIFTY FMCG", changePercent: -0.2, trend: "down" },
    { name: "NIFTY BANK", changePercent: -0.31, trend: "down" },
    { name: "NIFTY PHARMA", changePercent: -0.9, trend: "down" },
  ],
  optionsContext: {
    putWall: 22300,
    callWall: 22600,
    pcr: 1.25,
    pcrTrend: "Bullish Support",
  },
};

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------
const FormatNumber = ({ val, isPercent = false }: { val: number; isPercent?: boolean }) => {
  const formatted = Math.abs(val).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return (
    <span>
      {val > 0 ? "+" : val < 0 ? "-" : ""}
      {formatted}
      {isPercent ? "%" : ""}
    </span>
  );
};

const TrendIcon = ({ trend }: { trend: string }) => {
  return trend === "up" ? (
    <ArrowUp size={16} className="text-green-500" />
  ) : (
    <ArrowDown size={16} className="text-red-500" />
  );
};

// ----------------------------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------------------------
export default function FinancialDataDashboard() {
  const { marketPulse, sentiment, institutionalFlow, potentialStocks, allStocks, allSectors, optionsContext } = MOCK_DATA;
  
  const [pulseTab, setPulseTab] = useState<"domestic" | "global">("domestic");
  const [showAllStocks, setShowAllStocks] = useState(false);
  const [showAllSectors, setShowAllSectors] = useState(false);

  // Calculate breadth percentage for the visual bar
  const totalStocks = marketPulse.breadth.advancing + marketPulse.breadth.declining;
  const advPercent = (marketPulse.breadth.advancing / totalStocks) * 100;
  const advWidthClass =
    advPercent >= 75 ? "w-3/4" : advPercent >= 60 ? "w-2/3" : advPercent >= 50 ? "w-1/2" : "w-1/3";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <span className="text-blue-600 font-medium">Financial Data Dashboard</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" size={32} />
            Market Analysis Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Actionable daily insights filtered from raw market data. Designed for active traders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ========================================== */}
          {/* MAIN COLUMN (Left - 2/3 width)             */}
          {/* ========================================== */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* 1. Market Pulse Bar */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex flex-col">
              
              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-gray-50/50 rounded-t-xl px-2 pt-2">
                <button 
                  onClick={() => setPulseTab("domestic")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${pulseTab === "domestic" ? "bg-white text-blue-600 border border-b-0 border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <MapPin size={16} /> Domestic Cues
                </button>
                <button 
                  onClick={() => setPulseTab("global")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${pulseTab === "global" ? "bg-white text-blue-600 border border-b-0 border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Globe size={16} /> Global Cues
                </button>
              </div>

              <div className="p-4 flex flex-wrap gap-6 items-center justify-between">
                {pulseTab === "domestic" ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nifty 50</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{marketPulse.domestic.nifty.value.toLocaleString('en-IN')}</span>
                        <div className={`flex items-center text-sm font-medium ${marketPulse.domestic.nifty.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon trend={marketPulse.domestic.nifty.trend} />
                          <FormatNumber val={marketPulse.domestic.nifty.changePercent} isPercent />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col pl-6 border-l border-gray-100 hidden sm:flex">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bank Nifty</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{marketPulse.domestic.bankNifty.value.toLocaleString('en-IN')}</span>
                        <div className={`flex items-center text-sm font-medium ${marketPulse.domestic.bankNifty.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon trend={marketPulse.domestic.bankNifty.trend} />
                          <FormatNumber val={marketPulse.domestic.bankNifty.changePercent} isPercent />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dow Jones</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{marketPulse.global.dow.value.toLocaleString('en-US')}</span>
                        <div className={`flex items-center text-sm font-medium ${marketPulse.global.dow.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon trend={marketPulse.global.dow.trend} />
                          <FormatNumber val={marketPulse.global.dow.changePercent} isPercent />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col pl-6 border-l border-gray-100 hidden sm:flex">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nasdaq</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{marketPulse.global.nasdaq.value.toLocaleString('en-US')}</span>
                        <div className={`flex items-center text-sm font-medium ${marketPulse.global.nasdaq.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon trend={marketPulse.global.nasdaq.trend} />
                          <FormatNumber val={marketPulse.global.nasdaq.changePercent} isPercent />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col pl-6 border-l border-gray-100 hidden sm:flex">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gift Nifty</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{marketPulse.global.giftNifty.value.toLocaleString('en-US')}</span>
                        <div className={`flex items-center text-sm font-medium ${marketPulse.global.giftNifty.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          <TrendIcon trend={marketPulse.global.giftNifty.trend} />
                          <FormatNumber val={marketPulse.global.giftNifty.changePercent} isPercent />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* VIX */}
                <div className="flex flex-col pl-6 border-l border-gray-100 hidden lg:flex">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">India VIX</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{marketPulse.vix.value}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
                      {marketPulse.vix.status}
                    </span>
                  </div>
                </div>

                {/* Breadth */}
                <div className="flex flex-col pl-6 border-l border-gray-100 flex-1 min-w-[150px]">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Breadth (A/D)</span>
                    <span className="text-xs font-bold text-gray-900">{marketPulse.breadth.ratio}</span>
                  </div>
                  {/* Horizontal Progress Bar */}
                  <div className="w-full h-2.5 bg-red-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full bg-green-500 transition-all duration-1000 ease-out ${advWidthClass}`}
                      title={`Advancing: ${marketPulse.breadth.advancing}`}
                    />
                    <div 
                      className="h-full bg-red-500 flex-1"
                      title={`Declining: ${marketPulse.breadth.declining}`}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-medium">
                    <span className="text-green-600">{marketPulse.breadth.advancing} Adv</span>
                    <span className="text-red-600">{marketPulse.breadth.declining} Dec</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Sentiment & Takeaways */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-gray-500" />
                  Daily Setup & Analysis
                </h2>
                <span className={`px-3 py-1 rounded-md border font-semibold text-sm shadow-sm ${sentiment.biasColor}`}>
                  {sentiment.bias} Bias
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <ul className="space-y-3">
                  {sentiment.takeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Zap size={16} className="text-amber-500" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 3. Actionable Opportunities (Potential Stocks) */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShieldAlert size={20} className="text-gray-500" />
                  Stocks on Radar
                </h2>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Algorithmically Curated</span>
              </div>

              {/* Curated Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {potentialStocks.map((stock, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded ${stock.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <TrendIcon trend={stock.trend} />
                        <FormatNumber val={stock.changePercent} isPercent />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white border border-gray-100 px-2.5 py-1.5 rounded-md shadow-sm w-fit">
                      <Info size={14} className="text-blue-500" />
                      {stock.reason}
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Expandable Section */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <button 
                  onClick={() => setShowAllStocks(!showAllStocks)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {showAllStocks ? (
                    <><ChevronUp size={16} /> Hide Full Market Movers</>
                  ) : (
                    <><ChevronDown size={16} /> View Top 10 Gainers & Losers</>
                  )}
                </button>

                {showAllStocks && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-y border-gray-200">
                          <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">LTP</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Change</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allStocks.map((stock, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-3 px-4 font-bold text-gray-900 text-sm">{stock.symbol}</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-700 text-sm">{stock.last.toLocaleString('en-IN')}</td>
                            <td className={`py-3 px-4 text-right font-bold text-sm ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              <FormatNumber val={stock.changePercent} isPercent />
                            </td>
                            <td className="py-3 px-4 text-right text-gray-500 text-sm">{stock.volume}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* ========================================== */}
          {/* SIDEBAR (Right - 1/3 width)                */}
          {/* ========================================== */}
          <div className="flex flex-col gap-6">

            {/* 4. Sector Heatmap (Expandable) */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChart size={20} className="text-gray-500" />
                  Sector Heatmap
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {allSectors.slice(0, showAllSectors ? allSectors.length : 4).map((sector, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col justify-center p-3 rounded-lg border ${sector.trend === 'up' ? 'bg-green-50/60 border-green-100 hover:bg-green-100/50' : 'bg-red-50/60 border-red-100 hover:bg-red-100/50'} transition-colors cursor-default`}
                  >
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 line-clamp-1" title={sector.name}>{sector.name.replace("NIFTY ", "")}</span>
                    <span className={`text-sm font-black ${sector.trend === 'up' ? 'text-green-700' : 'text-red-700'}`}>
                      {sector.changePercent > 0 ? "+" : ""}{sector.changePercent}%
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowAllSectors(!showAllSectors)}
                className="w-full mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 py-1.5 rounded bg-blue-50/50 hover:bg-blue-50 transition-colors"
              >
                {showAllSectors ? "Show Less" : "View All Sectors"}
              </button>
            </section>

            {/* 5. Institutional Flow */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={20} className="text-gray-500" />
                  Net Flow (Cr)
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* FII */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700">FII</span>
                    <span className={`font-bold ${institutionalFlow.fiiNet > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <FormatNumber val={institutionalFlow.fiiNet} />
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full w-[45%] rounded-full ${institutionalFlow.fiiNet > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>

                {/* DII */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5 mt-2">
                    <span className="font-semibold text-gray-700">DII</span>
                    <span className={`font-bold ${institutionalFlow.diiNet > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <FormatNumber val={institutionalFlow.diiNet} />
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full w-3/4 rounded-full ${institutionalFlow.diiNet > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Options Context */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                <AlertCircle size={20} className="text-gray-500" />
                Nifty Options Walls
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-1">Max PCR</p>
                  <p className="text-xl font-black text-gray-900">{optionsContext.pcr}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center flex flex-col justify-center">
                  <p className="text-xs font-semibold text-gray-700">{optionsContext.pcrTrend}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg border border-red-100 bg-red-50/30">
                  <span className="text-sm font-semibold text-red-700">Call Wall (Res)</span>
                  <span className="font-bold text-gray-900">{optionsContext.callWall.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-green-100 bg-green-50/30">
                  <span className="text-sm font-semibold text-green-700">Put Wall (Sup)</span>
                  <span className="font-bold text-gray-900">{optionsContext.putWall.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">Values indicate highest Open Interest strikes.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
