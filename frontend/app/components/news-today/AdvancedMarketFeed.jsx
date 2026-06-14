import {
  feedItems,
  quickHits,
  compactIndices,
  sectors,
} from "./data";
import Icon from "./Icon";
import SentimentWidget from "./SentimentWidget";
import Link from "next/link";

function LiveFeed({ posts }) {
  const items = posts?.length ? posts : feedItems;

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary flex items-center gap-2">
          <Icon name="feed" size={16} /> Live Feed
        </h2>
        <button className="text-xs font-semibold uppercase tracking-widest text-foreground-secondary hover:text-foreground flex items-center gap-1 transition-colors">
          <Icon name="filter_list" size={14} /> Filter
        </button>
      </div>
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar max-h-[800px]">
        {items.map((item, index) => {
          const content = (
            <div className="flex gap-4">
              <div className={`text-xs font-bold font-mono pt-1 w-16 shrink-0 ${item.hot ? "text-market-negative" : "text-foreground-secondary"}`}>
                {item.time || "JUST IN"}
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground-secondary leading-relaxed mb-3 line-clamp-3">
                  {item.subtitle || item.body || item.content?.substring(0, 100)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(item.tags || []).map((tag, tIndex) => (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${tIndex === 0 ? "bg-accent/10 text-accent" : "bg-border text-foreground-secondary"}`}
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );

          return item.slug ? (
            <Link href={`/news-today/${item.slug}`} className="block group pb-6 border-b border-border last:border-0 last:pb-0" key={item.slug}>
              {content}
            </Link>
          ) : (
            <div className="block pb-6 border-b border-border last:border-0 last:pb-0 group" key={index}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickHitsColumn({ quickHitPosts, breakingPosts }) {
  const breakingItems = breakingPosts?.length ? breakingPosts : [
    { title: "Global Markets Brace as Central Banks Signal Aggressive Rate Hikes", subtitle: "Investors navigate heightened volatility as major central banks pivot towards tighter monetary policy." },
    { title: "Tech Sector Earnings Beat Estimates Despite Supply Chain Woes", subtitle: "Major tech firms report robust quarterly earnings, signaling resilient consumer demand." }
  ];

  const hits = quickHitPosts?.length ? quickHitPosts : quickHits;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-market-negative mb-6 pb-4 border-b border-border flex items-center gap-2">
          <Icon name="bolt" size={16} /> Breaking
        </h3>
        <div className="flex flex-col gap-6">
          {breakingItems.map((story, i) => {
            const content = (
              <>
                <h4 className="text-lg font-serif leading-tight text-foreground mb-2 group-hover:text-accent transition-colors">{story.title}</h4>
                <p className="text-sm text-foreground-secondary leading-relaxed">{story.subtitle || story.description}</p>
              </>
            );
            return story.slug ? (
              <Link href={`/news-today/${story.slug}`} className="block group pb-6 border-b border-border last:border-0 last:pb-0" key={story.slug}>
                {content}
              </Link>
            ) : (
              <div key={i} className="pb-6 border-b border-border last:border-0 last:pb-0 group">{content}</div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 flex-1">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary flex items-center gap-2">
            <Icon name="flash_on" size={16} /> Quick Hits
          </h3>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar max-h-[400px]">
          {hits.map((hit, i) => {
            const content = (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${hit.tone === "up" ? "text-market-positive" : hit.tone === "down" ? "text-market-negative" : "text-accent"}`}>
                    {hit.type || "MARKET"}
                  </span>
                  <span className="text-xs font-mono text-foreground-secondary">{hit.time || "JUST IN"}</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-snug group-hover:text-accent transition-colors">
                  {hit.title || hit.text}
                </p>
              </>
            );
            return hit.slug ? (
              <Link href={`/news-today/${hit.slug}`} className="block group pb-5 border-b border-border last:border-0 last:pb-0" key={hit.slug}>
                {content}
              </Link>
            ) : (
              <div className="block pb-5 border-b border-border last:border-0 last:pb-0 group" key={i}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompactIndices() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary flex items-center gap-2">
          <Icon name="monitoring" size={16} /> Indices
        </h2>
        <span className="text-[10px] font-bold text-market-negative tracking-widest animate-pulse">LIVE</span>
      </div>
      <div className="flex flex-col gap-3">
        {compactIndices.map((item) => (
          <div className="flex justify-between items-center group cursor-pointer" key={item.name}>
            <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground transition-colors uppercase">
              {item.name}
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

function SectorHeatmap() {
  const getSectorStyle = (sector) => {
    if (sector.trend === "flat") return "bg-border text-foreground";
    if (sector.trend === "up") {
      if (sector.strength > 2) return "bg-market-positive text-white";
      if (sector.strength > 1) return "bg-market-positive/80 text-white";
      return "bg-market-positive/30 text-market-positive";
    }
    if (sector.strength > 2) return "bg-market-negative text-white";
    if (sector.strength > 1) return "bg-market-negative/80 text-white";
    return "bg-market-negative/30 text-market-negative";
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary mb-5 pb-3 border-b border-border">
        Sector Heatmap
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {sectors.map((sector) => (
          <div
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${getSectorStyle(sector)} transition-opacity hover:opacity-80 cursor-pointer`}
            key={sector.name}
          >
            <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">{sector.name}</span>
            <span className="font-mono text-xs font-medium">
              {sector.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketDataColumn() {
  return (
    <div className="flex flex-col h-full">
      <CompactIndices />
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <SentimentWidget compact />
      </div>
      <SectorHeatmap />
    </div>
  );
}

export default function AdvancedMarketFeed({ feedPosts, quickHits, breakingPosts }) {
  return (
    <div className="mb-20">
      <div className="flex items-center mb-8 border-b border-border pb-4">
        <h2 className="text-2xl font-serif text-foreground flex items-center gap-3">
          <Icon name="terminal" size={24} className="text-foreground-secondary" /> Advanced Market Feed
        </h2>
      </div>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <LiveFeed posts={feedPosts} />
        </div>
        <div className="lg:col-span-4">
          <QuickHitsColumn quickHitPosts={quickHits} breakingPosts={breakingPosts} />
        </div>
        <div className="lg:col-span-4">
          <MarketDataColumn />
        </div>
      </section>
    </div>
  );
}
