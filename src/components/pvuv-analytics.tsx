"use client";

import { useEffect } from "react";
import {
  analyticsConsentEventName,
  browserAnalyticsConsent,
} from "../lib/analytics-consent";

const scriptId = "pvuv-analytics";

export function PvuvAnalytics() {
  useEffect(() => {
    const sync = () => {
      const existing = document.getElementById(scriptId);

      if (browserAnalyticsConsent() !== "accepted") {
        if (existing) {
          existing.remove();
          // Reload to stop PVUV's already registered listeners and timers.
          window.location.reload();
        }
        return;
      }

      if (existing) return;

      const script = document.createElement("script");
      script.id = scriptId;
      script.defer = true;
      script.src = "https://www.pvuv.ai/f.js";
      script.dataset.site = "dwuj3Vqp";
      script.dataset.api = "https://in.pvuv.ai";
      document.head.appendChild(script);
    };

    sync();
    window.addEventListener(analyticsConsentEventName, sync);
    return () => window.removeEventListener(analyticsConsentEventName, sync);
  }, []);

  return null;
}
