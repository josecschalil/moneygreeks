"use client";

import { useState } from "react";
async function fetchBlogPostData() {
  const res = await fetch("http://127.0.0.1:8000/blog-post/", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch blog post data");
  }
  return res.json();
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
const blogPostData = await fetchBlogPostData();
const blogPostDataSlice = blogPostData.slice(0, 4);

const RECOMMENDED_POSTS = [
  {
    id: 1,
    title: "The Architecture of Scalable Design Systems",
    category: "Design",
    readTime: "6 min read",
    date: "Feb 10, 2026",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 2,
    title: "Writing Clean APIs That Developers Actually Love",
    category: "Engineering",
    readTime: "8 min read",
    date: "Feb 7, 2026",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  },
  {
    id: 3,
    title: "Performance Patterns in Modern Web Applications",
    category: "Performance",
    readTime: "5 min read",
    date: "Feb 3, 2026",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
  },
  {
    id: 4,
    title: "The Quiet Craft of Accessible Typography",
    category: "Accessibility",
    readTime: "4 min read",
    date: "Jan 28, 2026",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80",
  },
];

function PostCard({ post }) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .post-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e8e4de;
          border-radius: 2px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
          position: relative;
        }

        .post-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.09);
          transform: translateY(-4px);
          border-color: #c8c2b8;
        }

        .card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #f2ede8;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }

        .post-card:hover .card-image {
          transform: scale(1.04);
        }

        .card-category-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #ffffff;
          border: 1px solid #e0dbd4;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b6560;
          padding: 4px 9px;
        }

        .card-body {
          padding: 20px 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #a09890;
          font-weight: 400;
        }

        .meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #c8c2b8;
          display: inline-block;
          flex-shrink: 0;
        }

        .card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.45;
          color: #1a1714;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .card-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #1a1714;
          text-decoration: none;
          margin-top: auto;
          padding-top: 6px;
          border-top: 1px solid #f0ebe4;
          transition: gap 0.25s ease;
        }

        .card-read-more:hover {
          gap: 10px;
        }

        .arrow-icon {
          width: 14px;
          height: 14px;
          transition: transform 0.25s ease;
        }

        .post-card:hover .arrow-icon {
          transform: translateX(2px);
        }
      `}</style>

      <article
        className="post-card"
        onClick={() => (window.location.href = `/blog-post/${post.slug}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="card-image-wrap">
          <img
            src={post.featured_image}
            alt={post.title}
            className="card-image"
          />
          <span className="card-category-pill">{post.category}</span>
        </div>

        <div className="card-body">
          <div className="card-meta">
            <span>{formatDate(post.created_at)}</span>
            <span className="meta-dot" />
            <span>5 min read</span>
          </div>

          <h3 className="card-title">{post.title}</h3>

          <a href={`/blog-post/${post.slug}`} className="card-read-more">
            Read More
            <svg
              className="arrow-icon"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8H14M14 8L9 3M14 8L9 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </article>
    </>
  );
}

export default function RecommendedPosts({ posts = blogPostDataSlice }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .rp-section {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 72px 24px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        .rp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e8e4de;
          gap: 16px;
          flex-wrap: wrap;
        }

        .rp-header-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rp-eyebrow {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9b8f84;
        }

        .rp-eyebrow-line {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .eyebrow-rule {
          width: 24px;
          height: 1px;
          background: #c8c2b8;
          display: inline-block;
        }

        .rp-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 700;
          color: #1a1714;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .rp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #1a1714;
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.2s ease;
        }

        .rp-view-all:hover {
          opacity: 0.6;
        }

        .rp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .rp-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .rp-grid {
            grid-template-columns: 1fr;
          }

          .rp-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <section className="rp-section" aria-labelledby="rp-heading">
        <div className="rp-header">
          <div className="rp-header-left">
            <span className="rp-eyebrow-line">
              <span className="eyebrow-rule" />
              <span className="rp-eyebrow">Continue Reading</span>
            </span>
            <h2 className="rp-heading" id="rp-heading">
              Recommended for You
            </h2>
          </div>

          <a href="/blog-archive" className="rp-view-all">
            View All Posts
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8H14M14 8L9 3M14 8L9 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="rp-grid">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
