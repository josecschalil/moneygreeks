"use client";

import React from "react";
import { TrendingUp, ArrowDown } from "lucide-react";

export default function TopGainersTabs({ gainers, losers }) {
  const [activeTab, setActiveTab] = React.useState("gainers");

  const data = activeTab === "gainers" ? gainers : losers;

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-gray-200/80 mb-6">
        <button
          onClick={() => setActiveTab("gainers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium relative ${
            activeTab === "gainers"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <TrendingUp size={18} />
          Top Gainers
          {activeTab === "gainers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("losers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium relative ${
            activeTab === "losers"
              ? "text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArrowDown size={18} />
          Top Losers
          {activeTab === "losers" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/80">
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Symbol
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Prev Close
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Open
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Change %
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock) => (
              <tr
                key={stock.id}
                className="py-3.5 px-3 text-left text-gray-600 text-sm"
              >
                <td className="py-3 px-3 font-medium">{stock.symbol}</td>
                <td className="py-3 px-3 text-right">{stock.prev_close}</td>
                <td
                  className={`py-3 px-3 text-right font-medium ${
                    activeTab === "gainers" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.open_price}
                </td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      activeTab === "gainers"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {stock.change_percent > 0 ? "+" : ""}
                    {stock.change_percent}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right">{stock.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
