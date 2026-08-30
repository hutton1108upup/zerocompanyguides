import type { ContentBlock } from "../content/types";

export function collectBlockText(block: ContentBlock): string {
  switch (block.type) {
    case "briefing":
      return block.items.join(" ");
    case "prose":
      return [block.heading, ...(block.paragraphs ?? []), ...(block.bullets ?? [])].join(" ");
    case "facts":
      return [block.heading, ...block.items.flatMap((item) => [item.label, item.value, item.note ?? ""])].join(" ");
    case "cards":
      return [block.heading, block.intro ?? "", ...block.items.flatMap((item) => [item.title, item.label ?? "", item.body])].join(" ");
    case "table":
      return [block.heading, block.intro ?? "", block.caption, ...block.columns, ...block.rows.flat()].join(" ");
    case "steps":
      return [block.heading, block.intro ?? "", ...block.items.flatMap((item) => [item.title, item.body])].join(" ");
    case "warning":
      return [block.heading, block.body, block.tone].join(" ");
    case "image":
      return [block.alt, block.caption, block.publisher, block.evidence].join(" ");
    case "video":
      return [
        block.heading,
        block.title,
        block.publisher,
        block.description,
        block.versionNote ?? "",
        block.evidence,
      ].join(" ");
    case "verdict":
      return [block.heading, ...block.items.flatMap((item) => [item.label, ...item.bullets])].join(" ");
    case "faq":
      return [block.heading, ...block.items.flatMap((item) => [item.question, item.answer])].join(" ");
  }
}
