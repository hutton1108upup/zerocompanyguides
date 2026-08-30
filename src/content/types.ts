export type EvidenceLevel = "official" | "community" | "unverified";
export type PageStatus = "draft" | "verified" | "needs-retest" | "archived";
export type SourceKind = "official" | "video" | "community" | "competitor" | "press";
export type PageType = "home" | "hub" | "article" | "decision" | "tech";
export type Tone = "cyan" | "amber" | "green" | "red" | "muted";

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: SourceKind;
  checkedAt: string;
  note: string;
};

export type BriefingBlock = {
  type: "briefing";
  label?: string;
  items: string[];
};

export type ProseBlock = {
  type: "prose";
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type FactBlock = {
  type: "facts";
  heading: string;
  items: Array<{ label: string; value: string; note?: string }>;
};

export type CardBlock = {
  type: "cards";
  heading: string;
  intro?: string;
  items: Array<{
    title: string;
    label?: string;
    body: string;
    href?: string;
    tone?: Tone;
  }>;
};

export type TableBlock = {
  type: "table";
  heading: string;
  intro?: string;
  caption: string;
  columns: string[];
  rows: string[][];
};

export type StepsBlock = {
  type: "steps";
  heading: string;
  intro?: string;
  items: Array<{ title: string; body: string }>;
};

export type WarningBlock = {
  type: "warning";
  heading: string;
  body: string;
  tone: "amber" | "red" | "cyan";
};

export type MediaEvidence = "official" | "community";

export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
  publisher: string;
  checkedAt: string;
  evidence: MediaEvidence;
  priority?: boolean;
  spoiler?: boolean;
};

export type VideoBlock = {
  type: "video";
  heading: string;
  videoId: string;
  posterSrc: string;
  title: string;
  publisher: string;
  duration: string;
  publishedAt: string;
  description: string;
  checkedAt: string;
  evidence: MediaEvidence;
  versionNote?: string;
  spoiler?: boolean;
};

export type VerdictBlock = {
  type: "verdict";
  heading: string;
  items: Array<{ label: string; tone: "green" | "amber" | "red"; bullets: string[] }>;
};

export type FaqBlock = {
  type: "faq";
  heading: string;
  items: Array<{ question: string; answer: string }>;
};

export type ContentBlock =
  | BriefingBlock
  | ProseBlock
  | FactBlock
  | CardBlock
  | TableBlock
  | StepsBlock
  | WarningBlock
  | ImageBlock
  | VideoBlock
  | VerdictBlock
  | FaqBlock;

export type ContentPage = {
  path: string;
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  summary: string;
  pageType: PageType;
  evidence: EvidenceLevel;
  status: PageStatus;
  indexable: boolean;
  lastVerified: string;
  gameVersion: string;
  platforms: string[];
  difficulty: string;
  spoiler: "none" | "minor" | "major";
  sources: string[];
  related: string[];
  blocks: ContentBlock[];
};
