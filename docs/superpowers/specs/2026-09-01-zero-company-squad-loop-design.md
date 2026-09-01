# Zero Company Squad Product Loop Design

## Goal

Turn the existing evidence-labeled guide registry into a small product loop: reusable squad data powers an account-free Squad Builder, the tool is discoverable from the site shell, and corrections/updates provide a real maintenance path.

## Scope

- Add normalized Specialization, Operator, weapon, preset, and evidence records used by the Builder.
- Add deterministic, explainable squad findings and dimension evaluations; never emit one opaque overall score.
- Add a `/squad-builder` public tool page with four slots, curated presets, versioned local saving, and a share URL.
- Add indexable `/corrections` and `/updates` editorial pages with an actual GitHub issue route and an honest change log.
- Add a standalone Organization JSON-LD node that identifies the site and links its publishing principles to `/corrections`.
- Add the new routes to metadata, sitemap, search, header, footer, related links, and homepage discovery.

## Non-goals

- No GSC, GA4, or Bing performance claims without credentials.
- No account system, public submissions, voting, comments, forum, database, email, or deployment.
- No programmatic class, Operator, Ability, Talent, or Weapon Mod pages without the existing GSC/evidence/cannibalization gate.
- No claim that a source-backed rule is first-hand tested by this site.

## Architecture

`src/content/squad-data.ts` owns the normalized static records. `src/lib/squad-builder.ts` owns pure validation, evaluation, and share-code behavior. `src/components/squad-builder.tsx` is the only client-side Builder boundary and consumes those pure modules. The existing catch-all content route renders the Builder through a new content block, so canonical metadata, breadcrumbs, sitemap, search, related links, and evidence presentation stay consistent with the rest of the site.

Editorial routes use a new `editorial` evidence/page status rather than pretending site policy is an EA-official game claim. Empty editorial source arrays do not render an empty Source Ledger.

## Builder behavior

- Four squad slots are always visible.
- Story mode requires Hawks; Skirmish does not.
- Named Operators cannot appear twice; Custom Operator can.
- Tel-Rea and Cly retain their locked exotic Specializations.
- Findings separate source-backed constraints from source-verified synthesis.
- Evaluations cover range, action economy, Advantage, survivability, control, mobility, and role coverage.
- Unknown or untested values remain explicit; the engine does not invent exact damage, hit chance, or optimal rankings.
- The share code is human-readable, versioned, validated on decode, and ignored when malformed.
- Local storage uses a versioned key and is read only after hydration.

## SEO decisions

- `/squad-builder`, `/corrections`, and `/updates` are differentiated public pages and are indexable.
- Share state stays in a query parameter on the canonical `/squad-builder` page; no saved-state URL is added to the sitemap.
- No thin entity pages are created in this implementation.

## Verification

- TDD unit tests for data integrity, rule findings, dimension evaluation, share-code round trips, malformed input, locked classes, and duplicate handling.
- Static-render tests for the Builder page, homepage CTA, navigation/search/sitemap coverage, editorial evidence labels, and Organization JSON-LD.
- Full Vitest, ESLint, TypeScript, production build, route audit, and desktop/mobile browser checks.
