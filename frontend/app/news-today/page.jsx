import styles from "./MarketInsight.module.css";
import PageTracker from "../components/PageTracker";
import HeroSection from "../components/HeroSection";
import LatestIntelligence from "../components/LatestIntelligence";
import DeepDiveSection from "../components/DeepDiveSection";
import TrendingTopics from "../components/TrendingTopics";
import AdvancedMarketFeed from "../components/AdvancedMarketFeed";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchSection(placement, limit) {
  try {
    const url = placement
      ? `${API}/news-posts/?placement=${placement}&limit=${limit}`
      : `${API}/news-posts/?limit=${limit}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch {
    return [];
  }
}

export default async function MarketInsightPage() {
  // Fetch all sections in parallel — only the exact count needed per section
  const [
    heroArr,
    latestPosts,
    deepDivePosts,
    feedPosts,
    quickHitPosts,
    breakingPosts,
    mostReadArr,
  ] = await Promise.all([
    fetchSection("hero", 1),
    fetchSection("latest", 3),
    fetchSection("deep_dive", 3),
    fetchSection("live_feed", 20),
    fetchSection("quick_hit", 15),
    fetchSection("breaking", 3),
    fetchSection(null, 5),   // most read — all news, sorted by view_count below
  ]);

  // Hero: use explicit hero post; fall back to most recent across all placements
  let heroPost = heroArr[0] || null;

  // If no hero post tagged, fall back to newest post overall
  if (!heroPost) {
    const fallbackArr = await fetchSection(null, 1);
    heroPost = fallbackArr[0] || null;
  }

  // Most read: sort by view_count from the latest 5 fetched
  const mostReadPosts = [...mostReadArr].sort(
    (a, b) => (b.view_count || 0) - (a.view_count || 0),
  );

  // If API is completely unreachable on all fetches, show fallback
  const allEmpty =
    !heroPost &&
    !latestPosts.length &&
    !deepDivePosts.length &&
    !feedPosts.length;

  if (allEmpty) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <HeroSection post={null} />
          <LatestIntelligence posts={[]} />
          <DeepDiveSection posts={[]} mostRead={[]} />
          <TrendingTopics />
          <AdvancedMarketFeed feedPosts={[]} quickHits={[]} breakingPosts={[]} />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageTracker pageType="news_today" pageSlug="news-today" pageTitle="News Today" />
      <main className={styles.main}>
        <HeroSection post={heroPost} />
        <LatestIntelligence posts={latestPosts} />
        <DeepDiveSection posts={deepDivePosts} mostRead={mostReadPosts} />
        <TrendingTopics />
        <AdvancedMarketFeed
          feedPosts={feedPosts}
          quickHits={quickHitPosts}
          breakingPosts={breakingPosts}
        />
      </main>
    </div>
  );
}
