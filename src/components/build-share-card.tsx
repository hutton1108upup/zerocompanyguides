"use client";

import { useState } from "react";

export function BuildShareCard({ code, summary }: { code: string; summary: string }) {
  const [feedback, setFeedback] = useState("Ready to share.");
  const sharePath = `/squad-builder?s=${encodeURIComponent(code)}`;

  const copyBuildLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(sharePath, window.location.origin).toString());
      setFeedback("Build link copied.");
    } catch {
      setFeedback("Clipboard access is unavailable; use the review link.");
    }
  };

  return (
    <section aria-label="Build share card" className="build-share-card">
      <div>
        <span className="card-eyebrow">Portable plan</span>
        <h3>Share-ready build</h3>
        <p>{summary}</p>
        <a href={sharePath}>Open this plan in Squad Builder</a>
      </div>
      <div className="build-share-card__actions">
        <button className="button-chip button-chip--primary" onClick={copyBuildLink} type="button">Copy build link</button>
        <span aria-live="polite">{feedback}</span>
      </div>
    </section>
  );
}
