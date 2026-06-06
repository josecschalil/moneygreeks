import styles from './MarketNews.module.css'

const news = [
  {
    category: 'ECONOMY',
    title: "RBI keeps repo rate unchanged at 6.5%; maintains 'withdrawal of accommodation' stance",
    excerpt: 'The Monetary Policy Committee voted 5:1 to keep rates steady, citing sticky food inflation',
  },
  {
    category: 'CORPORATE',
    title: 'Reliance Industries announces strategic partnership with global tech major',
    excerpt: 'The conglomerate outlines a $2B investment plan over the next three years to bolster its...',
  },
  {
    category: 'GLOBAL MARKETS',
    title: 'US Fed signals potential rate cuts later this year, boosting equity sentiment',
    excerpt: 'Fed Chair Powell noted that while inflation remains above target, the disinflationary...',
  },
  {
    category: 'SECTORS',
    title: 'Auto sales surge 12% YoY in March; EV penetration crosses critical threshold',
    excerpt: 'Passenger vehicle sales touched record highs, driven by robust demand for SUVs and...',
  },
]

export default function MarketNews() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Market News</h2>
        <a href="#" className={styles.viewAll}>View All →</a>
      </div>
      <div className={styles.grid}>
        {news.map((item, i) => (
          <a key={i} href="#" className={styles.card}>
            <div className={styles.category}>{item.category}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.excerpt}>{item.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
