import {
  BadgeCheck,
  CalendarDays,
  CircleCheck,
  Gamepad2,
  Gauge,
  ScanEye,
  ShieldQuestion,
  Tag,
} from "lucide-react";
import type { ContentPage } from "../content/types";

const evidenceLabel = {
  official: "Official sources",
  community: "Community synthesis",
  unverified: "Unverified",
} as const;

export function EvidenceMeta({ page }: { page: ContentPage }) {
  const EvidenceIcon = page.evidence === "official" ? CircleCheck : ShieldQuestion;

  return (
    <div className="verification-meta" aria-label="Verification details">
      <span className={`evidence-badge evidence-${page.evidence}`}>
        <EvidenceIcon aria-hidden="true" size={14} />
        {evidenceLabel[page.evidence]}
      </span>
      <span><Tag aria-hidden="true" size={14} /> {page.gameVersion}</span>
      <span><Gamepad2 aria-hidden="true" size={14} /> {page.platforms.join(" · ")}</span>
      <span><Gauge aria-hidden="true" size={14} /> Difficulty: {page.difficulty}</span>
      <span><ScanEye aria-hidden="true" size={14} /> Spoilers: {page.spoiler}</span>
      <span><CalendarDays aria-hidden="true" size={14} /> Verified {page.lastVerified}</span>
      <span><BadgeCheck aria-hidden="true" size={14} /> Status: {page.status}</span>
    </div>
  );
}
