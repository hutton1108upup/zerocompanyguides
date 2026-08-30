import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPageView from "@/components/content-page";
import { buildStructuredDataNodes } from "../../lib/structured-data";
import {
  getContentPageBySlug,
  getInnerRouteParams,
  getMetadataForPath,
} from "../../lib/site";

type RouteParams = {
  slug: string[];
};

type RouteProps = {
  params: Promise<RouteParams>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getInnerRouteParams();
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  return getMetadataForPath(`/${slug.join("/")}`) ?? {};
}

export default async function ContentRoutePage({ params }: RouteProps) {
  const { slug } = await params;
  const page = getContentPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const structuredData = buildStructuredDataNodes(page);

  return (
    <>
      {structuredData.map((graph, index) => (
        <script
          key={`${page.path}-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}
      <ContentPageView page={page} />
    </>
  );
}
