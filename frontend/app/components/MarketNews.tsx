import styles from './MarketNews.module.css'
import Link from 'next/link'
import { fetchPostsByCategory } from '../utils/api'

// Fallback data if API is down
const fallbackNews = [
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

function extractText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(extractText).join(" ");
  }
  if (typeof content === "object") {
    // Attempt to pull out common text fields from block editor structures
    if (content.text) return content.text;
    if (content.content) return extractText(content.content);
    return "";
  }
  return String(content);
}

function truncateText(content: any, length = 100) {
  const text = extractText(content);
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

export default async function MarketNews() {
  const liveNews = await fetchPostsByCategory('news')

  // Use live data if available, take top 4
  const displayNews = liveNews === null 
    ? fallbackNews 
    : liveNews.slice(0, 4).map((post: any) => ({
        category: post.news_placement ? post.news_placement.replace('_', ' ').toUpperCase() : 'MARKET NEWS',
        title: post.title,
        excerpt: truncateText(post.summary || post.content, 120),
        slug: post.slug,
      }))

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Market News</h2>
        <Link href="/news-today" className={styles.viewAll}>View All →</Link>
      </div>
      <div className={styles.grid}>
        {displayNews.length === 0 ? (
          <div className="col-span-full flex h-32 w-full items-center justify-center rounded-2xl border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] text-sm text-[var(--mg-text-muted)]">
            No market news available right now.
          </div>
        ) : (
          displayNews.map((item: any, i: number) => (
            <Link key={i} href={item.slug ? `/news-today/${item.slug}` : "/news-today"} className={styles.card} style={{ textDecoration: 'none' }}>
              <div className={styles.category}>{item.category}</div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.excerpt}>{item.excerpt}</p>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
