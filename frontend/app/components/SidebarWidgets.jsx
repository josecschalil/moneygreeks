import Link from "next/link";
import SentimentWidget from "./SentimentWidget";

export default function SidebarWidgets({ mostRead }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <SentimentWidget />

      {mostRead?.length > 0 && (
        <section className="rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] p-5 shadow-[var(--mg-shadow)]">
          <h3 className="font-heading text-base font-semibold text-[var(--mg-text)]">
            Most Read
          </h3>
          <ol className="mt-4 space-y-4">
            {mostRead.map((item, index) => (
              <li key={item.slug || index} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--mg-surface-muted)] text-xs font-medium text-[var(--mg-text-muted)]">
                  {index + 1}
                </span>
                <div>
                  <Link
                    href={item.slug ? `/news-today/${item.slug}` : "#"}
                    className="group"
                  >
                    <h4 className="line-clamp-2 text-sm font-medium leading-6 text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
                      {item.title}
                    </h4>
                  </Link>
                  <span className="mt-1 block text-xs text-[var(--mg-text-soft)]">
                    {item.view_count !== undefined
                      ? `${item.view_count} views`
                      : item.meta}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </aside>
  );
}
