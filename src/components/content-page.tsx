import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ContentPage } from "../content/types";
import { getHeadingId, getParentPage } from "../lib/content";
import { ContentBlocks } from "./content-blocks";
import { PageHero } from "./page-hero";
import { RelatedPages } from "./related-pages";
import { SourceList } from "./source-list";

export function ContentPageView({ page }: { page: ContentPage }) {
  const parent = getParentPage(page);
  const tocHeadings = page.blocks
    .filter((block) => "heading" in block)
    .map((block) => block.heading);

  return (
    <main>
      <div className="container breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><ChevronRight aria-hidden="true" size={14} />
        {parent && <><Link href={parent.path}>{parent.navLabel}</Link><ChevronRight aria-hidden="true" size={14} /></>}
        <span aria-current="page">{page.navLabel}</span>
      </div>
      <PageHero page={page} />
      <div className="container article-layout">
        <article className="article-body">
          <ContentBlocks blocks={page.blocks} />
          <SourceList ids={page.sources} />
          <RelatedPages page={page} />
        </article>
        {tocHeadings.length > 1 && (
          <nav className="toc" aria-label="On this page">
            <p className="hud-label">On this page</p>
            {tocHeadings.map((heading) => <a href={`#${getHeadingId(heading)}`} key={heading}>{heading}</a>)}
          </nav>
        )}
      </div>
    </main>
  );
}

export default ContentPageView;
