import styles from "../news-today/MarketInsight.module.css";
import {
  feedItems,
  quickHits,
  compactIndices,
  sectors,
} from "../news-today/data";
import Icon from "./Icon";
import SentimentWidget from "./SentimentWidget";
import Link from "next/link";

function LiveFeed({ posts }) {
  const items = posts?.length ? posts : feedItems;

  return (
    <div className={`${styles.card} ${styles.tallPanel} ${styles.feedColumn}`}>
      <div className={styles.denseHeader}>
        <h2 className={styles.panelTitle}>
          <Icon name="feed" className={styles.up} /> Live Feed
        </h2>
        <button className={styles.filterButton}>
          <Icon name="filter_list" /> Filter
        </button>
      </div>
      <div className={styles.feedBody}>
        {items.map((item, index) => {
          const content = (
            <div className={styles.feedInner}>
              <div
                className={`${styles.feedTime} ${item.hot ? styles.hotTime : ""}`}
              >
                {item.time || "JUST IN"}
              </div>
              <div>
                <h3 className={styles.feedTitle}>{item.title}</h3>
                <p className={styles.feedText}>{item.subtitle || item.body || item.content?.substring(0, 100)}</p>
                <div className={styles.tagRow}>
                  {(item.tags || []).map((tag, tIndex) => (
                    <span
                      className={`${styles.feedTag} ${tIndex > 0 ? styles.outlineTag : ""}`}
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
            <Link href={`/news-today/${item.slug}`} className={`${styles.feedItem} hover:bg-gray-50 transition-colors block`} key={item.slug}>
              {content}
            </Link>
          ) : (
            <div className={styles.feedItem} key={index}>
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
    <div className={styles.middleColumn}>
      <div className={`${styles.card} ${styles.breakingBox}`}>
        <h3 className={`${styles.widgetTitle} ${styles.breakingTitle}`}>
          <Icon name="bolt" /> Breaking
        </h3>
        {breakingItems.map((story, i) => {
            const content = (
              <>
                {i > 0 && <div className={styles.storySplit} />}
                <h4 className={styles.smallStoryTitle}>{story.title}</h4>
                <p className={styles.smallStoryText}>{story.subtitle || story.description}</p>
              </>
            );
            return story.slug ? (
              <Link href={`/news-today/${story.slug}`} className="block hover:opacity-80 transition-opacity" key={story.slug}>
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
        })}
      </div>

      <div className={`${styles.card} ${styles.quickHitsPanel}`}>
        <div className={styles.denseHeader}>
          <h3 className={styles.panelTitle}>
            <Icon name="flash_on" className={styles.up} /> Quick Hits
          </h3>
        </div>
        <div className={styles.quickHitsBody}>
          {hits.map((hit, i) => {
            const content = (
              <>
                <div className={styles.quickTop}>
                  <span
                    className={`${styles.hitType} ${hit.tone === "up" ? styles.up : hit.tone === "down" ? styles.down : ""}`}
                  >
                    {hit.type || "MARKET"}
                  </span>
                  <span className={styles.mutedSmall}>{hit.time || "JUST IN"}</span>
                </div>
                <p className={styles.hitText}>{hit.title || hit.text}</p>
              </>
            );
            return hit.slug ? (
              <Link href={`/news-today/${hit.slug}`} className={`${styles.quickHit} hover:bg-gray-50 transition-colors block`} key={hit.slug}>
                {content}
              </Link>
            ) : (
              <div className={styles.quickHit} key={i}>
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
    <div className={`${styles.card} ${styles.compactPanel}`}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitleSmall}>
          <Icon name="monitoring" className={styles.up} /> Indices
        </h2>
        <span className={styles.mutedSmall}>LIVE</span>
      </div>
      <div className={styles.compactList}>
        {compactIndices.map((item) => (
          <div className={styles.compactIndexRow} key={item.name}>
            <span className={styles.rowTitle}>{item.name}</span>
            <div className={styles.compactQuote}>
              <span className={styles.rowValue}>{item.value}</span>
              <span
                className={`${styles.compactChange} ${item.trend === "up" ? styles.up : styles.down}`}
              >
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
  const classForSector = (sector) => {
    if (sector.trend === "flat") return "";
    if (sector.trend === "up") return styles[`sectorUp${sector.strength}`];
    return styles[`sectorDown${sector.strength}`];
  };

  return (
    <div className={`${styles.card} ${styles.sectorPanel}`}>
      <h3 className={styles.panelTitleSmall}>Sector Heatmap</h3>
      <div className={styles.sectorGrid}>
        {sectors.map((sector) => (
          <div
            className={`${styles.sectorBox} ${classForSector(sector)}`}
            key={sector.name}
          >
            <span className={styles.sectorName}>{sector.name}</span>
            <span
              className={`${styles.sectorValue} ${sector.trend === "up" ? styles.up : sector.trend === "down" ? styles.down : styles.rowValue}`}
            >
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
    <div className={styles.rightColumn}>
      <CompactIndices />
      <SentimentWidget compact />
      <SectorHeatmap />
    </div>
  );
}

export default function AdvancedMarketFeed({ feedPosts, quickHits, breakingPosts }) {
  return (
    <>
      <div className={styles.terminalHeader}>
        <h2 className={styles.terminalTitle}>
          <Icon name="terminal" className={styles.terminalIcon} /> Advanced
          Market Feed
        </h2>
      </div>
      <section className={styles.denseGrid}>
        <LiveFeed posts={feedPosts} />
        <QuickHitsColumn quickHitPosts={quickHits} breakingPosts={breakingPosts} />
        <MarketDataColumn />
      </section>
    </>
  );
}
