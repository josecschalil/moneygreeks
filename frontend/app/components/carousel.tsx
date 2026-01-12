"use client";

import { useEffect, useState } from "react";
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

  // Fetch data and build slides
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
          // Slide 1 — Pre-Market Report
          {
            id: 1,
            image: reports[0]?.image_url,
            tag: "Pre-Market Report",
            title: reports[0]?.title,
            description: reports[0]?.overall_conclusion,
            slug: reports[0]?.slug,
            type: "report",
          },

          // Slide 2 & 3 — Blog Posts
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white">
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
                ? "opacity-100 pointer-events-auto z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl px-6 pt-6 sm:px-8 lg:px-12 flex items-center">
              <div className="max-w-2xl text-white">
                <span className="text-sm font-medium uppercase tracking-wider">
                  {slide.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center z-20"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center z-20"
      >
        <ChevronRight className="w-6 h-6 text-white" />
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
