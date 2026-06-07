import styles from "../news-today/MarketInsight.module.css";
import Icon from "./Icon";

export default function SentimentWidget({ compact = false }) {
  return (
    <div
      className={`${styles.card} ${compact ? `${styles.compactPanel} ${styles.compactSentiment}` : styles.widget}`}
    >
      <h3 className={compact ? styles.panelTitleSmall : styles.widgetTitle}>
        <Icon name="speed" /> {compact ? "Sentiment" : "Market Sentiment"}
      </h3>

      <div>
        <div className={styles.sentimentLabels}>
          <span className={styles.down}>Bearish</span>
          <span className={styles.up}>Bullish</span>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterFill} />
          <div className={styles.needle} />
        </div>
        <div className={styles.sentimentValue}>Optimistic (65/100)</div>
      </div>

      <div className={styles.voteGrid}>
        <button
          className={`${styles.voteButton} ${compact ? styles.voteCompact : ""} ${styles.bearishButton}`}
        >
          <Icon name="thumb_down" /> Vote Bearish
        </button>
        <button
          className={`${styles.voteButton} ${compact ? styles.voteCompact : ""} ${styles.bullishButton}`}
        >
          <Icon name="thumb_up" /> Vote Bullish
        </button>
      </div>

      {compact ? (
        <p className={styles.voteCount}>Based on 14,203 votes</p>
      ) : (
        <p className={styles.widgetFoot}>
          Based on aggregated institutional flow and options positioning data.
        </p>
      )}
    </div>
  );
}
