import styles from './AcademyBanner.module.css'

export default function AcademyBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.tag}>MARKET INSIGHT ACADEMY</div>
        <h2 className={styles.title}>Master Technical Analysis</h2>
        <p className={styles.desc}>
          Learn how to read charts, identify patterns, and make data-driven trading decisions with our
          comprehensive, free curriculum designed for Indian markets.
        </p>
        <button className={styles.cta}>
          Start Learning ▶
        </button>
      </div>
      <div className={styles.visual}>
        <div className={styles.chartOverlay} />
        <div className={styles.chartLines}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.chartLine} style={{ height: `${40 + Math.sin(i * 0.8) * 30}%` }} />
          ))}
        </div>
        <div className={styles.circleGlow} />
      </div>
    </div>
  )
}
