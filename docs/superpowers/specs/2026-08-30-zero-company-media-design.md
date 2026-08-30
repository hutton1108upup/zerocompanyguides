# Zero Company Media Enrichment Design

## Goal

Add evidence-labeled official imagery and selectively embedded YouTube videos to the existing content registry so long-form pages are easier to scan and understand without turning every route into a media gallery.

## Approved scope

- Preserve the existing Next.js App Router, content registry, canonical routes, evidence metadata, and source list.
- Add reusable image and video content blocks to the current typed block renderer.
- Store approved EA and StarWars.com images locally under `public/media/zero-company/`; do not hotlink production images.
- Use no more than two images and one playable video per ordinary article.
- Use click-to-load `youtube-nocookie.com` embeds so no YouTube iframe loads until the visitor requests it.
- Display source, publisher, evidence kind, checked date, and version or spoiler notes next to media when relevant.
- Add official class icon coverage, official character/gameplay images, performance evidence guidance, and the approved YouTube selections from the 2026-08-30 research pass.
- Keep `/trophy-guide` video-free until a substantive full-guide video exists. Keep `/guides/respec` video-free because the core timing remains press-led. Keep `/system-requirements`, `/multiplayer`, and `/characters/voice-cast` focused and lightweight.
- Community/forum material must remain a cited external evidence link unless author permission is recorded. It must not be copied into the local asset folder.

## Information architecture

Two new content blocks extend the existing `ContentBlock` union:

- `image`: one locally stored editorial image with alt text, caption, source URL, publisher, evidence label, optional priority hint, and optional spoiler marker.
- `video`: one YouTube video card with video ID, title, channel, duration, publication date, editorial description, evidence label, optional hardware/version note, and optional spoiler marker.

`ContentBlocks` delegates these variants to focused `ContentImage` and `ContentVideo` components. The video component is a small client component so the initial response contains only a poster and accessible play button. On activation it replaces the poster with a privacy-enhanced iframe.

## Visual direction

Continue the established industrial command-console aesthetic: dark navy surfaces, cyan evidence accents, amber community accents, angled corners, condensed display typography, and restrained glows. Images appear as tactical evidence plates rather than generic rounded cards. Captions behave like declassified file labels.

## Route coverage

- Homepage and game information: official key art, edition art, official trailer.
- Classes and tier list: official specialization imagery and class explainers.
- Builds: Hawks, customization, bonds, and early-game squad video evidence.
- Guides: official tactical screenshots and official/beginner video explainers.
- Walkthrough: spoiler-safe holotable image and collapsed spoiler-marked long-form video.
- Performance: official setting guidance, dated hardware-specific video evidence, and forum links kept as citations.
- Characters: official lineup and cast imagery.
- Mods: Nexus ecosystem proof only; no trainer or cheat promotion.
- Worth-it: official key art plus one review video, with alternative review as a normal link.

## Accessibility and performance

- Every image has useful alt text; decorative duplication is avoided.
- Captions and media badges are text, not baked into images.
- Images define dimensions through `next/image`, use responsive `sizes`, and lazy-load except explicitly prioritized hero media.
- Video posters use YouTube thumbnails, but the iframe is created only after a button activation.
- Spoiler-marked media is placed in a closed disclosure element.
- Focus states, button labels, and iframe titles remain keyboard and screen-reader accessible.

## Verification

- Registry tests assert approved route coverage, local image paths, valid YouTube IDs, evidence labels, and per-page density limits.
- Component tests assert captions, source links, click-to-load controls, spoiler disclosure, and privacy-enhanced embed URLs.
- Run the complete Vitest suite, ESLint, Next production build, HTTP route audit, browser console audit, mobile/desktop screenshots, and image request checks.
