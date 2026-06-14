import { latestArticles } from "./data";
import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function LatestIntelligence({ posts }) {
  const displayPosts = posts || latestArticles;
  return (
    <section className="mb-20">
      <SectionHeader title="Latest Intelligence" viewAll />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayPosts.map((article, i) => (
          <ArticleCard key={article.slug || i} article={article} />
        ))}
      </div>
    </section>
  );
}
