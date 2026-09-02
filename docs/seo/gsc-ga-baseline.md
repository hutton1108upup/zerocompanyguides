# Zero Company Search and Analytics Baseline

**Snapshot date:** 2026-09-02
**Status:** blocked pending authorized credentials or an exported report

## Current evidence boundary

The repository contains the GA4 measurement integration and the consent gate, but this workspace does not contain a Google OAuth client secret, Google token, GA4 token or Bing API key. No clicks, impressions, CTR, average-position, sessions or country/device trends are claimed here.

Public sitemap, HTTP, canonical and browser checks prove technical rendering only. They do not prove Google or Bing indexing, ranking or traffic.

## Required one-time baseline

Capture the same 28-day window from Search Console, GA4 and Bing Webmaster Tools after consent and production deployment are verified.

### Google Search Console

- Property: `https://zerocompany-guides.wiki/`
- Dimensions: query, page, country, device, date
- Metrics: clicks, impressions, CTR, average position
- Export the top queries and landing pages separately; do not combine branded, mission, build, trophy and performance intents.
- Inspect the homepage, `/squad-builder`, `/classes/tier-list`, `/builds/hawks`, `/trophy-guide`, `/performance/fps-fix`, and every newly added walkthrough URL.

### Google Analytics 4

- Compare landing pages, source/medium, engaged sessions, engagement rate and returning users.
- Track Builder starts, preset loads, secondary-specialization changes, share-copy clicks, local saves, checklist interactions and correction-form starts as anonymous events only.
- Do not send squad contents, claim text, email addresses or evidence URLs as event parameters.

### Bing Webmaster Tools

- Record sitemap processing, indexed/discovered counts and the same page/query exports where available.
- Keep Bing observations separate from GSC; a sitemap HTTP 200 is not a processed sitemap claim.

## Route-opening gate

Open a new indexable route only when the same-intent query/page data shows repeated demand across a 28-day window, the existing canonical page cannot answer it, the page has an independent workflow, and the claims have first-hand or two-source evidence. Otherwise keep the content draft or `noindex, follow`, outside sitemap and global navigation.

## Recheck cadence

- T+48 hours: consent behavior, analytics event delivery after acceptance, HTTP/canonical/robots/sitemap health.
- T+7 days: crawl/index anomalies, Builder usage and correction starts.
- T+28 days: query/page winners, low-CTR opportunities, device/country splits and route-opening decisions.
