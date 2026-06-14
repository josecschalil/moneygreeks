import Icon from "./Icon";
import Link from "next/link";

export default function SectionHeader({ title, viewAll = false }) {
  return (
    <div className="flex items-center justify-between mb-8 pb-3 border-b border-border">
      <h2 className="text-3xl font-serif text-foreground tracking-tight">{title}</h2>
      {viewAll && (
        <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-accent hover:opacity-80 transition-opacity">
          View All <Icon name="arrow_forward" size={14} />
        </Link>
      )}
    </div>
  );
}
