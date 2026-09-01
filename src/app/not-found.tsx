import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Zero Company Intel",
  description: "The requested Zero Company Intel route could not be found.",
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="container not-found-panel">
        <p className="hud-label">Error // 404</p>
        <h1>Page not found</h1>
        <p className="not-found-panel__lead">
          This route is not part of the approved Zero Company guide map. Use the site search above or return to a core intelligence lane.
        </p>
        <div className="not-found-panel__actions">
          <Link className="button-chip button-chip--primary" href="/">Return to headquarters</Link>
          <Link className="button-chip button-chip--ghost" href="/walkthrough">Browse walkthroughs</Link>
        </div>
        <nav aria-label="Suggested guide routes" className="not-found-routes">
          <Link href="/builds"><span>Squad planning</span><strong>Builds</strong></Link>
          <Link href="/walkthrough"><span>Campaign route</span><strong>Walkthrough</strong></Link>
          <Link href="/performance"><span>Technical support</span><strong>Performance</strong></Link>
        </nav>
      </section>
    </main>
  );
}
