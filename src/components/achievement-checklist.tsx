"use client";

import { useEffect, useMemo, useState } from "react";
import { trophyAchievements, type TrophyCategory } from "../content/trophy-data";

const storageKey = "zero-company-trophies:v1";
const categories: Array<TrophyCategory | "All"> = [
  "All",
  "Difficulty",
  "Story",
  "Operator story",
  "Bond",
  "Combat",
  "Company",
  "Completion",
];

function readSavedTrophies(): Set<string> {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

export function AchievementChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TrophyCategory | "All">("All");
  const [hideSpoilers, setHideSpoilers] = useState(false);
  const [feedback, setFeedback] = useState("Progress stays in this browser. No account is required.");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setCompleted(readSavedTrophies()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const visibleAchievements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return trophyAchievements.filter((entry) => {
      if (category !== "All" && entry.category !== category) return false;
      if (hideSpoilers && entry.spoilerLevel === "major") return false;
      if (!normalizedQuery) return true;
      return `${entry.name} ${entry.category} ${entry.requirement}`.toLowerCase().includes(normalizedQuery);
    });
  }, [category, hideSpoilers, query]);

  const toggleCompleted = (id: string) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
        setFeedback("Progress saved in this browser.");
      } catch {
        setFeedback("This browser blocked saving; the checklist still works for this visit.");
      }
      return next;
    });
  };

  const resetProgress = () => {
    setCompleted(new Set());
    try {
      window.localStorage.removeItem(storageKey);
      setFeedback("Saved progress cleared from this browser.");
    } catch {
      setFeedback("Saved progress could not be cleared by this browser.");
    }
  };

  return (
    <section aria-label="Trophy checklist" className="trophy-checklist">
      <div className="trophy-checklist__toolbar">
        <div>
          <span className="card-eyebrow">Local completion tracker</span>
          <h3>Track the 53 trophies</h3>
          <p aria-live="polite">{completed.size} / {trophyAchievements.length} complete · {feedback}</p>
        </div>
        <button className="button-chip button-chip--subtle" onClick={resetProgress} type="button">Reset saved progress</button>
      </div>
      <div className="trophy-checklist__filters">
        <label>
          <span>Filter trophies</span>
          <input aria-label="Filter trophies" onChange={(event) => setQuery(event.target.value)} placeholder="Search name or requirement" type="search" value={query} />
        </label>
        <label>
          <span>Category</span>
          <select aria-label="Trophy category" onChange={(event) => setCategory(event.target.value as TrophyCategory | "All")} value={category}>
            {categories.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
          </select>
        </label>
        <label className="trophy-checklist__toggle">
          <input checked={hideSpoilers} onChange={(event) => setHideSpoilers(event.target.checked)} type="checkbox" />
          <span>Hide spoiler-heavy rows</span>
        </label>
        <span className="trophy-checklist__save-note">Save progress in this browser</span>
      </div>
      <div className="trophy-checklist__list">
        {visibleAchievements.map((entry) => (
          <label className={`trophy-checklist__item${completed.has(entry.id) ? " is-complete" : ""}`} data-achievement-id={entry.id} key={entry.id}>
            <input checked={completed.has(entry.id)} onChange={() => toggleCompleted(entry.id)} type="checkbox" />
            <span>
              <strong>{entry.name}</strong>
              <small>{entry.category} · {entry.requirement}</small>
            </span>
            <em>{entry.spoilerLevel === "major" ? "Spoiler" : entry.spoilerLevel === "minor" ? "Context" : "Safe"}</em>
          </label>
        ))}
      </div>
      {visibleAchievements.length === 0 && <p className="trophy-checklist__empty">No trophy matches that filter.</p>}
    </section>
  );
}
