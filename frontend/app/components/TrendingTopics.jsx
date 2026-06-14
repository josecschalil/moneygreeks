import { trendingTopics } from "../news-today/data";
import Icon from "./Icon";

export default function TrendingTopics() {
  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name="trending_up" className="text-[var(--mg-positive)]" />
          Trending Topics
        </h3>
        <span className="inline-flex items-center gap-2 text-xs text-[var(--mg-text-soft)]">
          <span className="h-2 w-2 rounded-full bg-[var(--mg-positive)]" />
          Live updates
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {trendingTopics.map((topic) => (
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-3 py-2 text-sm text-[var(--mg-text-muted)] transition hover:border-[var(--mg-border-strong)] hover:text-[var(--mg-text)]"
            key={topic.tag}
          >
            {topic.tag}
            <Icon
              name={topic.direction}
              className={topic.trend === "up" ? "text-[var(--mg-positive)]" : "text-[var(--mg-negative)]"}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
