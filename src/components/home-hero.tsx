import Link from "next/link";
import { contentPages } from "@/content/pages";
import { sources } from "@/content/sources";
import { DataStackIcon, RadarIcon, ShieldIcon } from "@/components/icons";

type HeroMetric = {
  label: string;
  value: string;
  note: string;
};

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "ghost" | "subtle";
};

type HomeHeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  lead?: string;
  metrics?: HeroMetric[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
};

const homePage = contentPages.find((page) => page.path === "/");

const latestVerified =
  contentPages.map((page) => page.lastVerified).sort((left, right) => right.localeCompare(left))[0] ??
  "2026-08-30";

const defaultMetrics: HeroMetric[] = [
  {
    label: "Published routes",
    value: String(contentPages.length),
    note: "Approved launch pages in the content registry",
  },
  {
    label: "Tracked sources",
    value: String(sources.length),
    note: "Official and community evidence recorded separately",
  },
  {
    label: "Last verified",
    value: latestVerified,
    note: "Current registry sweep date",
  },
];

function getVariantClass(variant: HeroAction["variant"]) {
  if (variant === "ghost") return "button-chip button-chip--ghost";
  if (variant === "subtle") return "button-chip button-chip--subtle";
  return "button-chip button-chip--primary";
}

export function HomeHero({
  eyebrow,
  title = homePage?.h1 ?? "Star Wars Zero Company Wiki, Builds & Walkthroughs",
  subtitle = "TACTICAL COMMAND INTEL",
  lead = homePage?.summary ??
    "Fast routes to class choices, squad planning, campaign help and launch technical guidance.",
  metrics = defaultMetrics,
  primaryAction = { href: "/performance/pc", label: "Fix Your FPS First", variant: "primary" },
  secondaryAction = {
    href: "/classes/tier-list",
    label: "Best Classes",
    variant: "ghost",
  },
}: HomeHeroProps) {
  return (
    <section className="hero-shell">
      <div className="hero-shell__stage">
        <picture className="hero-shell__picture">
          <source
            media="(min-width: 1280px)"
            srcSet="/media/zero-company/hero/group-hero-desktop.webp"
          />
          <source
            media="(min-width: 600px)"
            srcSet="/media/zero-company/hero/group-hero-tablet.webp"
          />
          <img
            alt="Star Wars Zero Company operators assembled against a blue starfield"
            className="hero-shell__image"
            decoding="async"
            fetchPriority="high"
            height={1600}
            loading="eager"
            src="/media/zero-company/hero/group-hero-mobile.webp"
            width={900}
          />
        </picture>
        <div aria-hidden="true" className="hero-shell__scrim" />

        <div className="container hero-shell__inner">
          <div className="hero-shell__content">
            {eyebrow ? <div className="hero-shell__eyebrow">{eyebrow}</div> : null}
            <p className="hero-shell__subheadline">{subtitle}</p>
            <h1 className="hero-shell__headline">{title}</h1>
            <p className="hero-shell__lead">{lead}</p>
            <div className="hero-shell__actions">
              <Link className={getVariantClass(primaryAction.variant)} href={primaryAction.href}>
                {primaryAction.label}
              </Link>
              <Link className={getVariantClass(secondaryAction.variant)} href={secondaryAction.href}>
                {secondaryAction.label}
              </Link>
            </div>
          </div>
        </div>

        <a
          className="hero-shell__credit"
          href="https://www.ea.com/games/starwars/zero-company"
          rel="noopener noreferrer"
          target="_blank"
        >
          Official EA imagery <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="hero-shell__intel">
        <div className="container hero-shell__intel-inner">
          <aside aria-label="Current site snapshot" className="hero-shell__metrics">
            <div className="hero-shell__metrics-grid">
              {metrics.map((metric) => (
                <div className="hero-metric" key={metric.label}>
                  <div className="hero-metric__label">{metric.label}</div>
                  <div className="hero-metric__value">{metric.value}</div>
                  <div className="hero-metric__note">{metric.note}</div>
                </div>
              ))}
            </div>
          </aside>

          <div className="hero-shell__support">
            <div className="shell-panel angled-panel hero-shell__support-card">
              <div className="hub-card__icon">
                <RadarIcon height={20} width={20} />
              </div>
              <h2 className="hero-shell__support-card-title">Official facts first</h2>
              <p className="hero-shell__support-card-body">
                Release, requirements, systems and cast details link back to EA, Steam or
                StarWars.com.
              </p>
            </div>
            <div className="shell-panel angled-panel hero-shell__support-card">
              <div className="hub-card__icon">
                <ShieldIcon height={20} width={20} />
              </div>
              <h2 className="hero-shell__support-card-title">Community evidence labeled</h2>
              <p className="hero-shell__support-card-body">
                Builds and performance reports show their source and limits instead of posing as
                universal tests.
              </p>
            </div>
            <div className="shell-panel angled-panel hero-shell__support-card">
              <div className="hub-card__icon">
                <DataStackIcon height={20} width={20} />
              </div>
              <h2 className="hero-shell__support-card-title">Spoilers under control</h2>
              <p className="hero-shell__support-card-body">
                Campaign and trophy pages disclose their spoiler level before mission names or
                completion conditions appear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
