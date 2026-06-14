import Link from "next/link";

const groups = [
  {
    title: "Explore",
    links: [
      { label: "Markets", href: "/" },
      { label: "News", href: "/news-today" },
      { label: "Reports", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Education", href: "/education" },
      { label: "Threads", href: "/threads" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Archive", href: "/pre-market-archive" },
      { label: "Insights", href: "/blog-archive" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--mg-border)] bg-[var(--mg-surface)]">
      <div className="mx-auto grid max-w-[var(--mg-container)] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="font-heading text-base font-semibold text-[var(--mg-text)]">
            MoneyGreeks
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--mg-text-muted)]">
            Calm financial intelligence for traders and investors who prefer signal over noise.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--mg-text-soft)]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--mg-text-muted)]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-[var(--mg-text)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--mg-border)] px-4 py-5 text-center text-xs text-[var(--mg-text-soft)]">
        © 2026 MoneyGreeks. Market information is for education and research only.
      </div>
    </footer>
  );
}
