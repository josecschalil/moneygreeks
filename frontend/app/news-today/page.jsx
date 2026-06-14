import AdvancedMarketFeed from "../components/AdvancedMarketFeed";
import DeepDiveSection from "../components/DeepDiveSection";
import HeroSection from "../components/HeroSection";
import LatestIntelligence from "../components/LatestIntelligence";
import TrendingTopics from "../components/TrendingTopics";
import { fetchPostsByCategory } from "../utils/api";

export default async function MarketInsightPage() {
  const newsPosts = (await fetchPostsByCategory("news")) || [];

  const heroPost = newsPosts.find((post) => post.news_placement === "hero") || newsPosts[0];
  const latestPosts = newsPosts.filter((post) => post.news_placement === "latest").slice(0, 3);
  const deepDivePosts = newsPosts.filter((post) => post.news_placement === "deep_dive").slice(0, 2);
  const feedPosts = newsPosts.filter((post) => post.news_placement === "live_feed");
  const quickHitPosts = newsPosts.filter((post) => post.news_placement === "quick_hit");
  const breakingPosts = newsPosts.filter((post) => post.news_placement === "breaking").slice(0, 2);
  const mostReadPosts = [...newsPosts]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <div className="mx-auto max-w-[var(--mg-container)] space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <HeroSection post={heroPost} />
        <LatestIntelligence posts={latestPosts} />
        <DeepDiveSection posts={deepDivePosts} mostRead={mostReadPosts} />
        <TrendingTopics />
        <AdvancedMarketFeed
          feedPosts={feedPosts}
          quickHits={quickHitPosts}
          breakingPosts={breakingPosts}
        />
      </div>
    </main>
  );
}
