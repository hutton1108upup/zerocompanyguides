import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GoogleAnalytics } from "../src/components/google-analytics";
import { MicrosoftClarity } from "../src/components/microsoft-clarity";
import { AnalyticsConsent } from "../src/components/analytics-consent";
import {
  analyticsConsentStorageKey,
  clearAnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "../src/lib/analytics-consent";

function createMemoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("analytics consent", () => {
  it("defaults to unknown and persists accepted or rejected decisions", () => {
    const storage = createMemoryStorage();

    expect(getAnalyticsConsent(storage)).toBe("unknown");
    setAnalyticsConsent("accepted", storage);
    expect(getAnalyticsConsent(storage)).toBe("accepted");
    setAnalyticsConsent("rejected", storage);
    expect(getAnalyticsConsent(storage)).toBe("rejected");
    clearAnalyticsConsent(storage);
    expect(storage.getItem(analyticsConsentStorageKey)).toBeNull();
    expect(getAnalyticsConsent(storage)).toBe("unknown");
  });

  it("server-renders consent controls without active third-party scripts", () => {
    const markup = [
      renderToStaticMarkup(createElement(AnalyticsConsent)),
      renderToStaticMarkup(createElement(GoogleAnalytics)),
      renderToStaticMarkup(createElement(MicrosoftClarity)),
    ].join(" ");

    expect(markup).toContain("Accept analytics");
    expect(markup).toContain("Reject analytics");
    expect(markup).toContain("Manage analytics");
    expect(markup).not.toContain("googletagmanager.com/gtag/js");
    expect(markup).not.toContain("clarity.ms/tag");
  });
});
