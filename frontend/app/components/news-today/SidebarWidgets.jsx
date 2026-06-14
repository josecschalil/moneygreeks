import { mostRead as defaultMostRead } from "./data";
import SentimentWidget from "./SentimentWidget";
import Link from "next/link";

export default function SidebarWidgets({ mostRead }) {
  const displayMostRead = mostRead?.length ? mostRead : defaultMostRead;

  return (
    <aside className="w-full flex flex-col gap-10">
      <SentimentWidget />

      <div>
        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground-secondary mb-6 border-b border-border pb-2">
          Most Read
        </h3>
        <ol className="flex flex-col gap-5">
          {displayMostRead.map((item, index) => (
            <li className="flex gap-4 group" key={item.slug || index}>
              <span className="text-3xl font-serif text-border-color group-hover:text-accent transition-colors">
                {index + 1}
              </span>
              <div className="flex flex-col pt-1">
                <Link href={`/news-today/${item.slug}`} className="hover:opacity-80 transition-opacity">
                  <h4 className="text-base font-semibold text-foreground leading-snug mb-1">
                    {item.title}
                  </h4>
                </Link>
                <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">
                  {item.view_count !== undefined ? `${item.view_count} views` : item.meta}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
