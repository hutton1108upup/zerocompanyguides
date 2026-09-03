"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ResponsiveDataTableProps = {
  caption: string;
  columns: string[];
  cueId: string;
  mobileMode: "cards" | "scroll";
  rows: string[][];
};

type ScrollEdges = {
  after: boolean;
  before: boolean;
};

export function ResponsiveDataTable({
  caption,
  columns,
  cueId,
  mobileMode,
  rows,
}: ResponsiveDataTableProps) {
  const isScrollable = mobileMode === "scroll";
  const regionRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<ScrollEdges>({
    after: isScrollable,
    before: false,
  });

  const updateEdges = useCallback(() => {
    const region = regionRef.current;
    if (!region || !isScrollable) return;

    const maximum = Math.max(0, region.scrollWidth - region.clientWidth);
    const nextEdges = {
      after: maximum > 2 && region.scrollLeft < maximum - 2,
      before: region.scrollLeft > 2,
    };

    setEdges((current) => (
      current.after === nextEdges.after && current.before === nextEdges.before
        ? current
        : nextEdges
    ));
  }, [isScrollable]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region || !isScrollable) return;

    updateEdges();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateEdges);
      return () => window.removeEventListener("resize", updateEdges);
    }

    const observer = new ResizeObserver(updateEdges);
    observer.observe(region);
    const table = region.querySelector("table");
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [isScrollable, updateEdges]);

  const region = (
    <div
      aria-describedby={isScrollable ? cueId : undefined}
      aria-label={caption}
      className={`table-wrap table-wrap--${mobileMode}`}
      onScroll={isScrollable ? updateEdges : undefined}
      ref={regionRef}
      role="region"
      tabIndex={0}
    >
      {isScrollable ? (
        <p className="table-scroll-cue" id={cueId}>
          Swipe to view all columns
        </p>
      ) : null}
      <table className={`data-table data-table--${mobileMode}`}>
        <caption>{caption}</caption>
        <thead>
          <tr>{columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => cellIndex === 0 ? (
                <th scope="row" key={cellIndex}>{cell}</th>
              ) : (
                <td data-label={columns[cellIndex]} key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!isScrollable) return region;

  return (
    <div
      className="table-scroll-shell"
      data-scroll-after={edges.after}
      data-scroll-before={edges.before}
    >
      {region}
      <span aria-hidden="true" className="table-scroll-shadow table-scroll-shadow--left" />
      <span aria-hidden="true" className="table-scroll-shadow table-scroll-shadow--right" />
    </div>
  );
}
