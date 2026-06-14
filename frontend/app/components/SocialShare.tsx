"use client";

import { Twitter, Linkedin, MessageCircle, Link2 } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-6 my-8 border-t border-b border-gray-100">
      <div className="mb-4 sm:mb-0">
        <h3 className="text-sm font-bold text-gray-900">Share this insight</h3>
        <p className="text-xs text-gray-500 mt-1">Help others stay informed.</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-50 hover:bg-[#1DA1F2] hover:text-white text-gray-600 rounded-full transition-colors duration-200"
          aria-label="Share on Twitter"
        >
          <Twitter size={18} />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-50 hover:bg-[#0A66C2] hover:text-white text-gray-600 rounded-full transition-colors duration-200"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-50 hover:bg-[#25D366] hover:text-white text-gray-600 rounded-full transition-colors duration-200"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
        <button
          onClick={copyToClipboard}
          className={`p-2 rounded-full transition-colors duration-200 flex items-center gap-1 text-xs font-medium px-4 ${
            copied ? "bg-green-50 text-green-700" : "bg-gray-50 hover:bg-gray-100 text-gray-600"
          }`}
        >
          <Link2 size={16} />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
