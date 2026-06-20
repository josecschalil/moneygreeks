"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";

interface ContentBlock {
  type: "h1" | "paragraph" | "image";
  text?: string;
  url?: string;
  caption?: string;
}

import { Suspense } from "react";

function PostEditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editSlug = searchParams.get("slug");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editSlug);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    category: searchParams.get("category") || "education",
    featured_image: "",
    author: "MoneyGreeks Team",
    authorDesignation: "Market Analyst",
    education_category: "",
    news_placement: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [keyHighlights, setKeyHighlights] = useState<string[]>([""]);
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [eduCategories, setEduCategories] = useState<any[]>([]);

  useEffect(() => {
    if (editSlug) {
      fetchPostData();
    }
    fetchEduCategories();
  }, [editSlug]);

  const fetchEduCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/`);
      if (res.ok) {
        setEduCategories(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch education categories");
    }
  };

  const fetchPostData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/${editSlug}/`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          slug: data.slug || "",
          category: data.category || "education",
          featured_image: data.featured_image || "",
          author: data.author || "MoneyGreeks Team",
          authorDesignation: data.authorDesignation || "Market Analyst",
          education_category: data.education_category || "",
          news_placement: data.news_placement || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          meta_keywords: data.meta_keywords || "",
        });
        setKeyHighlights(data.keyHighlights && data.keyHighlights.length ? data.keyHighlights : [""]);
        setContent(data.content || []);
      } else {
        setError("Failed to fetch post data for editing.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching post data.");
    } finally {
      setFetching(false);
    }
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...keyHighlights];
    newHighlights[index] = value;
    setKeyHighlights(newHighlights);
  };

  const addHighlight = () => setKeyHighlights([...keyHighlights, ""]);
  const removeHighlight = (index: number) => {
    setKeyHighlights(keyHighlights.filter((_, i) => i !== index));
  };

  const addContentBlock = (type: "h1" | "paragraph" | "image") => {
    setContent([...content, { type, text: "", url: "", caption: "" }]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseMarkdown(text);
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  const parseMarkdown = (md: string) => {
    // Title
    const titleMatch = md.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Subtitle
    const subtitleMatch = md.match(/\*\*Subtitle:\*\*\s+(.+)/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "";

    // Extractor helper
    const extractSection = (header: string) => {
      // Look for '## Header', then capture everything until the next '## ' or end of string
      const regex = new RegExp(`##\\s+${header}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i");
      const match = md.match(regex);
      return match ? match[1].trim() : "";
    };

    const metaTitle = extractSection("Meta Title");
    const metaDesc = extractSection("Meta Description");
    const metaKeywords = extractSection("Meta Keywords");
    
    let slug = extractSection("URL Slug");
    if (slug.startsWith("/")) slug = slug.slice(1);

    const highlightsText = extractSection("Key Highlights");
    const parsedHighlights = highlightsText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const blogPostText = extractSection("Blog Post");
    const newContent: ContentBlock[] = [];
    const blocks = blogPostText.split(/\n\s*\n/);
    
    for (let block of blocks) {
      block = block.trim();
      if (!block || block.replace(/-/g, "").trim() === "" || block.startsWith("*Disclaimer:")) continue;
      
      if (block.startsWith("#")) {
        newContent.push({ type: "h1", text: block.replace(/^#+\s*/, "") });
      } else {
        // Append to the previous paragraph block if one exists, otherwise create a new one
        if (newContent.length > 0 && newContent[newContent.length - 1].type === "paragraph") {
          newContent[newContent.length - 1].text += "\n\n" + block;
        } else {
          newContent.push({ type: "paragraph", text: block });
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      title: title || prev.title,
      subtitle: subtitle || prev.subtitle,
      slug: slug || prev.slug,
      meta_title: metaTitle || prev.meta_title,
      meta_description: metaDesc || prev.meta_description,
      meta_keywords: metaKeywords || prev.meta_keywords,
    }));

    if (parsedHighlights.length > 0) {
      setKeyHighlights(parsedHighlights);
    }
    
    if (newContent.length > 0) {
      setContent(newContent);
    }
  };

  const updateContentBlock = (index: number, field: keyof ContentBlock, value: string) => {
    const newContent = [...content];
    newContent[index] = { ...newContent[index], [field]: value };
    setContent(newContent);
  };

  const removeContentBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    // Clean up empty highlights
    const cleanHighlights = keyHighlights.filter((h) => h.trim() !== "");

    const payload: any = {
      ...formData,
      keyHighlights: cleanHighlights,
      content,
    };

    if (payload.category !== "education" || payload.education_category === "") {
        payload.education_category = null;
    }

    if (payload.category !== "news" || payload.news_placement === "") {
        payload.news_placement = null;
    }

    try {
      const url = editSlug 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/${editSlug}/` 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/`;
      
      const method = editSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }

      setSuccess(true);
      if (!editSlug) {
        // Redirect to appropriate list on successful creation
        const redirectPath = formData.category === "education" ? "/admin/education" : "/admin/news";
        setTimeout(() => router.push(redirectPath), 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">{editSlug ? "Edit Post" : "Dynamic Post Editor"}</h1>
            <p className="text-gray-500 mt-1">{editSlug ? "Update your existing content." : "Create and publish news or education content to the Django backend."}</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {loading ? "Saving..." : editSlug ? "Update Post" : "Publish Post"}
          </button>
        </div>

        {fetching ? (
          <div className="text-center py-12 text-gray-500">Loading post data...</div>
        ) : (
          <>
            {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Post published successfully!
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Markdown Import Section */}
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Import from Markdown</h2>
              <p className="text-sm text-blue-700 mt-1">Upload a .md file to automatically populate the form fields below.</p>
            </div>
            <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload .MD File
              <input type="file" accept=".md" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <form className="divide-y divide-gray-100">
            {/* Basic Information Section */}
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. how-to-trade-options"
                    required
                  />
                </div>
                {formData.category === "education" && (
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Category</label>
                    <select
                      name="education_category"
                      value={formData.education_category || ""}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      required
                    >
                      <option value="" disabled>Select a sub-category...</option>
                      {eduCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.category === "news" && (
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">News Placement Widget</label>
                    <select
                      name="news_placement"
                      value={formData.news_placement || ""}
                      onChange={handleBasicChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      required
                    >
                      <option value="" disabled>Select a widget...</option>
                      <option value="hero">Featured Hero</option>
                      <option value="latest">Latest Intelligence (Grid)</option>
                      <option value="deep_dive">Deep Dive Analysis</option>
                      <option value="breaking">Breaking News</option>
                      <option value="live_feed">Live Feed</option>
                      <option value="quick_hit">Quick Hit</option>
                    </select>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Designation</label>
                  <input
                    name="authorDesignation"
                    value={formData.authorDesignation}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Key Highlights Section */}
            <div className="p-6 md:p-8 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Key Highlights</h2>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Highlight
                </button>
              </div>
              <div className="space-y-3">
                {keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={highlight}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Enter a key takeaway..."
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Settings Section */}
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Custom SEO Title (defaults to post title)"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleBasicChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                    placeholder="Short summary for search engines (150-160 characters)"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                  <input
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleBasicChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Comma separated keywords (e.g. trading, nifty, strategy)"
                  />
                </div>
              </div>
            </div>

            {/* Content Builder Section */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Content Blocks</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addContentBlock("h1")}
                    className="text-sm font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    + Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock("paragraph")}
                    className="text-sm font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    + Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => addContentBlock("image")}
                    className="text-sm font-medium px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    + Image
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {content.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500">No content blocks added yet. Click the buttons above to start writing.</p>
                  </div>
                )}
                
                {content.map((block, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 border border-gray-200 rounded-xl shadow-sm relative group">
                    <div className="mt-2 text-gray-300 cursor-move">
                      <GripVertical size={20} />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {block.type === "h1" ? "Heading" : block.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeContentBlock(idx)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {block.type === "h1" && (
                        <input
                          value={block.text || ""}
                          onChange={(e) => updateContentBlock(idx, "text", e.target.value)}
                          className="w-full text-lg font-bold px-0 py-2 border-b border-transparent focus:border-blue-500 outline-none bg-transparent"
                          placeholder="Section Heading"
                        />
                      )}

                      {block.type === "paragraph" && (
                        <textarea
                          value={block.text || ""}
                          onChange={(e) => updateContentBlock(idx, "text", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[100px]"
                          placeholder="Write your paragraph here..."
                        />
                      )}

                      {block.type === "image" && (
                        <div className="space-y-3">
                          <input
                            value={block.url || ""}
                            onChange={(e) => updateContentBlock(idx, "url", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Image URL"
                          />
                          <input
                            value={block.caption || ""}
                            onChange={(e) => updateContentBlock(idx, "caption", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Optional Image Caption"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PostEditor() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
      <PostEditorInner />
    </Suspense>
  );
}
