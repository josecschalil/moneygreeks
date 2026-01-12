import Image from "next/image";
import { notFound } from "next/navigation";

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

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-8 border-b">
        <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm">
          {post.category}
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mt-4">{post.title}</h1>

        <p className="text-xl text-gray-600 mt-4">{post.subtitle}</p>

        <time className="block text-sm text-gray-500 mt-4">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
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
      </div>
    </article>
  );
}
