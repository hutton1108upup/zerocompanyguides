import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ContentPage } from "../content/types";
import { getHeadingId, getParentPage } from "../lib/content";
import { ArticleToc } from "./article-toc";
import { CorrectionForm } from "./correction-form";
import { ContentBlocks } from "./content-blocks";
import { PageHero } from "./page-hero";
import { RelatedPages } from "./related-pages";
import { SourceList } from "./source-list";

export function ContentPageView({ page }: { page: ContentPage }) {
  const parent = getParentPage(page);
  const tocHeadings = page.blocks
    .filter((block) => "heading" in block)
    .map((block) => block.heading);
  const tocItems = tocHeadings.map((heading) => ({
    id: getHeadingId(heading),
    label: heading,
  }));

  return (
    <main>
      <div className="container breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><ChevronRight aria-hidden="true" size={14} />
        {parent && <><Link href={parent.path}>{parent.navLabel}</Link><ChevronRight aria-hidden="true" size={14} /></>}
        <span aria-current="page">{page.navLabel}</span>
      </div>
      <PageHero page={page} />
      {tocHeadings.length > 1 ? (
        <details className="container mobile-toc">
          <summary>
            <span>On this page</span>
            <span>{tocHeadings.length} sections</span>
          </summary>
          <nav aria-label="Mobile section navigation">
            {tocItems.map((item) => (
              <a href={`#${item.id}`} key={item.id}>{item.label}</a>
            ))}
          </nav>
        </details>
      ) : null}
      <div className="container article-layout">
        <article className="article-body">
          <ContentBlocks blocks={page.blocks} />
          {page.evidence !== "editorial" && <CorrectionForm pagePath={page.path} />}
          <RelatedPages page={page} />
          {page.sources.length ? <SourceList ids={page.sources} /> : null}
        </article>
        {tocHeadings.length > 1 ? <ArticleToc items={tocItems} /> : null}
      </div>
    </main>
  );
}

export default ContentPageView;
