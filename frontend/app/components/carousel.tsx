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
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* 🔹 Touch tracking */
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 60;

  /* =========================
     Fetch Slides
  ========================== */
  useEffect(() => {
    async function loadSlides() {
      try {
        const [reportRes, blogRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/report-list/", { cache: "no-store" }),
          fetch("http://127.0.0.1:8000/blog-post/", { cache: "no-store" }),
        ]);

        const reports = await reportRes.json();
        const blogs = await blogRes.json();

        const generatedSlides: Slide[] = [
          {
            id: 1,
            image: reports[0]?.image_url,
            tag: "Pre-Market Report",
            title: reports[0]?.title,
            description: reports[0]?.overall_conclusion,
            slug: reports[0]?.slug,
            type: "report",
          },
          ...blogs.slice(0, 2).map((post: any, index: number) => ({
            id: index + 2,
            image: post.featured_image,
            tag: "Blog",
            title: post.title,
            description: post.subtitle,
            slug: post.slug,
            type: "blog",
          })),
        ];

        setSlides(generatedSlides);
      } catch (error) {
        console.error("Carousel data fetch error:", error);
      }
    }

    loadSlides();
  }, []);

  /* =========================
     Slide Controls
  ========================== */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  /* =========================
     Auto Slide
  ========================== */
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  /* =========================
     Swipe Handlers
  ========================== */
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
      nextSlide(); // swipe left
    }

    if (distance < -SWIPE_THRESHOLD) {
      prevSlide(); // swipe right
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const href =
          slide.type === "report"
            ? `/market-data/${slide.slug}`
            : `/blog-post/${slide.slug}`;

        return (
          <Link
            key={slide.id}
            href={href}
            className={`absolute inset-0 transition-opacity duration-700 lg:m-4 lg:rounded-lg overflow-hidden cursor-pointer ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Background Image */}
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

            {/* Content */}
            <div className="relative h-full max-w-7xl px-6 sm:px-8 lg:px-12 flex items-center">
              <div className="max-w-2xl text-white">
                <span className="text-sm uppercase tracking-wider">
                  {slide.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg text-gray-200">
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
