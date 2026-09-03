# Zero Company Intel

An unofficial, evidence-labeled guide site for *Star Wars Zero Company*. The site covers an account-free Squad Builder, builds, classes, walkthrough preparation, achievements, performance guidance, characters, purchase decisions, and editorial maintenance across 28 public routes plus one review-only route.

This fan-made project is not affiliated with EA or Lucasfilm.

## Editorial model

Player-facing claims are separated by provenance:

- **Official** — EA, Steam, StarWars.com, and first-party video or support pages.
- **Community** — attributed press testing, developer Q&A reporting, and player reports.
- **Unverified** — not published as indexable content until the evidence threshold is met.

The source registry used by the website lives in `src/content/sources.ts`. Editorial context is documented in [`docs/editorial/source-ledger.md`](docs/editorial/source-ledger.md).

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

For production builds, set `NEXT_PUBLIC_SITE_URL` to the public site origin. Deployments with `VERCEL_ENV=production` intentionally fail when that variable is missing.

## Validation

```bash
npm run test:run
npm run lint
npx tsc --noEmit
npm run build
```

After starting the production server, the route and SEO audit can be run with:

```powershell
$env:BASE_URL = "http://127.0.0.1:3000"
node scripts/audit-pages.mjs
```

## Project documentation

- [Frontend design baseline](docs/product/frontend-design.md)
- [Site architecture and publishing gates](docs/product/site-architecture.md)
- [Editorial source ledger](docs/editorial/source-ledger.md)
- [Keyword research snapshot](docs/editorial/keyword-research-2026-08-30.md)

Generated output such as `.next/`, `node_modules/`, browser screenshots, and TypeScript build metadata is intentionally excluded from Git.
