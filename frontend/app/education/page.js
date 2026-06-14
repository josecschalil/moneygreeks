import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Newspaper } from "lucide-react";
import NewsletterSidebarWidget from "@/app/components/NewsletterSidebarWidget";
import { fetchPostsByCategory } from "../utils/api";

export default async function IntelligenceHub() {
  const eduPosts = (await fetchPostsByCategory("education")) || [];

  let latestNews = [];
  try {
    const newsRes = await fetch("http://127.0.0.1:8000/blog-post/?category=news", {
      next: { revalidate: 60 },
    });
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      const allNews = Array.isArray(newsData) ? newsData : newsData.results || [];
      latestNews = allNews.filter((post) => post.category === "news").slice(0, 4);
    }
  } catch (error) {
    console.warn("Could not fetch news for briefing widget", error);
  }

  let categories = [];
  try {
    const res = await fetch("http://127.0.0.1:8000/education-categories/", {
      next: { revalidate: 60 },
    });
    if (res.ok) categories = await res.json();
  } catch (error) {
    console.error("Failed to fetch education categories", error);
  }

  const introCategory = categories.find((category) => category.name.toLowerCase() === "introductory");
  let heroPost = introCategory
    ? eduPosts.find((post) => post.education_category === introCategory.id)
    : null;

  if (!heroPost && eduPosts.length > 0) heroPost = eduPosts[0];
  if (!heroPost) {
    heroPost = {
      title: "Structural Signals: The New Era of Market Dynamics",
      subtitle: "How institutional liquidity is reshaping traditional technical patterns in modern electronic markets.",
      slug: "#",
      featured_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
      author: "MoneyGreeks",
    };
  }

  const sections = categories.filter((category) => category.name.toLowerCase() !== "introductory");

  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <section className="border-b border-[var(--mg-border)] bg-[var(--mg-surface)]">
        <div className="mx-auto max-w-[var(--mg-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mg-border)] bg-[var(--mg-surface-soft)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-muted)]">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Intelligence Hub
          </div>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-semibold leading-tight text-[var(--mg-text)] md:text-6xl">
            Institutional market intelligence, taught clearly.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--mg-text-muted)] md:text-lg">
            Strategic guides, technical analysis, and macro context for investors who value structure, patience, and clarity.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[var(--mg-container)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-12">
        <div className="space-y-10">
          <section>
            <Link href={heroPost.slug === "#" ? "#" : `/education/${heroPost.slug}`} className="group block">
              <article className="relative min-h-[420px] overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)]">
                <img
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  src={heroPost.featured_image || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f"}
                  alt={heroPost.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-black/6" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="inline-flex rounded-full bg-white/92 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text)]">
                    Featured analysis
                  </span>
                  <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">
                    {heroPost.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                    {heroPost.subtitle || "In-depth analysis of structural signals."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-white/72">
                    <span>5 min read</span>
                    <span>By {heroPost.author || "MoneyGreeks"}</span>
                  </div>
                </div>
              </article>
            </Link>
          </section>

          {sections.map((category) => {
            const categoryPosts = eduPosts
              .filter((post) => post.education_category === category.id)
              .slice(0, 3);

            if (categoryPosts.length === 0) return null;

            return (
              <section key={category.id}>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
                      Curriculum
                    </p>
                    <h3 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
                      {category.name}
                    </h3>
                  </div>
                  <Link href={`/education/category/${category.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
                    View all
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {categoryPosts.map((item) => (
                    <Link
                      href={`/education/${item.slug}`}
                      className="group overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]"
                      key={item.slug}
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-[var(--mg-surface-muted)]">
                        <img
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          src={item.featured_image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"}
                        />
                      </div>
                      <div className="p-5">
                        <span className="rounded-full bg-[var(--mg-surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--mg-text-muted)]">
                          {category.name}
                        </span>
                        <h4 className="mt-4 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
                          {item.title}
                        </h4>
                        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--mg-text-soft)]">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span>{item.time || "5 min read"}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
            <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-[var(--mg-text)]">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Intelligence Briefing
            </h2>
            <ul className="mt-4 divide-y divide-[var(--mg-border)]">
              {latestNews.length > 0 ? (
                latestNews.map((post) => (
                  <li key={post.slug} className="py-4 first:pt-0 last:pb-0">
                    <Link href={`/news-today/${post.slug}`} className="group block">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--mg-text-soft)]">
                        {post.news_placement || post.category?.toUpperCase() || "NEWS"}
                      </span>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--mg-text-soft)]">
                        {post.date
                          ? new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-4 text-sm text-[var(--mg-text-soft)]">No recent briefings available.</li>
              )}
            </ul>
          </section>

          <NewsletterSidebarWidget />
        </aside>
      </div>
    </main>
  );
}
