"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  slug: string;
  type: "report" | "blog";
  category?: string;
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 60;

  useEffect(() => {
    async function loadSlides() {
      try {
        const [reportRes, blogRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/report-list/`, { cache: "no-store" }).catch(() => null),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/`, { cache: "no-store" }).catch(() => null),
        ]);

        if (!reportRes || !blogRes || !reportRes.ok || !blogRes.ok) {
          throw new Error("Backend unavailable");
        }

        const reports = await reportRes.json();
        const blogs = await blogRes.json();

        // Check if both APIs returned successfully but are completely empty
        if ((!reports || reports.length === 0) && (!blogs || blogs.length === 0)) {
          setSlides([]);
          return;
        }

        const generatedSlides: Slide[] = [];
        if (reports && reports.length > 0) {
          generatedSlides.push({
            id: 1,
            image: reports[0]?.image_url,
            tag: "Pre-Market Report",
            title: reports[0]?.title,
            description: reports[0]?.overall_conclusion,
            slug: reports[0]?.slug,
            type: "report",
          });
        }

        if (blogs && blogs.length > 0) {
          generatedSlides.push(
            ...blogs.slice(0, 2).map((post: any, index: number) => ({
              id: index + 2,
              image: post.featured_image,
              tag: post.category || "Blog",
              title: post.title,
              description: post.subtitle,
              slug: post.slug,
              type: "blog",
              category: post.category,
            }))
          );
        }

        setSlides(generatedSlides);
      } catch (error) {
        console.warn("Carousel data fetch error, falling back to demo data:", error);
        setSlides([
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
            tag: "Pre-Market Report",
            title: "Market Setup: Key Levels to Watch",
            description: "A comprehensive look at today's market drivers.",
            slug: "#",
            type: "report",
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
            tag: "Blog",
            title: "Understanding Market Liquidity",
            description: "How institutional flows impact intraday volatility.",
            slug: "#",
            type: "blog",
          }
        ]);
      }
    }

    loadSlides();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > SWIPE_THRESHOLD) {
      nextSlide();
    }

    if (distance < -SWIPE_THRESHOLD) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides.length) return null;

  const getSlideUrl = (slide: Slide) => {
    if (slide.type === "report") return `/market-data/${slide.slug}`;
    if (slide.category === "news") return `/news-today/${slide.slug}`;
    if (slide.category === "education") return `/education/${slide.slug}`;
    return `/blog-post/${slide.slug}`;
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const href = getSlideUrl(slide);

        return (
          <Link
            key={slide.id}
            href={href}
            className={`absolute inset-0 transition-opacity duration-700 lg:mx-2 lg:my-2 lg:rounded-lg overflow-hidden cursor-pointer ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
            </div>

            <div className="relative h-full max-w-7xl px-6 sm:px-8 lg:px-12 flex items-center">
              <div className="max-w-2xl text-white">
                <span className="text-sm uppercase tracking-wider">
                  {slide.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg text-gray-200 line-clamp-3">
                  {slide.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}

      {/* 🔹 Arrows (Desktop only) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 items-center justify-center z-20"
      >
        <ChevronLeft className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 items-center justify-center z-20"
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
