"use client";

import Link from "next/link";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { contentPages } from "@/content/pages";
import type { ContentPage } from "@/content/types";
import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { collectBlockText } from "@/lib/search";

type SearchEntry = {
  href: string;
  title: string;
  summary: string;
  label: string;
  pathLabel: string;
  haystack: string;
};

function getSectionLabel(page: ContentPage): string {
  if (page.path === "/") return "Home";
  const [first] = page.path.split("/").filter(Boolean);
  return first
    ?.split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ") ?? "Guide";
}

const searchEntries: SearchEntry[] = contentPages
  .filter((page) => page.indexable)
  .map((page) => ({
    href: page.path,
    title: page.h1,
    summary: page.summary,
    label: getSectionLabel(page),
    pathLabel: page.path === "/" ? "/home" : page.path,
    haystack: [
      page.path,
      page.navLabel,
      page.title,
      page.h1,
      page.kicker,
      page.summary,
      page.description,
      ...page.related,
      ...page.blocks.map(collectBlockText),
    ]
      .join(" ")
      .toLowerCase(),
  }));

const featuredEntries = [
  "/builds/hawks",
  "/classes/tier-list",
  "/performance/pc",
  "/guides/beginners-guide",
  "/walkthrough",
  "/worth-it",
]
  .map((path) => searchEntries.find((entry) => entry.href === path))
  .filter((entry): entry is SearchEntry => Boolean(entry));

function getResults(query: string) {
  if (!query) return featuredEntries;

  const normalized = query.trim().toLowerCase();
  if (!normalized) return featuredEntries;

  return [...searchEntries]
    .map((entry) => {
      let score = 0;
      if (entry.title.toLowerCase().includes(normalized)) score += 4;
      if (entry.label.toLowerCase().includes(normalized)) score += 2;
      if (entry.pathLabel.includes(normalized)) score += 2;
      if (entry.haystack.includes(normalized)) score += 1;
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 8)
    .map((item) => item.entry);
}

export function SiteSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openSearch = () => {
    startTransition(() => {
      setIsOpen(true);
    });
  };

  const closeSearch = () => {
    startTransition(() => {
      setIsOpen(false);
      setQuery("");
    });
  };

  const handleGlobalKeys = useEffectEvent((event: KeyboardEvent) => {
    const isModifierK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (isModifierK) {
      event.preventDefault();
      openSearch();
      return;
    }

    if (event.key === "Escape") {
      closeSearch();
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleGlobalKeys(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const results = getResults(deferredQuery);

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Search site content"
        className="search-trigger"
        onClick={openSearch}
        type="button"
      >
        <SearchIcon height={18} width={18} />
        <span className="search-trigger__label">Search Intel</span>
        <span aria-hidden="true" className="search-trigger__kbd">
          Ctrl/⌘K
        </span>
      </button>

      {isOpen ? (
        <div className="search-overlay" role="presentation">
          <button
            aria-label="Close search"
            className="search-backdrop"
            onClick={closeSearch}
            type="button"
          />
          <div
            aria-labelledby="site-search-title"
            aria-modal="true"
            className="search-panel"
            role="dialog"
          >
            <div className="search-panel__header">
              <SearchIcon height={20} width={20} />
              <input
                aria-label="Search site content"
                className="search-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search classes, builds, performance, trophies, or story-safe guides"
                ref={inputRef}
                type="text"
                value={query}
              />
              <button
                aria-label="Close search"
                className="icon-button"
                onClick={closeSearch}
                type="button"
              >
                <CloseIcon height={18} width={18} />
              </button>
            </div>

            <div className="search-panel__meta">
              <span id="site-search-title">
                {query ? "Matching published routes" : "Popular verified routes"}
              </span>
              <span className="search-kbd">Esc</span>
            </div>

            <div className="search-results">
              {results.length ? (
                results.map((entry) => (
                  <Link
                    className="search-result"
                    href={entry.href}
                    key={entry.href}
                    onClick={closeSearch}
                  >
                    <div className="search-result__head">
                      <div>
                        <div className="search-result__title">{entry.title}</div>
                        <div className="search-result__path">{entry.pathLabel}</div>
                      </div>
                      <ArrowUpRightIcon height={18} width={18} />
                    </div>
                    <div className="search-result__summary">{entry.summary}</div>
                    <div className="search-result__path">{entry.label}</div>
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  No matching route yet. Try class names, `Hawks`, `Steam Deck`, `respec`, or
                  `worth it`.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
