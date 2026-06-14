import Link from "next/link";
import Icon from "./Icon";

export default function SectionHeader({ title, viewAll = false, href = "/news-today" }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text-soft)]">
          MoneyGreeks
        </p>
        <h2 className="mt-1 font-heading text-2xl font-semibold text-[var(--mg-text)]">
          {title}
        </h2>
      </div>
      {viewAll && (
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text-muted)] transition hover:text-[var(--mg-text)]">
          View all
          <Icon name="arrow_forward" />
        </Link>
      )}
    </div>
  );
}
