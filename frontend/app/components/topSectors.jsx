import TopSectorsTabs from "./TopSectorsTabs";

export default async function TopSectors({ sectors }) {
  if (!sectors) return null;
  const Collection = Array.isArray(sectors) ? sectors : [];
  const TopSectors = Collection.filter((item) => item.category === "gainer");

  const LosingSectors = Collection.filter((item) => item.category === "loser");

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 border border-gray-200/60">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
        Top Gaining and Losing Sectors
      </h2>

      <TopSectorsTabs gainers={TopSectors} losers={LosingSectors} />
    </section>
  );
}
