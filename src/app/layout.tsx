import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "@/app/globals.css";
import { AdvertisingScripts } from "@/components/advertising-scripts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MicrosoftClarity } from "@/components/microsoft-clarity";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { siteDescription, siteName, siteOrigin } from "@/lib/site";

const displayFont = localFont({
  src: "../../public/fonts/orbitron-latin.woff2",
  weight: "700 900",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});

const bodyFont = localFont({
  src: "../../public/fonts/inter-latin.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--font-sans",
});

const monoFont = localFont({
  src: "../../public/fonts/jetbrains-mono-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: siteName,
  description: siteDescription,
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <div className="app-shell">
          <a className="skip-link" href="#site-content">
            Skip to content
          </a>
          <SiteHeader />
          <div className="site-main" id="site-content">
            {children}
          </div>
          <SiteFooter />
        </div>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <AnalyticsConsent />
        <AdvertisingScripts />
      </body>
    </html>
  );
}
