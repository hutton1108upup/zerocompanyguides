import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Gauge, Radar, Route, ShieldCheck } from "lucide-react";
import { ClassTierBoard } from "@/components/class-tier-board";
import { ContentBlocks } from "@/components/content-blocks";
import { HomeHero } from "@/components/home-hero";
import { HubCard } from "@/components/hub-card";
import { PerformanceStatus } from "@/components/performance-status";
import { getContentPage, contentPageByPath } from "@/content/pages";
import { homeFacts, homeSections, popularPaths } from "@/lib/home-data";
import {
  buildOrganizationStructuredData,
  buildPageStructuredData,
  buildSiteStructuredData,
} from "@/lib/structured-data";
import { getMetadataForPath } from "@/lib/site";

const homePage = (() => {
  const entry = getContentPage("/");
  if (!entry) throw new Error("Homepage content is missing from the registry");
  return entry;
})();

const sectionIcons = [Radar, ShieldCheck, Route, CheckCircle2, Gauge, ArrowUpRight];

export function generateMetadata(): Metadata {
  return getMetadataForPath("/") ?? {};
}

export default function HomePage() {
  const pageGraphs = buildPageStructuredData(homePage);
  const graphs = [
    buildOrganizationStructuredData(),
    buildSiteStructuredData(homePage),
    pageGraphs.page,
    pageGraphs.breadcrumb,
    pageGraphs.faq,
    ...(pageGraphs.videos ?? []),
  ].filter(Boolean);
  const faqBlocks = homePage.blocks.filter((block) => block.type === "faq");
  const howToPlayBlocks = homePage.blocks.filter((block) => block.type === "steps");
  const mediaBlocks = homePage.blocks.filter((block) => block.type === "image" || block.type === "video");

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          key={`home-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      ))}

      <main>
        <HomeHero
          lead="Evidence-labeled builds, class choices, spoiler-safe campaign planning and launch technical guidance."
          metrics={[
            { label: "Launch date", value: "08.27.26", note: "Available now on PC, PS5 and Xbox Series X|S" },
            { label: "Standard classes", value: "8", note: "Official Specializations with distinct squad jobs" },
            { label: "Achievements", value: "53", note: "Full launch list with completion categories" },
          ]}
          primaryAction={{ href: "/squad-builder", label: "Build Your Squad", variant: "primary" }}
          secondaryAction={{ href: "/builds/hawks", label: "Compare Hawks Builds", variant: "ghost" }}
        />

      <section className="section home-how-to" aria-label="How to play Star Wars Zero Company">
        <div className="container">
          <p className="hud-label">Game loop</p>
          <ContentBlocks blocks={howToPlayBlocks} />
          <Link className="text-link" href="/guides/beginners-guide">
            Read the full beginner combat guide <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="start-title">
        <div className="container">
          <p className="hud-label">Start here</p>
          <h2 className="section-title" id="start-title">Three decisions before the next Cycle</h2>
          <div className="card-grid start-grid">
            <HubCard
              title="Choose the turn you want Hawks to create"
              kicker="01 · Class"
              description="Compare assist, sustain, damage and Advantage routes without pretending one build wins every campaign."
              links={[{ href: "/builds/hawks", label: "Hawks build matrix" }, { href: "/classes", label: "All classes" }]}
              tone="amber"
            />
            <HubCard
              title="Cover all four squad jobs"
              kicker="02 · Team"
              description="Bring damage, setup, sustain and space control—then record a replacement for each role."
              links={[{ href: "/builds/best-team", label: "Squad templates" }, { href: "/characters", label: "Operator dossiers" }]}
              tone="cyan"
            />
            <HubCard
              title="Check launch technical status"
              kicker="03 · System"
              description="Apply official issue guidance before hardware-specific settings or community tweaks."
              links={[{ href: "/performance/fps-fix", label: "Safe fix order" }, { href: "/system-requirements", label: "Official requirements" }]}
              tone="red"
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="popular-title">
        <div className="container">
          <p className="hud-label">Current mission board</p>
          <h2 className="section-title" id="popular-title">Popular now</h2>
          <p className="section-sub">Manually selected launch tasks—not an invented real-time trend feed.</p>
          <div className="card-grid">
            {popularPaths.map((path) => {
              const page = contentPageByPath.get(path)!;
              return (
                <Link className="article-card shell-panel angled-panel" href={path} key={path}>
                  <div className="card-meta">
                    <span className={`tag tag-${page.evidence}`}>{page.evidence}</span>
                    <time dateTime={page.lastVerified}>{page.lastVerified}</time>
                  </div>
                  <h3>{page.h1}</h3>
                  <p>{page.summary}</p>
                  <span className="card-cta">Open briefing <ArrowUpRight aria-hidden="true" size={15} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--compact" aria-labelledby="quick-facts-title">
        <div className="container">
          <p className="hud-label">Official snapshot</p>
          <h2 className="section-title" id="quick-facts-title">Quick game facts</h2>
          <p className="section-sub">Stable launch facts link to the source-backed page that explains them.</p>
          <div className="fact-grid">
            {homeFacts.map((fact) => (
              <Link className="fact" href={fact.href} key={fact.label}>
                <span className="fact-key">{fact.label}</span>
                <strong className="fact-value">{fact.value}</strong>
                <span className="fact-link">Open intel <ArrowUpRight aria-hidden="true" size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--compact" aria-label="Official visual briefing">
        <div className="container home-media">
          <ContentBlocks blocks={mediaBlocks} />
        </div>
      </section>

      <section className="section" aria-labelledby="class-board-title">
        <div className="container split-feature">
          <div>
            <p className="hud-label">Launch class model</p>
            <h2 className="section-title" id="class-board-title">Broad value, not permanent truth</h2>
            <p className="section-sub">The board summarizes community launch value. The official role matrix explains when every class moves up.</p>
            <Link className="text-link" href="/classes/tier-list">Read the evidence and trade-offs <ArrowUpRight aria-hidden="true" size={15} /></Link>
          </div>
          <ClassTierBoard footnote="Launch community synthesis. Open the full tier guide for official roles, source disagreements and patch-sensitive trade-offs." />
        </div>
      </section>

      <section className="section" aria-labelledby="section-map-title">
        <div className="container">
          <p className="hud-label">Command index</p>
          <h2 className="section-title" id="section-map-title">Browse every intelligence lane</h2>
          <div className="hub-grid">
            {homeSections.map((section, index) => {
              const Icon = sectionIcons[index];
              return (
                <HubCard
                  key={section.title}
                  title={section.title}
                  kicker={section.kicker}
                  description={section.description}
                  icon={<Icon aria-hidden="true" size={22} />}
                  links={section.links.map((path) => ({ href: path, label: contentPageByPath.get(path)!.navLabel }))}
                  tone={index === 4 ? "red" : index === 5 ? "amber" : "cyan"}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="technical-title">
        <div className="container">
          <p className="hud-label">Live launch boundary</p>
          <h2 className="section-title" id="technical-title">What is official, reported and still changing</h2>
          <PerformanceStatus />
        </div>
      </section>

      <section className="section" aria-label="First campaign questions">
        <div className="container home-faq">
          <p className="hud-label">New player questions</p>
          <ContentBlocks blocks={faqBlocks} />
        </div>
      </section>
      </main>
    </>
  );
}
