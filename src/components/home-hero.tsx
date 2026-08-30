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
  eyebrow = "It is a dark time for the Republic — mercenaries answer the call",
  title = "ZERO COMPANY",
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
    <>
      <section aria-label="Current site snapshot" className="hero-metrics">
        <div className="container hero-metrics__grid">
          {metrics.map((metric) => (
            <div className="hero-metric" key={metric.label}>
              <div className="hero-metric__label">{metric.label}</div>
              <div className="hero-metric__value">{metric.value}</div>
              <div className="hero-metric__note">{metric.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="hero-shell">
        <div aria-hidden="true" className="hero-shell__backdrop">
          <div className="hero-shell__glow" />
          <div className="hero-shell__glow hero-shell__glow--amber" />
          <div className="hero-shell__silhouette" />
        </div>

        <div className="container hero-shell__inner">
          <div className="hero-shell__content">
            <div className="hero-shell__eyebrow">{eyebrow}</div>
            <h1 className="hero-shell__headline">
              {title}
              <span className="hero-shell__subheadline">{subtitle}</span>
            </h1>
            <p className="hero-shell__lead">
              {lead}
            </p>
            <div className="hero-shell__actions">
              <Link className={getVariantClass(primaryAction.variant)} href={primaryAction.href}>
                {primaryAction.label}
              </Link>
              <Link className={getVariantClass(secondaryAction.variant)} href={secondaryAction.href}>
                {secondaryAction.label}
              </Link>
            </div>

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
    </>
  );
}
