import styles from "../news-today/MarketInsight.module.css";
import Icon from "./Icon";
import SentimentWidget from "./SentimentWidget";
import MarketTicker from "./MarketTick";
import Link from "next/link";

function LiveFeed({ posts }) {
  if (!posts?.length) return null;

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
        {posts.map((item, index) => {
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
  if (!breakingPosts?.length && !quickHitPosts?.length) return null;

  return (
    <div className={styles.middleColumn}>
      {breakingPosts?.length > 0 && (
        <div className={`${styles.card} ${styles.breakingBox}`}>
          <h3 className={`${styles.widgetTitle} ${styles.breakingTitle}`}>
            <Icon name="bolt" /> Breaking
          </h3>
          {breakingPosts.map((story, i) => {
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
      )}

      {quickHitPosts?.length > 0 && (
        <div className={`${styles.card} ${styles.quickHitsPanel}`}>
          <div className={styles.denseHeader}>
            <h3 className={styles.panelTitle}>
              <Icon name="flash_on" className={styles.up} /> Quick Hits
            </h3>
          </div>
          <div className={styles.quickHitsBody}>
            {quickHitPosts.map((hit, i) => {
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
      )}
    </div>
  );
}

function MarketDataColumn() {
  return (
    <div className={styles.rightColumn}>
      <MarketTicker compact />
      <SentimentWidget compact />
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
