import Image from "next/image";
import HeroCarousel from "./components/carousel";
import BlogPostsGrid from "./components/recents";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <BlogPostsGrid />
    </>
  );
}
