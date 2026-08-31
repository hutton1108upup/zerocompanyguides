# Zero Company SEO Growth Gates

Last reviewed: 2026-08-31

## Current production baseline

- Production origin: `https://zerocompany-guides.wiki`
- Homepage, `robots.txt`, `sitemap.xml`, `/characters`, `/weapons`,
  `/guides/beginners-guide`, and `/walkthrough` return HTTP 200.
- The production sitemap contains 23 unique canonical URLs.
- The homepage source contains no `localhost` URL.
- Googlebot is allowed through the wildcard robots group. AI search and
  user-request crawlers are allowed separately from model-training controls.

## Query-to-canonical ownership

| Query intent | Current canonical | Split state |
| --- | --- | --- |
| characters, companions, operators | `/characters` | Keep consolidated |
| weapons, weapon stats, weapon mods, best weapon | `/weapons` | Keep consolidated |
| beginner guide, tips, mistakes | `/guides/beginners-guide` | Keep consolidated |
| walkthrough, chapter order | `/walkthrough` | Chapter pages require independent walkthrough evidence |
| permadeath, injuries, Rally, recovery | `/guides/permadeath` | Review candidate; `noindex` until the gate is met |

## Measurement window

Use the first 7 days to observe and annotate queries. Do not split a canonical
from that exploratory window alone. Use a continuous 28-day query-by-page view
for an indexability decision.

Export these Search Console fields for each candidate cluster:

- query
- page
- clicks
- impressions
- CTR
- average position
- country
- device
- date range

Record URL Inspection results for `/`, `/characters`, `/weapons`,
`/guides/beginners-guide`, `/walkthrough`, and any review candidate. Capture
indexing eligibility, user-declared canonical, Google-selected canonical, last
crawl, and live-test status.

## Indexability gate

A candidate may become indexable only when all of the following are true:

1. A stable, distinct query intent is visible in a continuous 28-day GSC view,
   repeated site search, or repeated user feedback.
2. The current canonical cannot answer that intent accurately without becoming
   unfocused.
3. The candidate provides an independent answer, table, workflow, or reproduced
   test rather than a renamed extract of its parent page.
4. The candidate does not compete with an existing page for the same primary
   intent.
5. Its factual claims meet the site's official, source-verified synthesis, or
   first-hand testing boundary.

Until all five checks pass, keep the route `noindex, follow`, exclude it from
the sitemap and navigation, and use a direct local URL for editorial review.

## Current data boundary

The local analytics skill has GSC scripts but no OAuth client or saved token in
its scripts directory. No account-level clicks, impressions, CTR, positions, or
Google-selected canonical values were available for this review. Keyword
difficulty, domain rating, and projected referring-domain budgets from external
reports remain reported estimates rather than site-performance evidence.
