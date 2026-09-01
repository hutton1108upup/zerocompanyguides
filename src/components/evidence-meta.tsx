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

const verificationLabel = {
  "official-verified": "Official verified",
  "source-verified-synthesis": "Source-verified synthesis",
  "needs-retest": "Needs retest",
} as const;

const isoDatePattern = /(\d{4}-\d{2}-\d{2})/g;
const exactIsoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function MetaText({ value }: { value: string }) {
  return value.split(isoDatePattern).map((part, index) => (
    exactIsoDatePattern.test(part)
      ? <time dateTime={part} key={`${part}-${index}`}>{part}</time>
      : part
  ));
}

export function EvidenceMeta({ page }: { page: ContentPage }) {
  const EvidenceIcon = page.evidence === "official" ? CircleCheck : ShieldQuestion;

  return (
    <div className="verification-meta" aria-label="Verification details">
      <span className={`evidence-badge evidence-${page.evidence}`}>
        <EvidenceIcon aria-hidden="true" size={14} />
        {evidenceLabel[page.evidence]}
      </span>
      <span><Tag aria-hidden="true" size={14} /> <MetaText value={page.gameVersion} /></span>
      <span><Gamepad2 aria-hidden="true" size={14} /> {page.platforms.join(" · ")}</span>
      <span><Gauge aria-hidden="true" size={14} /> Difficulty: {page.difficulty}</span>
      <span><ScanEye aria-hidden="true" size={14} /> Spoilers: {page.spoiler}</span>
      <span><CalendarDays aria-hidden="true" size={14} /> Checked <MetaText value={page.lastVerified} /></span>
      <span className={`verification-status verification-${page.verification}`}>
        <BadgeCheck aria-hidden="true" size={14} /> {verificationLabel[page.verification]}
      </span>
    </div>
  );
}
