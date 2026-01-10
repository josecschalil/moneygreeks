import TopSectorsTabs from "./TopSectorsTabs";

export default async function TopSectors() {
  const topGainers = [
    {
      symbol: "UNIONBANK",
      previousClose: 162.36,
      open: 163.6,
      changePercent: 2.46,
      pe: 12.4,
      pb: 1.2,
      divYield: 3.4,
    },
    {
      symbol: "SBIN",
      previousClose: 1005.55,
      open: 1007.95,
      changePercent: 1.52,
      pe: 11.8,
      pb: 1.5,
      divYield: 2.1,
    },
  ];

  const topLosers = [
    {
      symbol: "RELIANCE",
      previousClose: 2845.5,
      open: 2789.3,
      changePercent: -1.97,
      pe: 23.4,
      pb: 2.3,
      divYield: 0.4,
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
        Top Gaining and Losing Sectors
      </h2>

      {/* Client-side tabs */}
      <TopSectorsTabs gainers={topGainers} losers={topLosers} />
    </section>
  );
}
