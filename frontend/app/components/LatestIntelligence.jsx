import { latestArticles } from "../news-today/data";
import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function LatestIntelligence({ posts }) {
  const displayPosts = posts?.length ? posts : latestArticles;

  return (
    <section>
      <SectionHeader title="Latest Intelligence" viewAll />
      <div className="grid gap-5 md:grid-cols-3">
        {displayPosts.map((article, index) => (
          <ArticleCard key={article.slug || index} article={article} />
        ))}
      </div>
    </section>
  );
}
