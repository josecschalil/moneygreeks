// app/blog/page.jsx
// Blog page that accepts plain text content from Django TextField
import Image from "next/image";

// Metadata for SEO
export const metadata = {
  title: "The Future of Modern Web Development | Your Blog",
  description: "Exploring the latest trends and technologies shaping the web",
  authors: [{ name: "Jane Smith" }],
  openGraph: {
    title: "The Future of Modern Web Development",
    description: "Exploring the latest trends and technologies shaping the web",
    type: "article",
    publishedTime: "2024-01-10",
    authors: ["Jane Smith"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
        width: 1200,
        height: 600,
        alt: "Modern Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Future of Modern Web Development",
    description: "Exploring the latest trends and technologies shaping the web",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
    ],
  },
};

// Server Component
export default function BlogPost() {
  const post = {
    title: "The Future of Modern Web Development",
    subtitle: "Exploring the latest trends and technologies shaping the web",
    author: {
      name: "Jane Smith",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      bio: "Senior Software Engineer & Technical Writer with over 10 years of experience building web applications.",
    },
    publishedAt: "2024-01-10",
    readTime: "8 min read",
    category: "Technology",
    featuredImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",

    // Plain text content from Django TextField - just paste your text here
    content: `The landscape of web development continues to evolve at a rapid pace, bringing new tools, frameworks, and methodologies that reshape how we build digital experiences. In this comprehensive guide, we'll explore the cutting-edge technologies that are defining the future of web development.

React Server Components represent a paradigm shift in how we think about rendering and data fetching. By allowing components to run exclusively on the server, we can reduce JavaScript bundle sizes and improve initial page load times significantly.

This approach enables developers to fetch data directly in components without client-side waterfalls, access backend resources securely without exposing credentials, keep large dependencies on the server reducing bundle size, and improve SEO with better server-side rendering capabilities.

Modern web applications demand exceptional performance. Users expect fast, responsive experiences regardless of their device or network conditions. Here are key strategies that leading developers are implementing.

Images often account for the majority of page weight. Next.js's Image component automatically optimizes images by serving them in modern formats like WebP and AVIF, implementing lazy loading, and providing responsive images for different screen sizes.

Breaking down your application into smaller chunks and loading them on demand can dramatically improve initial load times. Dynamic imports and route-based code splitting ensure users only download what they need.

Great developer experience leads to better products. Modern frameworks prioritize DX through features like hot module replacement, excellent error messages, and intuitive APIs. When developers are productive and happy, they build better applications faster.

As we move forward, the web will continue to become more capable, more performant, and more accessible. Edge computing, WebAssembly, and progressive web apps are just the beginning. The future is bright for web developers willing to embrace change and continuous learning.

Whether you're building a simple blog or a complex application, understanding these modern patterns and practices will help you create better experiences for your users. The key is to stay curious, keep experimenting, and never stop learning.`,
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-6 md:pb-8">
        <div className="mb-4 md:mb-6">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-gray-100 text-gray-700 text-xs md:text-sm font-medium rounded-full">
            {post.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
          {post.subtitle}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 md:gap-4 pb-6 md:pb-8 border-b border-gray-200">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={48}
            height={48}
            className="rounded-full md:w-14 md:h-14"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm md:text-base">
              {post.author.name}
            </p>
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Blog Content - Plain Text with Paragraphs */}
      <div className="max-w-4xl mx-auto px-4 md:px-1 pb-12 md:pb-20">
        <div className="text-gray-900 text-base md:text-lg leading-relaxed space-y-4 md:space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-gray-900">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Author Bio */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200 md:mr-30">
          <div className="flex gap-3 md:gap-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full md:w-20 md:h-20"
            />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                About {post.author.name}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
