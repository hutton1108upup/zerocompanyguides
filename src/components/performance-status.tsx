import { getContentPage } from "@/content/pages";

type StatusTone = "cyan" | "amber" | "green" | "red";

type StatusCard = {
  eyebrow: string;
  title: string;
  body: string;
  meta?: string;
  tone: StatusTone;
};

type PerformanceStatusProps = {
  items?: StatusCard[];
};

function firstBriefingItem(path: string) {
  const page = getContentPage(path);
  const block = page?.blocks.find((entry) => entry.type === "briefing");
  return block?.type === "briefing" ? block.items[0] : page?.summary ?? "";
}

const defaultItems: StatusCard[] = [
  {
    eyebrow: "Official issue status",
    title: "Developer investigation remains active",
    body:
      getContentPage("/performance")?.blocks.find((entry) => entry.type === "warning")?.body ??
      "EA's launch support guidance is still the first stop before community tweaks.",
    meta: "Source: /performance",
    tone: "red",
  },
  {
    eyebrow: "PC reading",
    title: "CPU limits matter more than one magic preset",
    body: firstBriefingItem("/performance/pc"),
    meta: "Source: /performance/pc",
    tone: "cyan",
  },
  {
    eyebrow: "Steam Deck",
    title: "Deck-first buying remains a wait state",
    body: firstBriefingItem("/performance/steam-deck"),
    meta: "Source: /performance/steam-deck",
    tone: "amber",
  },
];

export function PerformanceStatus({ items = defaultItems }: PerformanceStatusProps) {
  return (
    <div className="status-grid">
      {items.map((item) => (
        <article className={`status-card shell-panel angled-panel status-card--${item.tone}`} key={item.title}>
          <div className="status-card__eyebrow">{item.eyebrow}</div>
          <h3 className="status-card__title">{item.title}</h3>
          <p className="status-card__body">{item.body}</p>
          {item.meta ? <div className="status-card__meta">{item.meta}</div> : null}
        </article>
      ))}
    </div>
  );
}
