import Link from "next/link";
import styles from "./PremiumBanner.module.css";

export default async function PremiumBanner() {
  let report = {
    title: "Premium Market Report",
    overall_conclusion:
      "Comprehensive market analysis covering institutional flows, sector performance, market breadth and stocks to watch.",
    report_date: "",
    slug: "premium-market-report",
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/report-list/", {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || [];

      if (items.length > 0) {
        const latest = [...items].sort((a, b) => b.id - a.id)[0];

        report = {
          title: latest.title,
          overall_conclusion: latest.overall_conclusion,
          report_date: latest.report_date,
          slug: latest.slug,
        };
      }
    }
  } catch (error) {
    console.warn("Failed to fetch latest report");
  }

  const shortDescription =
    report.overall_conclusion.length > 240
      ? `${report.overall_conclusion.slice(0, 160)}...`
      : report.overall_conclusion;

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <Link
          href={`/market-data/${report.slug}`}
          className={styles.bannerLink}
        >
          <div className={styles.tag}>LATEST PRE-MARKET REPORT</div>
          <h2 className={styles.title}>{report.title}</h2>
          <p className={styles.desc}>{shortDescription}</p>
          <div className={styles.meta}>
            <span>📊 Daily Market Analysis</span>
            <span>
              Published:{" "}
              {report.report_date
                ? new Date(report.report_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Today"}
            </span>
          </div>{" "}
        </Link>
      </div>
    </div>
  );
}
