import { Suspense } from "react";
import styles from "../news-today/MarketInsight.module.css";
import { images } from "../news-today/data";
import MarketTicker from "./MarketTick";
import Link from "next/link";

const FALLBACK = {
  slug: "global-markets-rate-hikes",
  featured_image: images.hero,
  title: "Global Markets Brace as Central Banks Signal Aggressive Rate Hikes",
  subtitle:
    "Investors navigate heightened volatility as major central banks pivot towards tighter monetary policy to combat persistent inflation pressures across key economic zones.",
  author: "Sarah Jenkins",
};

export default function HeroSection({ post }) {
  const p = post || FALLBACK;

  return (
    <section className={styles.heroGrid}>
      <Link
        href={`/news-today/${p.slug}`}
        className={`${styles.heroLead} block h-full`}
      >
        <article
          className={`${styles.card} ${styles.heroCard} ${styles.hoverZoom} h-full transition-all duration-300 hover:shadow-lg`}
        >
          <div className={styles.heroImageWrap}>
            <img
              src={p.featured_image || images.hero}
              alt={p.title}
              className={`${styles.image} transition-transform duration-700 hover:scale-[1.02]`}
            />
            <div className={styles.heroGradient} />
            <div className={styles.heroText}>
              <span className={styles.breakingPill}>BREAKING</span>
              <h1 className={styles.heroTitle}>{p.title}</h1>
              <p className={styles.heroDescription}>{p.subtitle}</p>
              <div className={styles.byline}>
                <span>By {p.author}</span>
                <span>•</span>
                <span>4 min read</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
      <Suspense fallback={<div className={`${styles.card} ${styles.marketPanel} ${styles.heroSide}`} />}>
        <MarketTicker />
      </Suspense>
    </section>
  );
}
