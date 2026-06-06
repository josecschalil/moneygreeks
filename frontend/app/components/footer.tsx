import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>MarketInsight</div>
          <p className={styles.tagline}>
            Leading financial intelligence platform delivering actionable insights for the Indian stock market.
          </p>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Explore</div>
          <ul className={styles.links}>
            <li><a href="#">Markets</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Reports</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Resources</div>
          <ul className={styles.links}>
            <li><a href="#">Education</a></li>
            <li><a href="#">IPO</a></li>
            <li><a href="#">Calendars</a></li>
          </ul>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Legal</div>
          <ul className={styles.links}>
            <li><a href="#">Glossary</a></li>
            <li><a href="#">Disclaimers</a></li>
            <li><a href="#">Risk-Disclosure</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        © 2024 MarketInsight Intelligence. SEBI Registered Research Analyst. Investments in securities market are subject to market risks.
      </div>
    </footer>
  )
}
