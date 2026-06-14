function SectorHeatmap() {
  return (
    <BentoCard
      title="Sector Heatmap"
      icon="grid_view"
    >
      <div className="grid grid-cols-2 gap-3">
        {sectors.map((sector) => {
          const tone =
            sector.trend === "up"
              ? "bg-green-50 text-green-700"
              : sector.trend === "down"
              ? "bg-red-50 text-red-700"
              : "bg-zinc-100 text-zinc-600";

          return (
            <div
              key={sector.name}
              className={`rounded-2xl p-4 ${tone}`}
            >
              <p className="text-xs uppercase">
                {sector.name}
              </p>

              <p className="mt-2 text-xl font-semibold">
                {sector.value}
              </p>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}

export default SectorHeatmap;