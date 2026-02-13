import Image from "next/image";
import { notFound } from "next/navigation";
import { User, Calendar, Clock } from "lucide-react";
async function getBlogPost(slug) {
  if (!slug) notFound();

  const res = await fetch(`http://127.0.0.1:8000/blog-post/${slug}/`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  return res.json();
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug) {
    return { title: "Blog Post | MoneyGreeks" };
  }

  const post = await getBlogPost(slug);

  return {
    title: `${post.title} | MoneyGreeks`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: "article",
      publishedTime: post.created_at,
      images: [
        {
          url: post.featured_image,
          width: 1200,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
      images: [post.featured_image],
    },
  };
}

export default async function BlogPostPage(props) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug) notFound();

  const post = await getBlogPost(slug);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.created_at));

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-8 border-b">
        <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm">
          {post.category}
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mt-4">{post.title}</h1>

        <p className="text-xl text-gray-600 mt-4">{post.subtitle}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb- mt-3">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>JOSE C S</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <time
              dateTime={post.created_at}
              className="block text-sm text-gray-500"
            >
              {formattedDate}
            </time>
          </div>

          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 my-12">
        <div className="relative h-[450px] rounded-xl overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-6 text-lg leading-relaxed text-gray-900">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="w-full max-w-6xl mx-auto p-4">
          <h1 className="text-xl font-bold mb-4 mt-5 text-gray-900">
            About Author
          </h1>
          <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-700 text-xl font-bold">
                  JC
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Jose C S
                </h2>
                <p className="text-md text-gray-700 mb-4">
                  Founder, CEO MoneyGreeks
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Jose is a technical analyst, market researcher, educator and
                  trader with 5+ years of experience. He is an expert in the
                  area of patterns, price and time analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
