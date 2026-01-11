"use client";

import React from "react";
import { TrendingUp, ArrowDown } from "lucide-react";

export default function TopSectorsTabs({ gainers, losers }) {
  const [activeTab, setActiveTab] = React.useState("gainers");

  const data = activeTab === "gainers" ? gainers : losers;

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-gray-200/80 mb-6">
        <button
          onClick={() => setActiveTab("gainers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium ${
            activeTab === "gainers"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <TrendingUp size={18} />
          Top Gainers
        </button>

        <button
          onClick={() => setActiveTab("losers")}
          className={`flex items-center gap-2 px-6 py-3 font-medium ${
            activeTab === "losers"
              ? "text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArrowDown size={18} />
          Top Losers
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/80">
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">
                Symbol
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                Last
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                % Chng
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                P/E
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                P/B
              </th>
              <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">
                Div Yield
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr
                key={s.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3.5 px-3 font-medium text-gray-900 text-sm">
                  {s.sector_name}
                </td>
                <td className="py-3 px-3 text-right text-gray-600">
                  {s.prev_close}
                </td>
                <td
                  className={`py-3 px-3 text-right font-medium ${
                    activeTab === "gainers" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.change_percent > 0 ? "+" : ""}
                  {s.change_percent}%
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {s.pe}
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {s.pb}
                </td>
                <td className="py-3.5 px-3 text-right text-gray-600 text-sm">
                  {s.div_yield}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
