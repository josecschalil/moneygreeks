import { marketItems } from "./data";
import Icon from "./Icon";

export default function MarketTicker({ compact = false }) {
  const combinedItems = compact
    ? marketItems.concat([
        { name: "EUR/USD", value: "1.0742", change: "-0.21%", trend: "down" },
        { name: "VIX", value: "18.45", change: "+4.20%", trend: "up" },
      ])
    : marketItems.concat([
        { name: "VIX", value: "18.45", change: "+4.20%", trend: "up" },
        { name: "EUR/USD", value: "1.0742", change: "-0.21%", trend: "down" },
        { name: "US10Y", value: "4.21%", change: "+0.03", trend: "up" },
      ]);

  if (compact) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
          <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase flex items-center gap-2">
            <Icon name="monitoring" size={14} className="text-foreground-secondary" /> 
            Indices
          </h2>
          <span className="text-[10px] font-bold text-market-negative tracking-wider animate-pulse">LIVE</span>
        </div>
        <div className="flex flex-col gap-3">
          {combinedItems.map((item) => (
            <div className="flex justify-between items-center group cursor-pointer" key={item.name}>
              <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
                {item.name.replace("DOW JONES", "DOW").replace("US 10-YR YIELD", "US 10Y")}
              </span>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-foreground">{item.value}</span>
                <span className={`min-w-[50px] text-right font-medium ${item.trend === "up" ? "text-market-positive" : "text-market-negative"}`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal strip mode (Bloomberg Terminal style)
  return (
    <div className="w-full bg-surface border-y border-border py-3 mb-10 overflow-hidden flex items-center">
      <div className="flex items-center flex-nowrap gap-8 overflow-x-auto no-scrollbar w-full px-4">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-border">
          <div className="w-2 h-2 rounded-full bg-market-negative animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-foreground uppercase">Live</span>
        </div>
        
        {combinedItems.map((item) => (
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" key={item.name}>
            <span className="text-xs font-semibold text-foreground-secondary tracking-wider group-hover:text-foreground transition-colors uppercase">
              {item.name.replace("DOW JONES", "DOW")}
            </span>
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-foreground">{item.value}</span>
              <span className={`font-medium ${item.trend === "up" ? "text-market-positive" : "text-market-negative"}`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
