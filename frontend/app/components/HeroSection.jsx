import styles from "../news-today/MarketInsight.module.css";
import { images } from "../news-today/data";
import MarketTicker from "./MarketTick";

export default function HeroSection() {
  return (
    <section className={styles.heroGrid}>
      <article
        className={`${styles.card} ${styles.heroLead} ${styles.heroCard} ${styles.hoverZoom}`}
      >
        <div className={styles.heroImageWrap}>
          <img
            src={images.hero}
            alt="Financial charts on multiple monitors in a dark trading room."
            className={styles.image}
          />
          <div className={styles.heroGradient} />
          <div className={styles.heroText}>
            <span className={styles.breakingPill}>BREAKING</span>
            <h1 className={styles.heroTitle}>
              Global Markets Brace as Central Banks Signal Aggressive Rate Hikes
            </h1>
            <p className={styles.heroDescription}>
              Investors navigate heightened volatility as major central banks
              pivot towards tighter monetary policy to combat persistent
              inflation pressures across key economic zones.
            </p>
            <div className={styles.byline}>
              <span>By Sarah Jenkins</span>
              <span>•</span>
              <span>4 min read</span>
            </div>
          </div>
        </div>
      </article>
      <MarketTicker />
    </section>
  );
}
