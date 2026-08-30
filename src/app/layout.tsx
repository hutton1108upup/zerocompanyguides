import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import "@/app/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName, siteOrigin } from "@/lib/site";

const displayFont = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
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
      </body>
    </html>
  );
}
