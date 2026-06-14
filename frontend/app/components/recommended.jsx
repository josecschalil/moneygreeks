"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const RECOMMENDED_POSTS = [
  {
    id: 1,
    slug: "scalable-design-systems",
    title: "The Architecture of Scalable Design Systems",
    category: "Design",
    readTime: "6 min read",
    date: "Feb 10, 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 2,
    slug: "writing-clean-apis",
    title: "Writing Clean APIs That Developers Actually Love",
    category: "Engineering",
    readTime: "8 min read",
    date: "Feb 7, 2026",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  },
  {
    id: 3,
    slug: "performance-patterns",
    title: "Performance Patterns in Modern Web Applications",
    category: "Performance",
    readTime: "5 min read",
    date: "Feb 3, 2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
  },
  {
    id: 4,
    slug: "accessible-typography",
    title: "The Quiet Craft of Accessible Typography",
    category: "Accessibility",
    readTime: "4 min read",
    date: "Jan 28, 2026",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80",
  },
];

async function fetchBlogPostData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/blog-post/", {
      cache: "no-store",
    });
    if (!res.ok) return RECOMMENDED_POSTS;
    return await res.json();
  } catch (error) {
    console.warn("Backend blog-post endpoint unavailable. Using local fallback recommended posts.", error);
    return RECOMMENDED_POSTS;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PostCard({ post }) {
  return (
    <Link href={`/blog-post/${post.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mg-surface-muted)]">
          <img
            src={post.featured_image || post.image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[var(--mg-text-muted)]">
            {post.category || "Markets"}
          </span>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--mg-text-soft)]">
            <span>{formatDate(post.created_at || post.date)}</span>
            <span>{post.readTime || "5 min read"}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
            {post.title}
          </h3>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text)]">
            Read more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function RecommendedPosts() {
  const [posts, setPosts] = useState(RECOMMENDED_POSTS);

  useEffect(() => {
    fetchBlogPostData().then((data) => {
      setPosts(Array.isArray(data) ? data.slice(0, 4) : RECOMMENDED_POSTS);
    });
  }, []);

  return (
    <section className="mx-auto max-w-[var(--mg-container)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
            Continue Reading
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
            Recommended for You
          </h2>
        </div>
        <Link href="/blog-archive" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
          View all posts
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.slug || post.id || post.title} post={post} />
        ))}
      </div>
    </section>
  );
}
