import Link from "next/link";
import styles from "./page.module.css";
import { fetchPostsByCategory } from "../utils/api";
import { fetchEducationCategories } from "../utils/api";
import NewsletterSidebarWidget from "@/app/components/NewsletterSidebarWidget";

export default async function IntelligenceHub() {
  const eduPosts = await fetchPostsByCategory("education") || [];

  // Fetch latest news for the Intelligence Briefing sidebar widget
  let latestNews = [];
  try {
    const newsRes = await fetch("http://127.0.0.1:8000/blog-post/?category=news", { next: { revalidate: 60 } });
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      const allNews = Array.isArray(newsData) ? newsData : (newsData.results || []);
      latestNews = allNews.filter(p => p.category === "news").slice(0, 4);
    }
  } catch (e) {
    console.warn("Could not fetch news for briefing widget");
  }

  // Fetch dynamic categories
  let categories = [];
  try {
    const res = await fetch("http://127.0.0.1:8000/education-categories/", { next: { revalidate: 60 } });
    if (res.ok) {
      categories = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch education categories", err);
  }

  // Find Introductory category
  const introCategory = categories.find((c) => c.name.toLowerCase() === "introductory");
  
  // Find Hero Post (first post in introductory category)
  let heroPost = null;
  if (introCategory) {
    heroPost = eduPosts.find((p) => p.education_category === introCategory.id);
  }
  
  // If no hero post is found in 'Introductory', fallback to the latest education post
  if (!heroPost && eduPosts.length > 0) {
    heroPost = eduPosts[0];
  }

  // Default fallback if no posts at all
  if (!heroPost) {
    heroPost = {
      title: "Structural Signals: The New Era of Market Dynamics",
      subtitle: "How institutional liquidity is reshaping traditional technical patterns in modern electronic markets.",
      slug: "#",
      featured_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
      author: "David Arnaud"
    };
  }

  // Filter out the introductory category for the remaining dynamic sections
  const sections = categories.filter((c) => c.name.toLowerCase() !== "introductory");

  return (
    <div className={styles.body}>
      <main className={styles.main}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroEyebrow}>Intelligence Hub</span>
            <h1 className={styles.heroTitle}>
              Institutional Market Intelligence
            </h1>
            <p className={styles.heroSubtitle}>
              Unbiased strategic guides, deep technical analysis, and
              macroeconomic insights for the sophisticated investor.
            </p>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {/* Featured Content (Hero Post) */}
            <section className={styles.featuredSection}>
              <Link href={heroPost.slug === "#" ? "#" : `/education/${heroPost.slug}`} className="block group">
                <div className={`${styles.featuredCard} overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-400`}>
                  <img
                    className={`${styles.featuredImg} transition-transform duration-700 group-hover:scale-105`}
                    src={heroPost.featured_image || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"}
                    alt={heroPost.title}
                  />
                  <div className={styles.featuredOverlay} />
                  <div className={styles.featuredContent}>
                    <span className={styles.featuredBadge}>
                      Featured Analysis
                    </span>
                    <h2 className={`${styles.featuredTitle} transition-colors duration-200 group-hover:text-blue-100`}>
                      {heroPost.title}
                    </h2>
                    <p className={styles.featuredDesc}>
                      {heroPost.subtitle || "In-depth analysis of structural signals."}
                    </p>
                    <div className={styles.featuredMeta}>
                      <span>EST. READ 5 MIN</span>
                      <span className={styles.dot} />
                      <span>BY {heroPost.author || "MoneyGreeks"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* Dynamic Categories */}
            {sections.map((category, index) => {
              // Get posts for this category, limit to 3
              const categoryPosts = eduPosts
                .filter((p) => p.education_category === category.id)
                .slice(0, 3);

              if (categoryPosts.length === 0) return null; // Don't render empty categories

              // Alternate styles for visual interest (like the original)
              const isGrayscale = index % 2 !== 0;

              return (
                <section key={category.id} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>{category.name}</h3>
                    <Link href={`/education/category/${category.slug}`} className={styles.viewAll}>
                      VIEW ALL
                    </Link>
                  </div>
                  <div className={styles.cardGrid}>
                    {categoryPosts.map((item) => (
                      <Link
                        href={`/education/${item.slug}`}
                        className={`${styles.card} ${isGrayscale ? styles.cardGrayscale : ""} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                        key={item.slug}
                      >
                        <div className={`${styles.cardImgWrapper} overflow-hidden`}>
                          <img
                            alt={item.title}
                            className={`${styles.cardImg} transition-transform duration-500 group-hover:scale-105`}
                            src={item.featured_image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"}
                          />
                        </div>
                        <div className={styles.cardBody}>
                          <span className={styles.cardTag}>{category.name}</span>
                          <h4 className={`${styles.cardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                            {item.title}
                          </h4>
                          <div className={styles.cardMeta}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                              schedule
                            </span>
                            <span>{item.time || "5 MIN"}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Optional Ad Slot at bottom */}
            <div className={styles.adMid}>
              <div className={`${styles.adPlaceholder} ${styles.adMidInner}`}>
                <span className={styles.adLabel}>
                  Featured Partner Spotlight
                </span>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              {/* Sidebar Ad */}
              <div className={`${styles.adPlaceholder} ${styles.adSidebar}`}>
                <span className={`${styles.adLabel} ${styles.adLabelCenter}`}>
                  Institutional Partnership Slot
                </span>
              </div>

              {/* Intelligence Briefing — live news */}
              <div className={styles.briefingCard}>
                <h5 className={styles.briefingTitle}>Intelligence Briefing</h5>
                <ul className={styles.briefingList}>
                  {latestNews.length > 0 ? latestNews.map((post) => (
                    <li key={post.slug} className={styles.briefingItem}>
                      <Link href={`/news-today/${post.slug}`}>
                        <span className={styles.briefingTag}>
                          {post.news_placement || post.category?.toUpperCase() || "NEWS"}
                        </span>
                        <p className={styles.briefingItemTitle}>{post.title}</p>
                        <p className={styles.briefingTime}>
                          {post.date
                            ? new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
                            : new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
                          }
                        </p>
                      </Link>
                    </li>
                  )) : (
                    <li className={styles.briefingItem}>
                      <p className={styles.briefingItemTitle} style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                        No recent briefings available.
                      </p>
                    </li>
                  )}
                </ul>
              </div>

              {/* Newsletter */}
              <NewsletterSidebarWidget />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
