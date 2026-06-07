import styles from "../news-today/MarketInsight.module.css";
import {
  feedItems,
  quickHits,
  compactIndices,
  sectors,
} from "../news-today/data";
import Icon from "./Icon";
import SentimentWidget from "./SentimentWidget";

function LiveFeed() {
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
        {feedItems.map((item) => (
          <div className={styles.feedItem} key={`${item.time}-${item.title}`}>
            <div className={styles.feedInner}>
              <div
                className={`${styles.feedTime} ${item.hot ? styles.hotTime : ""}`}
              >
                {item.time}
              </div>
              <div>
                <h3 className={styles.feedTitle}>{item.title}</h3>
                <p className={styles.feedText}>{item.body}</p>
                <div className={styles.tagRow}>
                  {item.tags.map((tag, index) => (
                    <span
                      className={`${styles.feedTag} ${index > 0 ? styles.outlineTag : ""}`}
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickHitsColumn() {
  return (
    <div className={styles.middleColumn}>
      <div className={`${styles.card} ${styles.breakingBox}`}>
        <h3 className={`${styles.widgetTitle} ${styles.breakingTitle}`}>
          <Icon name="bolt" /> Breaking
        </h3>
        <div>
          <h4 className={styles.smallStoryTitle}>
            Global Markets Brace as Central Banks Signal Aggressive Rate Hikes
          </h4>
          <p className={styles.smallStoryText}>
            Investors navigate heightened volatility as major central banks
            pivot towards tighter monetary policy.
          </p>
        </div>
        <div className={styles.storySplit} />
        <div>
          <h4 className={styles.smallStoryTitle}>
            Tech Sector Earnings Beat Estimates Despite Supply Chain Woes
          </h4>
          <p className={styles.smallStoryText}>
            Major tech firms report robust quarterly earnings, signaling
            resilient consumer demand.
          </p>
        </div>
      </div>

      <div className={`${styles.card} ${styles.quickHitsPanel}`}>
        <div className={styles.denseHeader}>
          <h3 className={styles.panelTitle}>
            <Icon name="flash_on" className={styles.up} /> Quick Hits
          </h3>
        </div>
        <div className={styles.quickHitsBody}>
          {quickHits.map((hit) => (
            <div className={styles.quickHit} key={`${hit.time}-${hit.type}`}>
              <div className={styles.quickTop}>
                <span
                  className={`${styles.hitType} ${hit.tone === "up" ? styles.up : hit.tone === "down" ? styles.down : ""}`}
                >
                  {hit.type}
                </span>
                <span className={styles.mutedSmall}>{hit.time}</span>
              </div>
              <p className={styles.hitText}>{hit.text}</p>
            </div>
          ))}
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

export default function AdvancedMarketFeed() {
  return (
    <>
      <div className={styles.terminalHeader}>
        <h2 className={styles.terminalTitle}>
          <Icon name="terminal" className={styles.terminalIcon} /> Advanced
          Market Feed
        </h2>
      </div>
      <section className={styles.denseGrid}>
        <LiveFeed />
        <QuickHitsColumn />
        <MarketDataColumn />
      </section>
    </>
  );
}
