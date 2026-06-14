import Link from "next/link";
import {
  compactIndices,
  feedItems,
  quickHits,
  sectors,
} from "../news-today/data";
import Icon from "./Icon";
import SentimentWidget from "./SentimentWidget";

function LiveFeed({ posts }) {
  const items = posts?.length ? posts : feedItems;

  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name="feed" className="text-[var(--mg-positive)]" />
          Live Feed
        </h2>
        <button className="inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] px-3 py-1.5 text-xs text-[var(--mg-text-muted)]">
          <Icon name="filter_list" />
          Filter
        </button>
      </div>

      <div className="mt-4 max-h-[620px] overflow-y-auto pr-1">
        {items.map((item, index) => {
          const content = (
            <div className="flex gap-4 border-t border-[var(--mg-border)] py-4 first:border-t-0 first:pt-0 last:pb-0">
              <div className={`w-16 shrink-0 text-xs font-medium ${item.hot ? "text-[var(--mg-negative)]" : "text-[var(--mg-text-soft)]"}`}>
                {item.time || "JUST IN"}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium leading-6 text-[var(--mg-text)]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--mg-text-muted)]">
                  {item.subtitle || item.body || item.content?.substring(0, 110)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(item.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--mg-surface-muted)] px-2 py-0.5 text-[11px] text-[var(--mg-text-soft)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );

          return item.slug ? (
            <Link href={`/news-today/${item.slug}`} className="block transition hover:bg-[var(--mg-surface-soft)]" key={item.slug}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

function QuickHitsColumn({ quickHitPosts, breakingPosts }) {
  const breakingItems = breakingPosts?.length
    ? breakingPosts
    : [
      {
        title: "Global markets brace as central banks signal aggressive rate hikes",
        subtitle: "Investors navigate heightened volatility as central banks pivot toward tighter policy.",
      },
      {
        title: "Tech sector earnings beat estimates despite supply-chain pressure",
        subtitle: "Major technology firms report resilient demand and stable cloud growth.",
      },
    ];
  const hits = quickHitPosts?.length ? quickHitPosts : quickHits;

  return (
    <div className="space-y-5">
      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name="bolt" className="text-[var(--mg-warning)]" />
          Breaking
        </h3>
        <div className="mt-4 divide-y divide-[var(--mg-border)]">
          {breakingItems.map((story, index) => {
            const content = (
              <div className="py-4 first:pt-0 last:pb-0">
                <h4 className="text-sm font-medium leading-6 text-[var(--mg-text)]">{story.title}</h4>
                <p className="mt-1 text-sm leading-6 text-[var(--mg-text-muted)]">{story.subtitle || story.description}</p>
              </div>
            );

            return story.slug ? (
              <Link href={`/news-today/${story.slug}`} className="block" key={story.slug}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
        <h3 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name="flash_on" className="text-[var(--mg-positive)]" />
          Quick Hits
        </h3>
        <div className="mt-4 divide-y divide-[var(--mg-border)]">
          {hits.slice(0, 7).map((hit, index) => {
            const content = (
              <div className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-medium uppercase tracking-[0.14em] ${hit.tone === "up" ? "text-[var(--mg-positive)]" : hit.tone === "down" ? "text-[var(--mg-negative)]" : "text-[var(--mg-text-soft)]"}`}>
                    {hit.type || "Market"}
                  </span>
                  <span className="text-xs text-[var(--mg-text-soft)]">{hit.time || "Just in"}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--mg-text-muted)]">{hit.title || hit.text}</p>
              </div>
            );

            return hit.slug ? (
              <Link href={`/news-today/${hit.slug}`} className="block" key={hit.slug}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CompactIndices() {
  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
          <Icon name="monitoring" className="text-[var(--mg-positive)]" />
          Indices
        </h2>
        <span className="text-xs text-[var(--mg-text-soft)]">Live</span>
      </div>
      <div className="mt-4 divide-y divide-[var(--mg-border)]">
        {compactIndices.map((item) => (
          <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0" key={item.name}>
            <span className="text-sm font-medium text-[var(--mg-text)]">{item.name}</span>
            <div className="text-right">
              <span className="block text-sm text-[var(--mg-text-muted)]">{item.value}</span>
              <span className={`text-xs font-medium ${item.trend === "up" ? "text-[var(--mg-positive)]" : "text-[var(--mg-negative)]"}`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectorHeatmap() {
  return (
    <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
      <h3 className="font-heading text-base font-semibold text-[var(--mg-text)]">Sector Heatmap</h3>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {sectors.map((sector) => {
          const tone =
            sector.trend === "up"
              ? "bg-[var(--mg-positive-soft)] text-[var(--mg-positive)]"
              : sector.trend === "down"
                ? "bg-[var(--mg-negative-soft)] text-[var(--mg-negative)]"
                : "bg-[var(--mg-surface-muted)] text-[var(--mg-text-muted)]";

          return (
            <div key={sector.name} className={`rounded-2xl p-3 ${tone}`}>
              <span className="block text-xs">{sector.name}</span>
              <span className="mt-1 block text-sm font-medium">{sector.value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MarketDataColumn() {
  return (
    <div className="space-y-5">
      <CompactIndices />
      <SentimentWidget compact />
      <SectorHeatmap />
    </div>
  );
}

export default function AdvancedMarketFeed({ feedPosts, quickHits: quickHitPosts, breakingPosts }) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          Terminal
        </p>
        <h2 className="mt-1 flex items-center gap-2 font-heading text-2xl font-semibold text-[var(--mg-text)]">
          <Icon name="terminal" />
          Advanced Market Feed
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)_300px]">
        <LiveFeed posts={feedPosts} />
        <QuickHitsColumn quickHitPosts={quickHitPosts} breakingPosts={breakingPosts} />
        <MarketDataColumn />
      </div>
    </section>
  );
}
