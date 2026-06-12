"use client";
import { useState } from "react";
import styles from "./Navbar.module.css";
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
  const [open, setOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>MoneyGreeks</div>

        {/* Desktop nav */}
        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${link.href === pathname || (link.href !== "/" && pathname.startsWith(link.href)) ? styles.active : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {/* Search + Login inside mobile menu */}
          <div className={styles.mobileActions}>
            <div className={styles.searchBox}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className={styles.searchPlaceholder}>
                Search markets, stocks, news...
              </span>
            </div>
            <button className={styles.loginBtn}>Login</button>
            <button className={styles.loginBtn} onClick={() => setIsNewsletterOpen(true)}>Subscribe Newsletter</button>
          </div>
        </nav>

        {/* Desktop right */}
        <div className={styles.right}>
          <div className={styles.searchBox}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className={styles.searchPlaceholder}>
              Search markets, stocks, news...
            </span>
          </div>
          <button className={styles.loginBtn} onClick={() => setIsNewsletterOpen(true)}>Subscribe Newsletter</button>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${open ? styles.bar1Open : ""}`} />
          <span className={`${styles.bar} ${open ? styles.bar2Open : ""}`} />
          <span className={`${styles.bar} ${open ? styles.bar3Open : ""}`} />
        </button>
      </div>

      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </header>
  );
}
