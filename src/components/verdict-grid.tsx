import type { VerdictBlock } from "@/content/types";

type VerdictTone = "green" | "amber" | "red";

type VerdictItem = {
  label: string;
  tone: VerdictTone;
  bullets: string[];
};

type VerdictGridProps = {
  items: VerdictItem[] | VerdictBlock["items"];
};

export function VerdictGrid({ items }: VerdictGridProps) {
  return (
    <div className="verdict-grid">
      {items.map((item) => (
        <article className={`verdict-card shell-panel angled-panel verdict-card--${item.tone}`} key={item.label}>
          <h3 className="verdict-card__label">{item.label}</h3>
          <ul className="verdict-card__list">
            {item.bullets.map((bullet) => (
              <li className="verdict-card__item" key={bullet}>
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
