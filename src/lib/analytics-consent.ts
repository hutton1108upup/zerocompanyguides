export const analyticsConsentStorageKey = "zero-company-analytics-consent:v1";
export const analyticsConsentEventName = "zero-company-analytics-consent";

export type AnalyticsConsent = "unknown" | "accepted" | "rejected";

export type AnalyticsStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isAnalyticsConsent(value: string | null | undefined): value is Exclude<AnalyticsConsent, "unknown"> {
  return value === "accepted" || value === "rejected";
}

export function getAnalyticsConsent(storage?: AnalyticsStorage): AnalyticsConsent {
  try {
    const value = storage?.getItem(analyticsConsentStorageKey);
    return isAnalyticsConsent(value) ? value : "unknown";
  } catch {
    return "unknown";
  }
}

export function setAnalyticsConsent(
  consent: Exclude<AnalyticsConsent, "unknown">,
  storage?: AnalyticsStorage,
): void {
  try {
    storage?.setItem(analyticsConsentStorageKey, consent);
  } catch {
    // A blocked browser storage should fail closed for analytics.
  }
}

export function clearAnalyticsConsent(storage?: AnalyticsStorage): void {
  try {
    storage?.removeItem(analyticsConsentStorageKey);
  } catch {
    // A blocked browser storage is already treated as unknown.
  }
}

export function browserAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";
  return getAnalyticsConsent(window.localStorage);
}
