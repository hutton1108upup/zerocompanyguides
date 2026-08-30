import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import type { ContentBlock, Tone } from "../content/types";
import { getHeadingId } from "../lib/content";
import { MissionBriefing } from "./mission-briefing";
import { VerdictGrid } from "./verdict-grid";

const toneClass = (tone?: Tone) => (tone ? `tone-${tone}` : "tone-cyan");

function BlockHeading({ children }: { children: string }) {
  return <h2 id={getHeadingId(children)}>{children}</h2>;
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === "briefing") {
      return <MissionBriefing items={block.items} label={block.label} key={`${block.type}-${index}`} />;
    }

    if (block.type === "prose") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {block.bullets && <ul className="content-list">{block.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
        </section>
      );
    }

    if (block.type === "facts") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          <div className="fact-grid content-fact-grid">
            {block.items.map((item) => (
              <div className="fact" key={item.label}>
                <span className="fact-key">{item.label}</span>
                <strong className="fact-value">{item.value}</strong>
                {item.note && <small>{item.note}</small>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === "cards") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          {block.intro && <p>{block.intro}</p>}
          <div className="card-grid">
            {block.items.map((item) => {
              const body = (
                <>
                  {item.label && <span className="card-eyebrow">{item.label}</span>}
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </>
              );
              return item.href ? (
                <Link className={`hud-card content-card ${toneClass(item.tone)}`} href={item.href} key={item.title}>{body}</Link>
              ) : (
                <article className={`hud-card content-card ${toneClass(item.tone)}`} key={item.title}>{body}</article>
              );
            })}
          </div>
        </section>
      );
    }

    if (block.type === "table") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          {block.intro && <p>{block.intro}</p>}
          <div className="table-wrap" tabIndex={0} role="region" aria-label={block.caption}>
            <table className="data-table">
              <caption>{block.caption}</caption>
              <thead><tr>{block.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (block.type === "steps") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          {block.intro && <p>{block.intro}</p>}
          <ol className="steps-list">
            {block.items.map((item, stepIndex) => (
              <li key={item.title}>
                <span className="step-number">{String(stepIndex + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </li>
            ))}
          </ol>
        </section>
      );
    }

    if (block.type === "warning") {
      const WarningIcon = block.tone === "red" ? AlertTriangle : Info;
      return (
        <aside className={`warning-panel warning-${block.tone}`} key={`${block.type}-${block.heading}`}>
          <WarningIcon aria-hidden="true" size={20} />
          <div><h2 id={getHeadingId(block.heading)}>{block.heading}</h2><p>{block.body}</p></div>
        </aside>
      );
    }

    if (block.type === "verdict") {
      return (
        <section className="content-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          <VerdictGrid items={block.items} />
        </section>
      );
    }

    if (block.type === "faq") {
      return (
        <section className="content-section faq-section" key={`${block.type}-${block.heading}`}>
          <BlockHeading>{block.heading}</BlockHeading>
          {block.items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </details>
          ))}
        </section>
      );
    }

    const exhaustive: never = block;
    return exhaustive;
  });
}
