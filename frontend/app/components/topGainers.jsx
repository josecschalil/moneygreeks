import TopGainersTabs from "./TopGainersTabs";

export default function TopGainers() {
  const topGainers = [
    {
      symbol: "UNIONBANKs",
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
  ];

  const topLosers = [
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
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
        Top Gainers and Losers
      </h2>

      {/* Client-only interaction */}
      <TopGainersTabs gainers={topGainers} losers={topLosers} />
    </section>
  );
}
