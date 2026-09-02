"use client";

import { useEffect, useState } from "react";
import {
  analyticsConsentEventName,
  browserAnalyticsConsent,
  clearAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent as AnalyticsConsentState,
} from "../lib/analytics-consent";

function notifyConsentChange() {
  window.dispatchEvent(new CustomEvent(analyticsConsentEventName));
}

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<AnalyticsConsentState>("unknown");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setConsent(browserAnalyticsConsent()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const decide = (next: Exclude<AnalyticsConsentState, "unknown">) => {
    setAnalyticsConsent(next, window.localStorage);
    setConsent(next);
    notifyConsentChange();
  };

  const manage = () => {
    clearAnalyticsConsent(window.localStorage);
    setConsent("unknown");
    notifyConsentChange();
  };

  if (consent === "unknown") {
    return (
      <aside aria-label="Analytics consent" className="analytics-consent" data-analytics-consent="unknown">
        <div>
          <strong>Help improve this guide</strong>
          <p>Optional analytics show which pages and tools need clearer answers. No account or game data is collected.</p>
        </div>
        <div className="analytics-consent__actions">
          <button className="button-chip button-chip--primary" onClick={() => decide("accepted")} type="button">Accept analytics</button>
          <button className="button-chip button-chip--ghost" onClick={() => decide("rejected")} type="button">Reject analytics</button>
          <button className="button-chip button-chip--subtle" onClick={manage} type="button">Manage analytics</button>
        </div>
      </aside>
    );
  }

  return (
    <button
      aria-label="Manage analytics consent"
      className="analytics-consent__manage"
      data-analytics-consent={consent}
      onClick={manage}
      type="button"
    >
      Manage analytics
    </button>
  );
}
