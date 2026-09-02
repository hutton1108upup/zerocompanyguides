"use client";

import { useState, type FormEvent } from "react";

const githubIssueUrl = "https://github.com/hutton1108upup/zerocompanyguides/issues/new";

export function CorrectionForm({ pagePath }: { pagePath: string }) {
  const [claim, setClaim] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [platform, setPlatform] = useState("PC");
  const [difficulty, setDifficulty] = useState("Standard");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [preparedUrl, setPreparedUrl] = useState<string | undefined>();
  const [feedback, setFeedback] = useState("Nothing is sent until you open the prepared issue.");

  const prepareCorrection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!claim.trim() || !evidenceUrl.trim()) {
      setPreparedUrl(undefined);
      setFeedback("Add the claim and an evidence URL before preparing the issue.");
      return;
    }

    const body = [
      `page URL: ${pagePath}`,
      `claim to correct: ${claim.trim()}`,
      `evidence link: ${evidenceUrl.trim()}`,
      `game version: ${gameVersion.trim() || "not provided"}`,
      `platform: ${platform}`,
      `difficulty: ${difficulty}`,
    ].join("\n");
    const nextUrl = `${githubIssueUrl}?title=${encodeURIComponent(`Correction: ${claim.trim().slice(0, 80)}`)}&body=${encodeURIComponent(body)}`;
    setPreparedUrl(nextUrl);
    setFeedback("Correction prepared. Review it before opening GitHub.");
  };

  return (
    <section aria-label="Correction form" className="correction-form">
      <div className="correction-form__header">
        <div>
          <span className="card-eyebrow">Evidence loop</span>
          <h2>Something look wrong?</h2>
          <p>Give us the page, claim, version and evidence. Nothing is transmitted until you choose to open the prepared GitHub issue.</p>
        </div>
        <span className="correction-form__page">Current page: {pagePath}</span>
      </div>
      <form onSubmit={prepareCorrection}>
        <label>
          <span>Page URL</span>
          <input readOnly value={pagePath} />
        </label>
        <label>
          <span>Claim to correct</span>
          <textarea onChange={(event) => setClaim(event.target.value)} placeholder="What does the page say that the game or source contradicts?" required value={claim} />
        </label>
        <div className="correction-form__grid">
          <label>
            <span>Game version</span>
            <input onChange={(event) => setGameVersion(event.target.value)} placeholder="e.g. build 24874058" value={gameVersion} />
          </label>
          <label>
            <span>Platform</span>
            <select onChange={(event) => setPlatform(event.target.value)} value={platform}>
              <option>PC</option>
              <option>PlayStation 5</option>
              <option>Xbox Series X|S</option>
              <option>Steam Deck</option>
            </select>
          </label>
          <label>
            <span>Difficulty</span>
            <select onChange={(event) => setDifficulty(event.target.value)} value={difficulty}>
              <option>Story</option>
              <option>Standard</option>
              <option>Hard</option>
              <option>Expert</option>
              <option>Beskar Mode</option>
              <option>Not applicable</option>
            </select>
          </label>
        </div>
        <label>
          <span>Evidence URL</span>
          <input onChange={(event) => setEvidenceUrl(event.target.value)} placeholder="https://..." required type="url" value={evidenceUrl} />
        </label>
        <div className="correction-form__actions">
          <button className="button-chip button-chip--primary" type="submit">Prepare correction</button>
          {preparedUrl && <a className="button-chip button-chip--ghost" href={preparedUrl} rel="noreferrer" target="_blank">Open prefilled issue</a>}
          <span aria-live="polite">{feedback}</span>
        </div>
      </form>
    </section>
  );
}
