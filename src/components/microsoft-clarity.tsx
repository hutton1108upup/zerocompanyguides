"use client";

import { useEffect } from "react";
import {
  analyticsConsentEventName,
  browserAnalyticsConsent,
} from "../lib/analytics-consent";

const clarityBootstrap = `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "yajf5sc56v");
`;

export function MicrosoftClarity() {
  useEffect(() => {
    const sync = () => {
      const existing = document.getElementById("microsoft-clarity");
      if (browserAnalyticsConsent() !== "accepted") {
        existing?.remove();
        return;
      }
      if (existing) return;
      const script = document.createElement("script");
      script.id = "microsoft-clarity";
      script.textContent = clarityBootstrap;
      document.head.appendChild(script);
    };

    sync();
    window.addEventListener(analyticsConsentEventName, sync);
    return () => window.removeEventListener(analyticsConsentEventName, sync);
  }, []);

  return null;
}
