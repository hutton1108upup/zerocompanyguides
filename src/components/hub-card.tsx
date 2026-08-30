import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";

export type HubCardLink = {
  href: string;
  label: string;
};

export type HubCardTone = "cyan" | "amber" | "green" | "red";

type HubCardProps = {
  title: string;
  kicker?: string;
  description: string;
  icon?: ReactNode;
  links?: HubCardLink[];
  tone?: HubCardTone;
};

export function HubCard({
  title,
  kicker,
  description,
  icon,
  links = [],
  tone = "cyan",
}: HubCardProps) {
  return (
    <article className={`hub-card shell-panel angled-panel hub-card--${tone}`}>
      {icon ? <div className="hub-card__icon">{icon}</div> : null}
      {kicker ? <div className="hub-card__eyebrow">{kicker}</div> : null}
      <h3 className="hub-card__title">{title}</h3>
      <p className="hub-card__body">{description}</p>

      {links.length ? (
        <ul className="hub-card__list">
          {links.slice(1).map((link) => (
            <li key={link.href}>
              <Link className="hub-card__list-link" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {links[0] ? (
        <Link className="hub-card__action" href={links[0].href}>
          {links[0].label}
          <ChevronRightIcon height={16} width={16} />
        </Link>
      ) : null}
    </article>
  );
}
