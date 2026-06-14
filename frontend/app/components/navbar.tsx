"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NewsletterModal from "./NewsLetterModal";

const navLinks = [
  { label: "Markets", href: "/" },
  { label: "News", href: "/news-today" },
  { label: "Reports", href: "/blog" },
  { label: "Education", href: "/education" },
  { label: "Threads", href: "/threads" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-6">
          {/* Logo */}
          <a
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-zinc-900"
          >
            MoneyGreeks
          </a>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const active =
                link.href === pathname ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`border-b-2 pb-0.5 text-sm font-medium transition-colors ${active
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex cursor-text items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <span>Search markets, stocks, news...</span>
            </div>

            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-900 hover:text-white"
            >
              Subscribe
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-5 rounded bg-zinc-700 transition-all ${open ? "translate-y-2 rotate-45" : ""
                }`}
            />
            <span
              className={`h-0.5 w-5 rounded bg-zinc-700 transition-all ${open ? "opacity-0" : ""
                }`}
            />
            <span
              className={`h-0.5 w-5 rounded bg-zinc-700 transition-all ${open ? "-translate-y-2 -rotate-45" : ""
                }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t border-zinc-200 bg-white shadow-lg md:hidden">
            <div className="flex flex-col py-2">
              {navLinks.map((link) => {
                const active =
                  link.href === pathname ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-6 py-3 text-sm font-medium ${active
                        ? "border-l-2 border-zinc-900 bg-zinc-50 text-zinc-900"
                        : "text-zinc-600"
                      }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              <div className="flex flex-col gap-3 px-6 py-4">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>

                  <span>Search markets, stocks, news...</span>
                </div>

                <button
                  onClick={() => setIsNewsletterOpen(true)}
                  className="rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-900 hover:text-white"
                >
                  Subscribe Newsletter
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </>
  );
}