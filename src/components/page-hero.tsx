import { EvidenceMeta } from "./evidence-meta";
import type { ContentPage } from "../content/types";

export function PageHero({ page }: { page: ContentPage }) {
  return (
    <header className="page-hero">
      <div className="container page-hero-inner">
        <p className="kicker">{page.kicker}</p>
        <h1>{page.h1}</h1>
        <p className="page-summary">{page.summary}</p>
        <EvidenceMeta page={page} />
      </div>
    </header>
  );
}
