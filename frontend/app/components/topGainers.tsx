"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Clock,
  Calendar,
  User,
} from "lucide-react";
interface StockData {
  symbol: string;
  previousClose: number;
  open: number;
  changePercent: number;
  volume: string;
  target: number;
}
export default function topGainers() {
  const [activeTab, setActiveTab] = React.useState<"gainers" | "losers">(
    "gainers"
  );

  const topGainers: StockData[] = [
    {
      symbol: "UNIONBANK",
      previousClose: 162.36,
      open: 163.6,
      changePercent: 2.46,
      volume: "22.8m",
      target: 167.3,
    },
    {
      symbol: "INDUSINDBK",
      previousClose: 899.95,
      open: 898.0,
      changePercent: 2.34,
      volume: "4.5m",
      target: 924.0,
    },
    {
      symbol: "SBIN",
      previousClose: 1005.55,
      open: 1007.95,
      changePercent: 1.52,
      volume: "6.4m",
      target: 1024.0,
    },
    {
      symbol: "AXISBANK",
      previousClose: 1285.8,
      open: 1304.6,
      changePercent: 0.71,
      volume: "4.9m",
      target: 1304.6,
    },
    {
      symbol: "PNB",
      previousClose: 125.08,
      open: 124.95,
      changePercent: 0.41,
      volume: "7.7m",
      target: 126.08,
    },
    {
      symbol: "CANBK",
      previousClose: 154.23,
      open: 154.5,
      changePercent: 0.26,
      volume: "12.3m",
      target: 156.12,
    },
  ];

  const topLosers: StockData[] = [
    {
      symbol: "RELIANCE",
      previousClose: 2845.5,
      open: 2789.3,
      changePercent: -1.97,
      volume: "18.2m",
      target: 2750.0,
    },
    {
      symbol: "TCS",
      previousClose: 3542.8,
      open: 3498.25,
      changePercent: -1.26,
      volume: "8.5m",
      target: 3480.0,
    },
    {
      symbol: "INFY",
      previousClose: 1678.9,
      open: 1658.4,
      changePercent: -1.22,
      volume: "12.4m",
      target: 1645.0,
    },
    {
      symbol: "HDFCBANK",
      previousClose: 1652.3,
      open: 1638.75,
      changePercent: -0.82,
      volume: "15.6m",
      target: 1630.0,
    },
    {
      symbol: "WIPRO",
      previousClose: 578.6,
      open: 574.25,
      changePercent: -0.75,
      volume: "9.8m",
      target: 570.0,
    },
    {
      symbol: "ICICIBANK",
      previousClose: 1128.45,
      open: 1120.8,
      changePercent: -0.68,
      volume: "11.2m",
      target: 1115.0,
    },
  ];
  return (
    <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Top Gainers and Losers
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200/80 mb-6">
        <button
          onClick={() => setActiveTab("gainers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
            activeTab === "gainers"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <TrendingUp size={18} />
          Top Gainers
          {activeTab === "gainers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("losers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
            activeTab === "losers"
              ? "text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArrowDown size={18} />
          Top Losers
          {activeTab === "losers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
          )}
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/80">
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Symbol
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Prev Close
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Open
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Change %
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Volume
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "gainers" ? topGainers : topLosers).map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b border-gray-100/80 hover:bg-gray-50/50 transition-colors duration-200"
              >
                <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                  {stock.symbol}
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {stock.previousClose.toFixed(2)}
                </td>
                <td
                  className={`py-3.5 px-3 text-right text-sm font-medium ${
                    activeTab === "gainers" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.open.toFixed(2)}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      activeTab === "gainers"
                        ? "bg-green-50 text-green-600 border border-green-200/50"
                        : "bg-red-50 text-red-600 border border-red-200/50"
                    }`}
                  >
                    {stock.changePercent > 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {stock.volume}
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {stock.target.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
