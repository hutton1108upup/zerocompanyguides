import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentPage } from "../content/types";
import { getRelatedPages } from "../lib/content";

export function RelatedPages({ page }: { page: ContentPage }) {
  const related = getRelatedPages(page);

  return (
    <aside className="related-panel" aria-labelledby="related-title">
      <p className="hud-label" id="related-title">Related intel</p>
      <div className="related-grid">
        {related.map((entry) => (
          <Link className="related-card hud-card" href={entry.path} key={entry.path}>
            <span>{entry.kicker}</span>
            <strong>{entry.h1}</strong>
            <small>{entry.summary}</small>
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        ))}
      </div>
    </aside>
  );
}
