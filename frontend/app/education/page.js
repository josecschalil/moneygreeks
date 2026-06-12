"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function IntelligenceHub() {
  return (
    <div className={styles.body}>
      <main className={styles.main}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.heroEyebrow}>Intelligence Hub</span>
            <h1 className={styles.heroTitle}>
              Institutional Market Intelligence
            </h1>
            <p className={styles.heroSubtitle}>
              Unbiased strategic guides, deep technical analysis, and
              macroeconomic insights for the sophisticated investor.
            </p>
          </div>
        </header>

        <div className={styles.contentGrid}>
          {/* Main Content Area */}
          <div className={styles.mainContent}>
            {/* Featured Content */}
            <section className={styles.featuredSection}>
              <Link href="/education/structural-signals-market-dynamics" className="block group">
                <div className={`${styles.featuredCard} overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-400`}>
                  <img
                    className={`${styles.featuredImg} transition-transform duration-700 group-hover:scale-105`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN2PY17erj6GnwtM19EThcflYiaxYqrgQ6HTGD1ZXShcNcxtFGD6ro7pHROYg0AweLrjwUjOmJ8omhgnQMLUSDat-UPA5BoBok_8HhhP65xrdF3pVznUHaUdAPLyXNWlrCCYvW9_A6NVOjMZEj-IzLNNLdJgvLm6FClogvS-UjO_07PzG0Ry_hTdS6_0jIckBaXrP_EcAPjGxbLVEc7qhx5o13G5JcJLcnKHwcRzpNir1btbDdHxzgfIeAsSLaublYmiKvI_LCpDo"
                    alt="Technical analysis monitors"
                  />
                  <div className={styles.featuredOverlay} />
                  <div className={styles.featuredContent}>
                    <span className={styles.featuredBadge}>
                      Featured Analysis
                    </span>
                    <h2 className={`${styles.featuredTitle} transition-colors duration-200 group-hover:text-blue-100`}>
                      Structural Signals: The New Era of Market Dynamics
                    </h2>
                    <p className={styles.featuredDesc}>
                      How institutional liquidity is reshaping traditional
                      technical patterns in modern electronic markets.
                    </p>
                    <div className={styles.featuredMeta}>
                      <span>EST. READ 14 MIN</span>
                      <span className={styles.dot} />
                      <span>BY DAVID ARNAUD</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* Technical Analysis Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Technical Analysis</h3>
                <span className={styles.viewAll}>
                  PRACTICAL GUIDES
                </span>
              </div>
              <div className={styles.cardGrid}>
                <Link href="/education/principles-mean-reversion" className={`${styles.card} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <div className={`${styles.cardImgWrapper} overflow-hidden`}>
                    <img
                      alt="Mean Reversion"
                      className={`${styles.cardImg} transition-transform duration-500 group-hover:scale-105`}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVsu6DC-6yfOdbGp7gbmFCPMBpGYrt8qtGDkqfBVGFodof3CoSSHNSAnn430o-WUZR3LQqbW01mJ_X1tI59WZIDBy7RocsIsvnjPfT2hFX6Wb9WSrxRtMIwWN0pkZhubNAXVHJZAakLXDs1wbTxObfsYOtAedx5m1AetcvMbDKGzXWpWpuap50rAKq1HXjCpGaA-bQCeOQ3Ux5ENecjkp55sE5rhcubEEBJHplrGhTMAzBo5mZ23L1eA4hgWpabZTwVf0Y9EEQmic"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardTag}>Swing Trading</span>
                    <h4 className={`${styles.cardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                      The Principles of Mean Reversion
                    </h4>
                    <div className={styles.cardMeta}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14 }}
                      >
                        schedule
                      </span>
                      <span>12 MIN</span>
                    </div>
                  </div>
                </Link>

                <Link href="/education/volume-profile-masterclass" className={`${styles.card} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <div className={`${styles.cardImgWrapper} overflow-hidden`}>
                    <img
                      alt="Volume Profile"
                      className={`${styles.cardImg} transition-transform duration-500 group-hover:scale-105`}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXGUuhiKVz7YGtNbQqy5cz_zva5Ng57wFg1WdBmC0iz5Ugbp1rdDteu4vfBNoPeanXkcML8fC0vMr_31cYaukr6IahxSuQ3bSE8z4t0BX_FseKex5bt3ZHVUvqdvZrEywouP9VFQ9ohPqAu-iEprxEbd8iaX13Je5QYBXgH01rrYYp99NInixkl_BKxcQwnK_veC3-76wuS0UYm_Xy3U7a01di44TNtRz1oAgSuMPdMTfJNDV7RDh9YQHLuXkqXjsm_Tjosw9U1ls"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardTag}>Volume</span>
                    <h4 className={`${styles.cardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                      Volume Profile Masterclass
                    </h4>
                    <div className={styles.cardMeta}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14 }}
                      >
                        schedule
                      </span>
                      <span>15 MIN</span>
                    </div>
                  </div>
                </Link>

                <Link href="/education/logic-market-cycles" className={`${styles.card} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <div className={`${styles.cardImgWrapper} ${styles.cardImgPlaceholder}`}>
                    <span
                      className="material-symbols-outlined transition-transform duration-500 group-hover:scale-110"
                      style={{
                        fontSize: 48,
                        color: "var(--on-primary-container)",
                      }}
                    >
                      insights
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardTag}>Psychology</span>
                    <h4 className={`${styles.cardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                      The Logic of Market Cycles
                    </h4>
                    <div className={styles.cardMeta}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14 }}
                      >
                        schedule
                      </span>
                      <span>10 MIN</span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Mid-Content Ad Slot */}
            <div className={styles.adMid}>
              <div className={`${styles.adPlaceholder} ${styles.adMidInner}`}>
                <span className={styles.adLabel}>
                  Featured Partner Spotlight
                </span>
              </div>
            </div>

            {/* Fundamental Analysis Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Fundamental Analysis</h3>
                <span className={styles.viewAll}>
                  VALUATION & MACRO
                </span>
              </div>
              <div className={styles.cardGrid}>
                {[
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXOwELhfNzAYfLlCFuq6oJSTY30uJ1gnZsp1SVGpuU2YACUm0b_KuwGiIxuhKjJb0gRIm2QFSBP5cxI1M_-hrEzLf5FZATQkDqzYe9QeMa2oMIo_CeWVLdlU29eqrsl_egLC8rF0qBVHEw7nS_vMVjx6TJyb3DdOOjs2tEZ3zKNSBmW1iHLIlrFivg744J4WBd8cg4mfAXjLS4OVPsV7RCMGyGoBC39SqGPVOLYw2M0A_c9d_E245xgGzH8A8YzbzMcF2KHiNi35s",
                    alt: "Quarterly Results",
                    tag: "Earnings",
                    title: "Quarterly Result Interpretation",
                    time: "8 MIN",
                    slug: "quarterly-result-interpretation",
                  },
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC20Q18hsFUfJ3e2_DdHy4uVipm0YJqGjjOyWEBwdEOxSoz5dXLxJHoRXN6l6j7mH0cAvCww-XdAF-c379rpC6SWcY4P7rbAY4-snaepEGkBNcLXkdhYFduzvt9L7-ZleGQMyWUemxxQd1IxBpt5gHIS5PKnxaQaaYmiITSpYJkn_oNPCNWVZlAyxAsHWaOJ48khG6Q2GdkHSG10gGispMR_y9YZG2aRr0hqeLbHx-Q73hTUh44shdU2PT-_dDaI-YEBdDibAI9Qpw",
                    alt: "Macro Indicators",
                    tag: "Macro",
                    title: "Macro Economic Indicators",
                    time: "14 MIN",
                    slug: "macro-economic-indicators",
                  },
                  {
                    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf19AWadZcEAdKIB0-Wd62FFXOhVFfwZShTCKI5KkbDgLmThLYSMLmM-lJciCPVJ6z706N5gzsovcN6tFFwValojGv4RzPSWSR3S3jvoyr3Yi0TDKOyKDnVj6cK-xVI5uraDOek6sUTDUMYbtTqWaSDjs9zZp8-lUE7FPNOpS9tc2aelpw_WdqrqaG1-BXeG8N0er973opwoVSPFlsWYeRd8m5yTvE21KZAwd8B2cd65D6WbffWRg-jd8n3myj_eP77kQQDTXMnnY",
                    alt: "Risk Matrix",
                    tag: "Risk",
                    title: "Risk Assessment Matrix",
                    time: "10 MIN",
                    slug: "risk-assessment-matrix",
                  },
                ].map((item) => (
                  <Link
                    href={`/education/${item.slug}`}
                    className={`${styles.card} ${styles.cardGrayscale} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    key={item.title}
                  >
                    <div className={`${styles.cardImgWrapper} overflow-hidden`}>
                      <img
                        alt={item.alt}
                        className={`${styles.cardImg} transition-transform duration-500 group-hover:scale-105`}
                        src={item.img}
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.cardTag}>{item.tag}</span>
                      <h4 className={`${styles.cardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                        {item.title}
                      </h4>
                      <div className={styles.cardMeta}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          schedule
                        </span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Options & Derivatives Section */}
            <section className={styles.section}>
              <div
                className={`${styles.sectionHeader} ${styles.sectionHeaderLg}`}
              >
                <h3
                  className={`${styles.sectionTitle} ${styles.sectionTitleLg}`}
                >
                  Options &amp; Derivatives
                </h3>
                <span className={styles.viewAll}>
                  STRATEGY HUBS
                </span>
              </div>
              <div className={styles.cardGrid}>
                {[
                  {
                    icon: "📈",
                    tag: "Advanced",
                    title: "The Greeks: Delta and Gamma Explored",
                    desc: "Deep dive into advanced pricing dynamics and time decay sensitivity.",
                    time: "18 MIN",
                    slug: "greeks-delta-gamma",
                  },
                  {
                    icon: "📊",
                    tag: "Intermediate",
                    title: "Multi-Leg Hedging Strategies",
                    desc: "Constructing risk-defined portfolios for retail and professional traders.",
                    time: "22 MIN",
                    slug: "multi-leg-hedging",
                  },
                  {
                    icon: "📉",
                    tag: "Beginner",
                    title: "Options Pricing Fundamentals",
                    desc: "Understanding intrinsic value, extrinsic value, and the Black-Scholes model.",
                    time: "10 MIN",
                    slug: "options-pricing-fundamentals",
                  },
                ].map((item) => (
                  <Link
                    href={`/education/${item.slug}`}
                    className={`${styles.optionCard} group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    key={item.title}
                  >
                    <div className={styles.optionCardTop}>
                      <div className={styles.optionCardIcon}>
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                      </div>
                      <span className={styles.optionCardTime}>{item.time}</span>
                    </div>
                    <div className={styles.optionCardBody}>
                      <span className={styles.cardTag}>{item.tag}</span>
                      <h4 className={`${styles.optionCardTitle} transition-colors duration-200 group-hover:text-blue-600`}>
                        {item.title}
                      </h4>
                      <p className={styles.optionCardDesc}>{item.desc}</p>
                    </div>
                    <div className={styles.optionCardFooter}>
                      <span className={`${styles.optionCardArrow} transition-transform duration-200 group-hover:translate-x-1.5`}>
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              {/* Sidebar Ad */}
              <div className={`${styles.adPlaceholder} ${styles.adSidebar}`}>
                <span className={`${styles.adLabel} ${styles.adLabelCenter}`}>
                  Institutional Partnership Slot
                </span>
              </div>

              {/* Intelligence Briefing */}
              <div className={styles.briefingCard}>
                <h5 className={styles.briefingTitle}>Intelligence Briefing</h5>
                <ul className={styles.briefingList}>
                  <li className={styles.briefingItem}>
                    <a href="#">
                      <span className={styles.briefingTag}>MACRO TRENDS</span>
                      <p className={styles.briefingItemTitle}>
                        Central Bank Policy Shift: Qualitative Implications for
                        High-Beta Equity
                      </p>
                      <p className={styles.briefingTime}>2 HOURS AGO</p>
                    </a>
                  </li>
                  <li className={styles.briefingItem}>
                    <a href="#">
                      <span className={styles.briefingTag}>TECH ANALYSIS</span>
                      <p className={styles.briefingItemTitle}>
                        Unusual Options Activity Detected in the Cloud
                        Infrastructure Sector
                      </p>
                      <p className={styles.briefingTime}>5 HOURS AGO</p>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className={styles.newsletter}>
                <h5 className={styles.newsletterTitle}>The Alpha Letter</h5>
                <p className={styles.newsletterDesc}>
                  Weekly institutional insights delivered directly to your
                  inbox.
                </p>
                <div className={styles.newsletterForm}>
                  <input
                    className={styles.newsletterInput}
                    placeholder="Email address"
                    type="email"
                  />
                  <button className={styles.newsletterBtn}>
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
