import styles from './PremiumBanner.module.css'

export default function PremiumBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.tag}>PREMIUM REPORT</div>
        <h2 className={styles.title}>
          Earnings Season Playbook: Navigating the Q4 IT Sector Results
        </h2>
        <p className={styles.desc}>
          An in-depth analysis of major IT heavyweights ahead of their Q4 disclosures. We analyze
          margin pressures, deal-pipelines, and technical setups.
        </p>
        <div className={styles.meta}>
          <span>⏱ 8 min read</span>
          <span>Published: 08:30 AM IST</span>
        </div>
      </div>
    </div>
  )
}
