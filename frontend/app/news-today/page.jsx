import styles from "./MarketInsight.module.css";
import HeroSection from "../components/HeroSection";
import LatestIntelligence from "../components/LatestIntelligence";
import DeepDiveSection from "../components/DeepDiveSection";
import TrendingTopics from "../components/TrendingTopics";
import AdvancedMarketFeed from "../components/AdvancedMarketFeed";
import { fetchPostsByCategory } from "../utils/api";

export default async function MarketInsightPage() {
  const newsPosts = await fetchPostsByCategory("news") || [];

  const heroPost = newsPosts.find((p) => p.news_placement === "hero") || newsPosts[0];
  const latestPosts = newsPosts.filter((p) => p.news_placement === "latest").slice(0, 3);
  const deepDivePosts = newsPosts.filter((p) => p.news_placement === "deep_dive").slice(0, 2);
  const feedPosts = newsPosts.filter((p) => p.news_placement === "live_feed");
  const quickHitPosts = newsPosts.filter((p) => p.news_placement === "quick_hit");
  const breakingPosts = newsPosts.filter((p) => p.news_placement === "breaking").slice(0, 2);

  const mostReadPosts = [...newsPosts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);

  return (
    <div className={styles.page}>
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
