import styles from "../news-today/MarketInsight.module.css";
import { images } from "../news-today/data";
import MarketTicker from "./MarketTick";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className={styles.heroGrid}>
      <Link href="/news-today/global-markets-rate-hikes" className={`${styles.heroLead} block h-full`}>
        <article
          className={`${styles.card} ${styles.heroCard} ${styles.hoverZoom} h-full transition-all duration-300 hover:shadow-lg`}
        >
          <div className={styles.heroImageWrap}>
            <img
              src={images.hero}
              alt="Financial charts on multiple monitors in a dark trading room."
              className={`${styles.image} transition-transform duration-700 hover:scale-[1.02]`}
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
      </Link>
      <MarketTicker />
    </section>
  );
}
