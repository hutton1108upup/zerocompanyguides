"use client";

import { useEffect } from "react";
import {
  analyticsConsentEventName,
  browserAnalyticsConsent,
} from "../lib/analytics-consent";

export const googleAnalyticsMeasurementId = "G-V8KC7HD1PW";

const googleAnalyticsBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsMeasurementId}');
`;

function removeGoogleAnalyticsScripts() {
  document.getElementById("google-analytics-loader")?.remove();
  document.getElementById("google-analytics-bootstrap")?.remove();
}

export function GoogleAnalytics() {
  useEffect(() => {
    const sync = () => {
      if (browserAnalyticsConsent() !== "accepted") {
        removeGoogleAnalyticsScripts();
        return;
      }

      if (!document.getElementById("google-analytics-loader")) {
        const loader = document.createElement("script");
        loader.async = true;
        loader.id = "google-analytics-loader";
        loader.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`;
        document.head.appendChild(loader);
      }
      if (!document.getElementById("google-analytics-bootstrap")) {
        const bootstrap = document.createElement("script");
        bootstrap.id = "google-analytics-bootstrap";
        bootstrap.textContent = googleAnalyticsBootstrap;
        document.head.appendChild(bootstrap);
      }
    };

    sync();
    window.addEventListener(analyticsConsentEventName, sync);
    return () => window.removeEventListener(analyticsConsentEventName, sync);
  }, []);

  return null;
}
