// AboutPage.jsx
import React from "react";
import "./about.module.css";
export default function AboutPage() {
  return (
    <div className="about-page-wrapper bg-[var(--background)] text-[var(--on-background)] antialiased selection:bg-[var(--primary-fixed)] selection:text-[var(--primary)] min-h-screen flex flex-col">
      <main className="w-full flex-grow">
        <section className="relative w-full bg-white border-b border-gray-200">
          {/* Top thin accent bar */}
          <div className="w-full h-1 bg-gray-900"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
            {/* Editorial top label */}
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Est. 2018
              </span>
              <span className="block w-12 h-px bg-gray-300"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Mumbai, India
              </span>
            </div>

            {/* Asymmetric two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
              {/* Left — big headline */}
              <div className="md:col-span-7">
                <h1 className="text-5xl md:text-6xl lg:text-[80px] font-black text-gray-900 leading-[0.95] tracking-tight font-serif">
                  Built for <br />
                  <span className="text-gray-400">people who</span> <br />
                  read the fine print.
                </h1>
              </div>

              {/* Right — descriptor + CTA */}
              <div className="md:col-span-5 space-y-6 pb-2">
                <p className="text-base text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-5">
                  MoneyGreeks started as a passion project by a group of traders
                  tired of noise. No sponsored content. No fluff. Just rigorous
                  analysis written for people who take their capital seriously.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="/contact"
                    className="text-sm font-semibold text-gray-500 hover:text-gray-900 underline underline-offset-4 transition-colors"
                  >
                    Get in touch
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom stats bar */}
            <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "15,000+", label: "Newsletter readers" },
                { value: "6+ yrs", label: "In the market" },
                { value: "Daily", label: "Pre-market reports" },
                { value: "Zero", label: "Sponsored opinions" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-black text-gray-900 font-serif">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="py-[var(--stack-lg)] md:py-24 max-w-[var(--container-max)] mx-auto px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-[var(--primary)] mb-4">
              Our Core Values
            </h2>
            <div className="w-16 h-1 bg-[var(--secondary)] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--gutter)]">
            {/* Value 1 */}
            <div className="bg-[var(--surface-container-lowest)] p-8 border border-[var(--outline-variant)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-container-5)] flex items-center justify-center mb-6 group-hover:bg-[var(--primary-container-10)] transition-colors">
                <span
                  className="material-symbols-outlined text-3xl text-[var(--primary)]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  verified
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-3">
                Accuracy
              </h3>
              <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                Rigorous data verification ensuring every metric meets
                institutional standards.
              </p>
            </div>
            {/* Value 2 */}
            <div className="bg-[var(--surface-container-lowest)] p-8 border border-[var(--outline-variant)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-container-5)] flex items-center justify-center mb-6 group-hover:bg-[var(--primary-container-10)] transition-colors">
                <span
                  className="material-symbols-outlined text-3xl text-[var(--primary)]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  balance
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-3">
                Integrity
              </h3>
              <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                Independent, unbiased reporting free from external influence or
                conflict.
              </p>
            </div>
            {/* Value 3 */}
            <div className="bg-[var(--surface-container-lowest)] p-8 border border-[var(--outline-variant)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-container-5)] flex items-center justify-center mb-6 group-hover:bg-[var(--primary-container-10)] transition-colors">
                <span
                  className="material-symbols-outlined text-3xl text-[var(--primary)]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  psychiatry
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-3">
                Innovation
              </h3>
              <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                Leveraging advanced AI and machine learning for predictive
                market insights.
              </p>
            </div>
            {/* Value 4 */}
            <div className="bg-[var(--surface-container-lowest)] p-8 border border-[var(--outline-variant)] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[var(--primary-container-5)] flex items-center justify-center mb-6 group-hover:bg-[var(--primary-container-10)] transition-colors">
                <span
                  className="material-symbols-outlined text-3xl text-[var(--primary)]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  visibility
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-3">
                Transparency
              </h3>
              <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                Clear, actionable financial intelligence with fully auditable
                methodologies.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-[var(--stack-lg)] md:py-24 max-w-4xl mx-auto px-[var(--margin-mobile)] md:px-[var(--margin-desktop)]">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-[var(--primary)] mb-4">
              Our Evolution
            </h2>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--outline-variant)] before:to-transparent">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--surface-container-lowest)] bg-[var(--primary)] text-[var(--on-primary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <span className="font-label-md text-xs">2018</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-all">
                <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-2">
                  The Foundation
                </h3>
                <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                  Launched as a specialized financial blog offering deep-dive
                  fundamental analysis rooted in classical economic philosophies
                  for a niche audience of retail investors seeking
                  institutional-grade wisdom.
                </p>
              </div>
            </div>
            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--surface-container-lowest)] bg-[var(--primary)] text-[var(--on-primary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <span className="font-label-md text-xs">2021</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-all">
                <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-2">
                  Data Integration
                </h3>
                <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                  Transitioned to a data-first platform, integrating real-time
                  market feeds and developing proprietary quantitative models
                  that merge strategic thinking with modern analytics.
                </p>
              </div>
            </div>
            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--surface-container-lowest)] bg-[var(--primary)] text-[var(--on-primary)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <span className="font-label-md text-xs">2024</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-[var(--surface-container-lowest)] rounded-lg border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-all">
                <h3 className="font-headline-sm text-headline-sm text-[var(--primary)] mb-2">
                  The Intelligence Terminal
                </h3>
                <p className="font-body-md text-body-md text-[var(--on-surface-variant)]">
                  Launched the comprehensive MoneyGreeks Terminal, leveraging
                  predictive AI and serving thousands of institutional analysts
                  and sophisticated traders globally with clarity and insight.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-[var(--stack-lg)] md:py-32 bg-[var(--primary)] text-[var(--on-primary)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          ></div>
          <div className="relative z-10 max-w-[var(--container-max)] mx-auto px-[var(--margin-mobile)] md:px-[var(--margin-desktop)] text-center">
            <h2 className="font-display text-headline-md md:text-display-responsive mb-6">
              Join the Intelligence Community
            </h2>
            <p className="font-body-lg text-body-lg text-[var(--primary-fixed-dim)] max-w-2xl mx-auto mb-10">
              Gain access to predictive models, institutional reports, and
              real-time data designed for the sophisticated investor.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-[var(--secondary)] text-[var(--on-secondary)] font-label-md text-label-md px-8 py-4 rounded hover:bg-opacity-90 transition-all shadow-sm">
                Explore Our Reports
              </button>
              <button className="bg-transparent border border-[var(--outline-variant)] text-[var(--on-primary)] font-label-md text-label-md px-8 py-4 rounded hover:bg-[var(--surface-tint-20)] transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
