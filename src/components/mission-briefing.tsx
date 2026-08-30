import { RadioTower } from "lucide-react";

export function MissionBriefing({ label = "Mission briefing", items }: { label?: string; items: string[] }) {
  return (
    <section className="briefing" aria-labelledby="mission-briefing-title">
      <p className="hud-label" id="mission-briefing-title">
        <RadioTower aria-hidden="true" size={15} /> {label}
      </p>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
