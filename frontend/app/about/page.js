import React from "react";
import { TrendingUp, Activity, Globe, Users, ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative px-6 pt-15 md:pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2 shadow-sm mb-6">
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700">
              Trusted by 1M+ Investors Worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Your Gateway
            <span className="block mt-2">to Smarter Investing</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            MoneyGreeks delivers institutional-grade market intelligence,
            real-time data, and comprehensive educational resources for
            confident investment decisions.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
              Explore Platform
            </button>
            <button className="bg-white text-slate-900 px-8 py-3.5 rounded-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                number: "1M+",
                label: "Active Users",
                icon: <Users className="w-5 h-5" />,
              },
              {
                number: "50K+",
                label: "Daily Reports",
                icon: <TrendingUp className="w-5 h-5" />,
              },
              {
                number: "24/7",
                label: "Live Coverage",
                icon: <Activity className="w-5 h-5" />,
              },
              {
                number: "150+",
                label: "Countries",
                icon: <Globe className="w-5 h-5" />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 flex-shrink-0">
                    {stat.icon}
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {stat.number}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg mb-6">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Democratizing Financial Intelligence for Every Investor
              </h2>
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                We believe that access to professional-grade market analysis
                shouldn't be limited to Wall Street. MoneyGreeks bridges the gap
                between institutional-level insights and everyday investors.
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Our platform combines cutting-edge technology with expert
                analysis to deliver actionable insights that help you navigate
                market complexities with confidence.
              </p>
              <button className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all">
                Learn more about our approach <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl">
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <p className="text-sm text-slate-300">Data Accuracy Rate</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-100 mt-8">
                  <div className="text-4xl font-bold mb-2 text-slate-900">
                    Real-Time
                  </div>
                  <p className="text-sm text-slate-600">Market Updates</p>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-100 -mt-8">
                  <div className="text-4xl font-bold mb-2 text-slate-900">
                    500+
                  </div>
                  <p className="text-sm text-slate-600">Learning Resources</p>
                </div>
                <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl">
                  <div className="text-4xl font-bold mb-2">Daily</div>
                  <p className="text-sm text-slate-300">Expert Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg mb-6 shadow-sm">
              What We Offer
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Comprehensive Market Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to stay ahead in the markets, unified in one
              powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Pre-Market Reports",
                desc: "Start your day with comprehensive analysis of overnight developments, futures trends, and key levels to watch before markets open.",
              },
              {
                title: "Live Market Data",
                desc: "Real-time streaming data, advanced charting tools, and instant alerts on market-moving events as they happen.",
              },
              {
                title: "Market News & Analysis",
                desc: "Breaking news, expert commentary, and in-depth analysis of market trends, sector movements, and economic indicators.",
              },
              {
                title: "Educational Content",
                desc: "Structured learning paths, video tutorials, live webinars, and in-depth articles to continuously enhance your market knowledge.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {service.desc}
                </p>
                <div className="inline-flex items-center text-sm font-semibold text-slate-900 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg mb-6">
              Leadership
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Meet Our Visionary Leader
            </h2>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-5 gap-12 p-10 md:p-14">
              <div className="md:col-span-2 flex flex-col items-center md:items-start">
                <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl mb-6">
                  <span className="text-white text-5xl font-bold">JCS</span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Jose C S
                  </h3>
                  <p className="text-base text-slate-600 font-semibold mb-6">
                    Chief Executive Officer
                  </p>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                      <span className="text-slate-600 text-xs font-semibold">
                        in
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                      <span className="text-slate-600 text-xs font-semibold">
                        tw
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  With over 5+ years of experience in financial technology and
                  market analysis, Jose founded MoneyGreeks with a clear vision:
                  to level the playing field in financial markets by providing
                  retail investors with the same quality of insights
                  traditionally reserved for institutional players.
                </p>
                <p className="text-base text-slate-600 leading-relaxed mb-8">
                  Under his leadership, MoneyGreeks has grown to serve over a
                  million active users worldwide, delivering cutting-edge market
                  intelligence and educational resources that empower investors
                  at every level.
                </p>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-base text-slate-700 italic leading-relaxed">
                    "Our mission is simple: provide every investor with the
                    tools, data, and knowledge they need to make confident,
                    informed decisions. When investors succeed, markets thrive."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The principles that drive everything we do at MoneyGreeks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                desc: "Clear, honest communication. Our data sources, methodologies, and analysis are always transparent and verifiable.",
              },
              {
                title: "Innovation",
                desc: "Continuous evolution with cutting-edge technology to deliver better insights and superior user experiences.",
              },
              {
                title: "Education",
                desc: "Empowering through knowledge. Resources that help you understand markets deeply, not just react to them.",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:bg-slate-750 transition-all"
              >
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-base text-slate-300 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Ready to Elevate Your Investment Strategy?
          </h2>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Join over a million investors who trust MoneyGreeks for their daily
            market insights and analysis
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-slate-900 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
              Subscribe Newsletter
            </button>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-xl text-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all">
              Explore Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
