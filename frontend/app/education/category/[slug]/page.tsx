import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { fetchPostsByCategory } from "../../../utils/api";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let category: any = null;
  try {
    const res = await fetch(`http://127.0.0.1:8000/education-categories/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (res.ok) category = await res.json();
  } catch (error) {
    console.error("Failed to fetch category details", error);
  }

  const eduPosts = (await fetchPostsByCategory("education")) || [];
  const categoryPosts = category
    ? eduPosts.filter((post: any) => post.education_category === category.id)
    : [];

  if (!category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--mg-bg)] px-4">
        <div className="max-w-md rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-8 text-center shadow-[var(--mg-shadow)]">
          <h1 className="font-heading text-3xl font-semibold text-[var(--mg-text)]">Category not found</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--mg-text-muted)]">
            The category you are looking for does not exist.
          </p>
          <Link href="/education" className="mt-6 inline-flex rounded-full bg-[var(--mg-accent)] px-4 py-2.5 text-sm font-medium text-white">
            Back to Education Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <div className="mx-auto max-w-[var(--mg-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-10 border-b border-[var(--mg-border)] pb-8">
          <Link href="/education" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Intelligence Hub
          </Link>
          <h1 className="mt-5 font-heading text-4xl font-semibold tracking-normal text-[var(--mg-text)]">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--mg-text-muted)]">
              {category.description}
            </p>
          )}
        </header>

        {categoryPosts.length === 0 ? (
          <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-10 text-center shadow-[var(--mg-shadow)]">
            <h2 className="font-heading text-xl font-semibold text-[var(--mg-text)]">No articles yet</h2>
            <p className="mt-2 text-sm text-[var(--mg-text-muted)]">
              Check back later for new {category.name.toLowerCase()} content.
            </p>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryPosts.map((item: any) => (
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
                  <h2 className="mt-4 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
                    {item.title}
                  </h2>
                  {item.subtitle && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--mg-text-muted)]">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-2 text-xs text-[var(--mg-text-soft)]">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{item.time || "5 min read"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
