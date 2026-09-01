"use client";

import { useEffect, useState } from "react";

export type ArticleTocItem = {
  id: string;
  label: string;
};

export function ArticleToc({ items }: { items: ArticleTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.flatMap((item) => {
      const heading = document.getElementById(item.id);
      return heading ? [heading] : [];
    });
    if (!headings.length) return;

    const headerOffset =
      (document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0) + 24;
    const observer = new IntersectionObserver((entries) => {
      const visibleHeading = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];

      if (visibleHeading) setActiveId(visibleHeading.target.id);
    }, {
      rootMargin: `-${headerOffset}px 0px -68% 0px`,
      threshold: 0,
    });

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label="On this page">
      <p className="hud-label">On this page</p>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            aria-current={isActive ? "location" : undefined}
            className={isActive ? "active" : undefined}
            href={`#${item.id}`}
            key={item.id}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
