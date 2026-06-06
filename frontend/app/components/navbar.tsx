'use client'
import { useState } from 'react'
import styles from './Navbar.module.css'

const navLinks = ['Markets', 'News', 'Reports', 'Education', 'IPO Corner', 'Sectors', 'Calendars']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>MarketInsight</div>

        {/* Desktop nav */}
        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`${styles.navLink} ${link === 'Markets' ? styles.active : ''}`}
              onClick={() => setOpen(false)}
            >
              {link}
            </a>
          ))}
          {/* Search + Login inside mobile menu */}
          <div className={styles.mobileActions}>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className={styles.searchPlaceholder}>Search markets, stocks, news...</span>
            </div>
            <button className={styles.loginBtn}>Login</button>
          </div>
        </nav>

        {/* Desktop right */}
        <div className={styles.right}>
          <div className={styles.searchBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className={styles.searchPlaceholder}>Search markets, stocks, news...</span>
          </div>
          <button className={styles.loginBtn}>Login</button>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${open ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${open ? styles.bar3Open : ''}`} />
        </button>
      </div>
    </header>
  )
}
