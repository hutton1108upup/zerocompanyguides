import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { ImageBlock } from "../content/types";

export function ContentImage({ block }: { block: ImageBlock }) {
  const content = (
    <figure className={`media-plate media-plate--${block.evidence}`}>
      <div className="media-plate__frame">
        <Image
          alt={block.alt}
          className="media-plate__image"
          fill
          priority={block.priority}
          sizes="(max-width: 760px) 100vw, (max-width: 1180px) 72vw, 820px"
          src={block.src}
        />
        <span className="media-plate__scanline" aria-hidden="true" />
        <span className="media-plate__corner media-plate__corner--top" aria-hidden="true" />
        <span className="media-plate__corner media-plate__corner--bottom" aria-hidden="true" />
      </div>
      <figcaption className="media-plate__caption">
        <span className={`media-badge media-badge--${block.evidence}`}>
          {block.evidence === "official" ? "Official" : "Community"}
        </span>
        <span className="media-plate__caption-copy">{block.caption}</span>
        <a className="media-source" href={block.sourceUrl} rel="noreferrer" target="_blank">
          {block.publisher}
          <ExternalLink aria-hidden="true" size={13} />
        </a>
        <time dateTime={block.checkedAt}>Checked {block.checkedAt}</time>
      </figcaption>
    </figure>
  );

  if (!block.spoiler) return content;

  return (
    <details className="media-disclosure">
      <summary>Reveal spoiler image</summary>
      {content}
    </details>
  );
}
