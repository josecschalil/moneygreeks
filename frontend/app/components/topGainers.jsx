import TopGainersTabs from "./TopGainersTabs";

export default function TopGainers({ stockmovers }) {
  if (!stockmovers) return null;
  const Collection = Array.isArray(stockmovers) ? stockmovers : [];
  const topGainers = Collection.filter((item) => item.category === "gainer");

  const topLosers = Collection.filter((item) => item.category === "loser");
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
