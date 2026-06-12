import styles from "../news-today/MarketInsight.module.css";
import { images } from "../news-today/data";
import MarketTicker from "./MarketTick";
import Link from "next/link";

export default function HeroSection({ post }) {
  return (
    <section className={styles.heroGrid}>
      <Link href={`/news-today/${post ? post.slug : "global-markets-rate-hikes"}`} className={`${styles.heroLead} block h-full`}>
        <article
          className={`${styles.card} ${styles.heroCard} ${styles.hoverZoom} h-full transition-all duration-300 hover:shadow-lg`}
        >
          <div className={styles.heroImageWrap}>
            <img
              src={post ? post.featured_image : images.hero}
              alt={post ? post.title : "Financial charts on multiple monitors in a dark trading room."}
              className={`${styles.image} transition-transform duration-700 hover:scale-[1.02]`}
            />
            <div className={styles.heroGradient} />
            <div className={styles.heroText}>
              <span className={styles.breakingPill}>BREAKING</span>
              <h1 className={styles.heroTitle}>
                {post ? post.title : "Global Markets Brace as Central Banks Signal Aggressive Rate Hikes"}
              </h1>
              <p className={styles.heroDescription}>
                {post ? post.subtitle : "Investors navigate heightened volatility as major central banks pivot towards tighter monetary policy to combat persistent inflation pressures across key economic zones."}
              </p>
              <div className={styles.byline}>
                <span>By {post ? post.author : "Sarah Jenkins"}</span>
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
