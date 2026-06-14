import { trendingTopics } from "./data";
import Icon from "./Icon";

export default function TrendingTopics() {
  return (
    <section className="bg-surface border border-border rounded-2xl p-6 mb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary flex items-center gap-2">
          <Icon name="trending_up" size={16} className="text-foreground" /> Market Pulse:
          <span className="text-foreground">Trending Topics</span>
        </h3>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-market-negative">
          <span className="w-2 h-2 rounded-full bg-market-negative animate-pulse" /> Live
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {trendingTopics.map((topic) => (
          <a href="#" className="group flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-foreground transition-colors" key={topic.tag}>
            <span className="text-sm font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
              {topic.tag}
            </span>
            <span className={`${topic.trend === "up" ? "text-market-positive" : "text-market-negative"}`}>
              <Icon name={topic.direction} size={14} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
