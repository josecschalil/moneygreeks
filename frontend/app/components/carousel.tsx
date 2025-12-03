"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
      tag: "Featured",
      title:
        "Breaking Into Product Design: Advice from Untitled Founder, Frankie",
      description:
        "Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design. We sat down with Frankie Sullivan to talk about gatekeeping in product design and how anyone can get into this growing industry.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
      tag: "Trending",
      title: "Building Better User Experiences: A Guide to Modern Design",
      description:
        "Discover the principles and practices that leading designers use to create exceptional user experiences. Learn how to apply these insights to your own projects.",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
      tag: "Spotlight",
      title: "The Future of Remote Work: Insights from Industry Leaders",
      description:
        "Explore how companies are adapting to the new era of remote work and what it means for the future of collaboration and productivity in tech.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 lg:m-4 lg:rounded-lg overflow-hidden ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 ">
            <Image
              src={slide.image}
              alt={slide.title}
              fill // <--- Must be present for container-based sizing
              style={{ objectFit: "cover" }} // <--- Replace 'object-cover' class
              priority={index === 0} // Optional: Helps with Largest Contentful Paint (LCP)
              sizes="100vw" // Tells the browser the image will span the full viewport width
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl lg:bottom-0 px-6 pt-6 sm:px-8 lg:px-12 flex items-center">
            <div className="max-w-2xl text-white">
              {/* Tag */}
              <div className="inline-block mb-4">
                <span className="text-sm font-medium tracking-wider uppercase">
                  {slide.tag}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-transparent bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8   top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-transparent  bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
