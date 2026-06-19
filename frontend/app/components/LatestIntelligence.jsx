import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function LatestIntelligence({ posts }) {
  if (!posts?.length) return null;

  return (
    <section>
      <SectionHeader title="Latest Intelligence" viewAll />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((article, index) => (
          <ArticleCard key={article.slug || index} article={article} />
        ))}
      </div>
    </section>
  );
}
