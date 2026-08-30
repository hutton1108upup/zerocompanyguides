import { ExternalLink } from "lucide-react";
import { resolveSources } from "../content/sources";

export function SourceList({ ids }: { ids: string[] }) {
  const sourceList = resolveSources(ids);

  return (
    <section className="sources-panel" aria-labelledby="sources-title">
      <p className="hud-label" id="sources-title">Source ledger</p>
      <p className="sources-intro">
        Claims above are separated by provenance. Community reports describe a tested sample, not every system or playthrough.
      </p>
      <ol className="source-list">
        {sourceList.map((source) => (
          <li key={source.id}>
            <div>
              <span className={`source-kind source-kind-${source.kind}`}>{source.kind}</span>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title} <ExternalLink aria-hidden="true" size={13} />
              </a>
              <span className="source-publisher">{source.publisher}</span>
            </div>
            <p>{source.note}</p>
            <time dateTime={source.checkedAt}>Checked {source.checkedAt}</time>
          </li>
        ))}
      </ol>
    </section>
  );
}
