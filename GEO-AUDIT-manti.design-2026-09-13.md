# GEO Audit Report: Manti UI

**URL**: https://manti.design
**Date**: 2026-09-13
**Business Type**: SaaS / developer tool (open-source component library documentation)
**Scoring Model**: v2

---

## GEO Score: 59/100 (Grade C: Developing)

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Technical Accessibility | 99/100 | 20% | 19.80 |
| Content Citability | 57/100 | 35% | 19.95 |
| Structured Data | 60/100 | 20% | 12.00 |
| Entity & Brand | 30/100 | 25% | 7.50 |
| **Composite** | | | **59/100** |

Raw sub-dimension scores were adjusted for the SaaS profile (Citability → Answer Blocks +10%, Schema → AI-Boost +15%, Technical → Rendering +10% capped at max, Brand → Community Signals +10%).

The technical layer is close to perfect: every one of the 11 AI crawlers tested receives fully prerendered HTML, `llms.txt` is a model implementation, and no bot is blocked anywhere. The score is held down entirely by the two layers that decide whether an AI *quotes* you rather than merely reads you: the content never states what Manti UI is in body copy an engine can extract, and the brand has essentially no off-site corroboration while colliding hard with Mantine in every search index. Nothing here is a crawl problem; it is an answerability and entity problem.

---

## Critical Issues

1. **Brand-name collision with Mantine suppresses every citation (Brand, −5 entity + poisons all downstream).** Searches for "Manti UI" and `@manti-ui/react` return Mantine, Mantis UI, Mantle UI, and the Wikipedia article on the Turkish dish. One search assistant answered that `@manti-ui/react` "may be a typo" of `@mantine`. In the absence of corroborating entity records, AI systems substitute a competitor.
2. **Zero community footprint (Brand, −20 of 25).** 0 Reddit threads, 0 Hacker News submissions, 0 Dev.to posts, 0 Stack Overflow questions, 0 YouTube coverage. Perplexity draws 46.7% of its citations from Reddit; the project is invisible on that surface.
3. **No Wikidata entity (Brand, −12).** Wikipedia is unrealistic at 14 stars, but Wikidata has no notability bar for a published package, and it is the single record that would also resolve the Mantine collision.

## High Priority Issues

4. **The product is never defined in body copy (Citability, −2 to −3).** "Manti UI is a framework-agnostic design system on Zag.js" appears only in the meta description and footer boilerplate. The homepage H1 is "Calm components, built to adapt." An AI asked "what is Manti UI?" has no in-body sentence to cite.
5. **No FAQ or question-form content anywhere (Citability −4, Schema −8).** Zero Q&A headings across all 10 audited pages. This is the single largest combined loss on the scorecard and it blocks `FAQPage` schema at the same time.
6. **No visible author attribution or expertise signals (Citability, −9).** JSON-LD `author` is the Organization; no human byline, maintainer bio, or expert quote renders anywhere.
7. **No `HowTo` schema on tutorial pages (Schema, −6).** `/getting-started` is a textbook HowTo (Install → Import CSS → Render → Theme) and emits none.
8. **No `speakable` on any TechArticle (Schema, −5).** A direct AI answer-selection signal costing one object literal.
9. **Almost no quantitative data in prose (Citability, −3).** The site knows its numbers (53 components, 12-stop ramps, 3 token tiers, 7 variants, WCAG 2.2 AA) but they live in tiles and table cells, which extract poorly.

## Medium Priority Issues

10. **`sameAs` has only 2 entries (Schema, −4)** — threshold for full marks is 3+.
11. **`author` is an Organization reference, not a `Person` (Schema, −4)** — scores as entity reference, not authored expertise.
12. **Organization node missing `description` and `contactPoint` (Schema, −6 combined).**
13. **Passages depend on the page title for their subject (Citability, −3).** Sentences open with a bare prop name: "`size` selects a stop…" — extracted alone, none says which component.
14. **No visible published/updated dates (Citability, −3).** The dates exist in the prerender pipeline and JSON-LD but never render.
15. **No source citations for any claim (Citability, −4).** "WCAG 2.2 AA target" is asserted without linking the W3C criteria or the repo's own contrast gate.
16. **`SoftwareApplication` incomplete and homepage-only (Schema, −3)** — no `softwareVersion`, `license`, `codeRepository`, `programmingLanguage`, `featureList`.
17. **Brand name is spelled two ways (Brand, −4).** "Manti UI" on the site and npm; "Mantı UI" (dotless ı) as the GitHub org display name and README H1. The dotless ı tokenizes differently in AI indexes.
18. **Paragraphs average 1.0–2.0 sentences (Citability, −2).** The extraction band is 2–4.
19. **Heading-only sections with no prose (Citability, −1 each).** On every component page, "## Sizes", "## API", "## Styling" are headings followed immediately by a React demo.
20. **Meta descriptions are 45–77 characters (Technical, −1).** Target is 120–160; none reaches 120.

## Low Priority / Non-scoring but real

21. **Soft 404s.** Any unknown URL returns HTTP 200 with the SPA shell — verified on `/this-page-does-not-exist-xyz`, `/llms-full.txt`, `/.well-known/llms.txt`, `/sitemap_index.xml`. Crawlers can index unlimited junk URLs as valid pages.
22. **Every sitemap URL 301-redirects.** All 94 `<loc>` entries are slash-less; Netlify pretty-URLs redirect each to the trailing-slash form. The `<link rel="canonical">` target is itself a redirect.
23. **No `llms-full.txt`,** though all 94 routes are already prerendered.
24. **`BreadcrumbList` is flat at 2 levels** on 3-level routes; the `group` frontmatter needed to fix it already exists but is not threaded into `BuildPage`.
25. **"0 forks / Stable styling anatomy" on the landing page** reads out of context as "nobody forked this project" — an anti-signal an AI may quote literally.

No prompt-injection attempts were detected in any fetched content.

---

## Detailed Analysis

### 1. Technical Accessibility (99/100)

#### Sub-scores
- AI Crawler Access: 35/35
- Rendering & Content Delivery: 22/22
- Speed & Accessibility: 18/18
- Meta & Header Signals: 12/13
- Multimedia Accessibility: 12/12

**Crawler access — perfect.** `robots.txt` carries one `User-agent: *` / `Allow: /` block, a single narrow `Disallow: /storybook/iframe.html`, and a `Sitemap:` directive. All 11 AI crawlers were live-tested with their real user agents — GPTBot, Google-Extended, ClaudeBot, Bytespider, PerplexityBot, Applebot-Extended, CCBot, cohere-ai, Amazonbot, FacebookBot, Meta-ExternalAgent — and every one received HTTP 200 with an identical payload, confirming no UA-based blocking or cloaking. No `X-Robots-Tag` anywhere.

**Rendering — the strongest possible result for a SPA.** Despite being a Vite SPA, every route ships fully prerendered markup inside `<div id="root">` via `scripts/prerender.mjs`. Measured: homepage ~11 KB of markup, `/typography/text` 5,081 chars, `/components` 3,556, `/components/button` 3,518. Code samples, prop tables and token tables are all real HTML text — zero JS execution required.

**llms.txt — exemplary.** 483 lines, 17.8 KB, correct `text/plain`, H1 + blockquote summary, install commands, runnable code, global controls, a six-category component index, a package map, agent contribution rules, and 76 absolute URL references back into the docs.

**Speed and delivery.** HTTPS with HSTS (`max-age=31536000`); HTTP and `www` both 301 to the canonical apex. Brotli compresses 29,217 bytes to 7,775 (73%). Warm response 0.40–0.50s (cold 2.36s, dominated by a 1.78s TLS handshake). Valid sitemap, 94 URLs, each with `lastmod`/`changefreq`/`priority`.

**Only scored loss**: meta descriptions are 45–77 characters against a 120–160 target (`/components` is 45 chars, the longest on the site is 77).

### 2. Content Citability (57/100)

#### Sub-scores
- Answer Block Quality: 13/20
- Self-Containment: 10/18
- Statistical Density: 10/17
- Structural Clarity: 13/17
- Expertise Signals: 1/13
- AI Query Alignment: 10/15

#### Top Citable Passages

> "Import Manti before Tailwind… The order keeps Tailwind utilities above Manti component styles… If Tailwind is imported first, utility overrides may lose to the Manti layer." — `/guides/tailwind`

The highest-value passage on the site: it answers a real long-tail query ("why do my Tailwind classes not override my component library?") and names the failure mode.

> "`loading` blocks interaction, shows a Spinner, and preserves the button width." — `/components/button`

Three concrete behaviors in one sentence, zero preamble. The model the rest of the site should follow.

> "Use a component token only when that component should intentionally differ. Derived geometry stays private as `--_*`." — `/foundations/tokens`

> "Manti UI publishes a machine-readable project guide at manti.design/llms.txt. It covers installation, public APIs, components, tokens, styling rules, accessibility, and verification." — `/working-with-ai`

Rare on this site in that it opens with the subject.

> "`size` selects a stop on the same scale the tokens expose, from `xs` through `5xl`. Line height and tracking tighten automatically as the size grows, because body leading on a display size reads as loose rather than generous." — `/typography/text`

Explains the *why*, which is what AI engines quote — but "`size`" has no subject once extracted.

#### Improvement Opportunities

**Homepage entity definition** (`src/doc/LandingPage.tsx`): replace "Accessible components powered by framework-agnostic tokens, CSS, and state machines" with a sentence that names the entity and carries data — "Manti UI is an open-source React component library built on Zag.js state machines. It ships 53 accessible components that target WCAG 2.2 AA, styled entirely from a three-tier design-token contract."

**Add an FAQ** to `src/content/getting-started.mdx` with 4–6 question headings: "Does Manti UI require Tailwind?", "How is Manti UI different from Radix UI or shadcn/ui?", "Is Manti UI accessible?", "Do I need to install Zag.js separately?", "Does Manti UI work with Next.js App Router?" Each with a 2–3 sentence direct answer.

**Give every heading-only section one prose sentence.** "## Sizes" on `/components/button` → "Button renders at three sizes — `sm`, `md`, and `lg` — resolved from the shared `--manti-size-*` channel, so a `lg` Button lines up with a `lg` Input on the same row."

**Prefix the component name once per section** so passages survive extraction: "Text's `size` prop selects…", "Button's `loading` prop blocks interaction…".

**Render the dates that already exist.** "Last updated 30 July 2026" under each page H1 — display-only, the data is already in the prerender pipeline.

### 3. Structured Data (60/100)

#### Sub-scores
- Core Identity Schema: 18/30
- Content Schema: 16/25
- AI-Boost Schema: 9/25
- Schema Quality: 17/20

All 10 pages return exactly one `application/ld+json` block, prerendered, with no microdata or RDFa anywhere. Home emits `Organization` + `WebSite` + `SoftwareApplication`; every other page emits `Organization` + `WebSite` + `TechArticle` + `BreadcrumbList`. Syntax is clean across all 10: valid JSON, correct `@context`, no deprecated properties, correct `@id` cross-references. The single source is `structuredData()` in `packages/docs/src/seo/head.ts`.

What is missing is the AI-boost tier entirely: no `FAQPage`, no `HowTo`, no `speakable`, no `Person` author, and a `SoftwareApplication` that omits version, license, repository, language, and requirements. `BreadcrumbList` is always exactly 2 levels even on 3-level routes.

#### Ready-to-Use JSON-LD

Full templates for the completed `Organization`, a complete `SoftwareApplication`, `HowTo` for `/getting-started`, `FAQPage`, a 3-level `BreadcrumbList`, `TechArticle` with `speakable` + `Person` author, `SoftwareSourceCode` for component pages, `ItemList` for `/components`, and a `DefinedTermSet` for the token contract are implemented directly in `packages/docs/src/seo/head.ts` as part of this optimization pass.

### 4. Entity & Brand (30/100)

#### Sub-scores
- Entity Recognition: 9/30
- Third-Party Presence: 4/25
- Community Signals: 3/25
- Cross-Source Consistency: 14/20

#### Hard numbers (public APIs, 2026-09-13)

| Metric | Value |
|---|---|
| npm `@manti-ui/react` downloads (30d) | 4,870 |
| npm versions published | 16 (latest 0.11.0) |
| npm first publish | 2026-06-22 (~3 months old) |
| GitHub stars / forks / watchers | 14 / 1 / 0 |
| GitHub org followers / repos | 3 / 2 |
| Hacker News mentions | 0 |
| Reddit mentions | 0 |
| Stack Overflow questions | 0 (no tag exists) |
| Wikipedia / Wikidata entities | 0 / 0 |

The download-to-star ratio (4,870 monthly against 14 stars and 0 watchers) indicates most npm traffic is CI, mirror and registry-crawler traffic rather than adopters. Do not present 4,870 as an adoption number.

#### Platform Presence Map

| Platform | Present? | Evidence |
|---|---|---|
| manti.design | Yes — complete | Full meta, OG/Twitter cards, `@graph` JSON-LD |
| studio.manti.design | Yes | "Manti UI Theme Studio", indexed |
| npm registry | Yes — complete | 4 scoped packages, keywords, `homepage` backlink |
| GitHub org + repo | Yes — active, low traction | MIT, topics set, homepage backlink, 14 stars |
| Wikipedia | No | 0 hits; the `Manti` article is the Turkish dish |
| Wikidata | No | `wbsearchentities` returns `[]` |
| LinkedIn | No | `/company/manti-ui/` → 404 |
| Product Hunt | No | `/products/manti-ui` and `/posts/manti-ui` → 404 |
| Crunchbase | No | No listing surfaced |
| G2 / Capterra / Trustpilot | No | Not a realistic channel for an OSS library |
| AlternativeTo / StackShare | No | No entries |
| Reddit | No | 0 results for both queries |
| Hacker News | No | Algolia: 0 hits |
| Dev.to | No | Search API returns `[]` |
| Stack Overflow | No | 0 questions, no tag |
| X / Twitter | No | No account; `twitter:site` absent from meta |
| YouTube | No | `@mantiui` is an unrelated personal channel |
| Awesome-lists | No | Not in any Zag.js, design-system, or React list |

The on-site entity work is above average for a 3-month-old project. Everything missing is off-site.

---

## Platform-Specific Recommendations

### ChatGPT (authority-heavy; Wikipedia = 47.9% of citations)
- Create the Wikidata item — it is the only realistic authority record at this stage, and it simultaneously disambiguates from Mantine.
- Add the `Person` author node and a visible maintainer byline so the content has an attributable expert.

### Perplexity (freshness-heavy; Reddit = 46.7% of citations)
- One r/reactjs and one r/webdev post are worth more here than any on-site change.
- Render visible "Last updated" dates; Perplexity weights recency it can see.

### Gemini (brand-site preference; 52% of citations from brand domains)
- Complete the `Organization` and `SoftwareApplication` nodes — Gemini reads brand-site structured data directly, and this is the dimension where the site already has the machinery in place.
- Extend `sameAs` past the 3-profile threshold.

### Google AI Overviews (traditional ranking + structured data)
- Ship `FAQPage` and `HowTo`; these are the two types AI Overviews surfaces most for developer queries.
- Fix the soft 404s and the sitemap redirect chain — both waste crawl budget on a 94-URL site.

### Claude (primary sources preferred; 91.2% attribution accuracy)
- Add the statistics to prose and cite the WCAG criteria and the repo's own contrast gate; Claude preferentially quotes self-contained passages that carry their own evidence.
- Generate `llms-full.txt` — it is the single most Claude-friendly artifact available and all 94 routes are already prerendered.

*Only 11% of domains are cited by both ChatGPT and Perplexity. Platform-specific optimization compounds.*

---

## Quick Wins

1. **Complete the `Organization` + `SoftwareApplication` nodes and extend `sameAs`** — confined to two files, ~45 minutes, +11 schema points.
2. **Add `speakable` to `TechArticle`** — one object literal, +5 schema points.
3. **Add the FAQ section to `/getting-started` and emit `FAQPage`** — +8 schema and +4 citability, the largest single win on the board.
4. **Emit `HowTo` from the existing `toc` on `/getting-started`** — the step data already exists in `pages.ts`, +6 schema points.
5. **Render visible "Last updated" dates** — display-only, the data is already in the prerender pipeline, +3 citability points.

---

## 30-Day Roadmap

### Week 1: Foundation
Complete the schema layer in `head.ts`/`meta.ts` (Organization, SoftwareApplication, speakable, Person author, 3-level breadcrumbs, `sameAs`). Fix the soft 404s and the sitemap/canonical trailing-slash mismatch in `netlify.toml` and `head.ts`. Generate `llms-full.txt` in the prerender script. Standardize the brand on ASCII "Manti UI" across the GitHub org name and README H1.

### Week 2: Content
Ship the FAQ on `/getting-started` plus `FAQPage` and `HowTo` schema. Rewrite the homepage lede to define the entity. Extend every meta description to 120–160 characters. Add one prose sentence under each heading-only section on component pages. Prefix component names in prop descriptions.

### Week 3: Authority
Create the Wikidata item. Submit PRs to `awesome-react-components`, `awesome-design-systems`, and the Zag.js ecosystem list. Register the X and Bluesky handles and add `twitter:site`. Set the GitHub org website field. Publish "Show HN: Manti UI — a design system on Zag.js behavior machines" and one r/reactjs post.

### Week 4: Optimization
Add the statistics to prose and cite upstream sources. List on AlternativeTo and StackShare as a Mantine/Radix/Chakra alternative. Add the `/search?q=` route and `SearchAction`. Re-run `/geo-monitor https://manti.design` against this report as the baseline.

---

## Diagnostic vs. Measurement

This audit identifies **what to fix** (diagnostic). [AIvsRank.com](https://aivsrank.com?ref=geo-audit) measures **how visible you actually are** across AI platforms — tracking real mentions in ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews.

Together, they give you the complete picture. Get your AI visibility score: https://aivsrank.com

---

## What was applied in this pass

Everything below is in the working tree and verified by a full `pnpm verify` plus a docs build. None of it is live until the site is redeployed, so re-running `/geo-monitor https://manti.design` against this report is only meaningful after a deploy.

### Structured data (`packages/docs/src/seo/`)

- `Organization` gained `description`, `alternateName`, `disambiguatingDescription` (the explicit "not Mantine / Mantis UI / Mantle UI" statement) and a `contactPoint`.
- `sameAs` went from 2 profiles to 4 (repo, GitHub org, npm package, npm org), past the 3-profile threshold.
- `SoftwareApplication` is now complete: `softwareVersion` (read from the published `@manti-ui/react`), `license`, `codeRepository`, `programmingLanguage`, `runtimePlatform`, `softwareRequirements`, `downloadUrl`, `installUrl`, `screenshot`, a six-entry `featureList`, `isAccessibleForFree`, and an `Offer` with `availability` and `url`.
- A `Person` author node was added and `TechArticle.author` now points at it, with the Organization kept as `publisher`.
- Every `TechArticle` gained a `speakable` block and an `about` reference to the software entity.
- `BreadcrumbList` is three levels where a real section index exists (`/components/button` now reads Home → Components → Button).
- `FAQPage` and `HowTo` are emitted from new `faq:` and `howto:` frontmatter, so the structured data is generated from the same array the page renders.

### Content

- `/getting-started` gained a six-question FAQ (visible and in `FAQPage`) and a four-step `HowTo`, plus an opening paragraph that defines the entity.
- The homepage lede now names Manti UI and carries three data points instead of describing components abstractly.
- The "0 forks" proof-strip tile became "0 ejects / Restyle without forking".
- All 93 meta descriptions were rewritten into the 120-160 character band, each grounded in what its page actually documents.
- A visible "Last updated" date renders on every documentation page, from the same git history the JSON-LD reads.
- `llms.txt` gained a "What Manti UI is" section with the entity definition, the Mantine disambiguation, and a comparison against Radix, shadcn/ui and Mantine.
- The repository README now opens with the canonical positioning and uses the ASCII spelling.

### Technical

- Unknown URLs return a real **404** instead of a 200 SPA shell. The prerenderer emits `dist/404.html` (noindex) and `netlify.toml` serves it with `status = 404`.
- Canonicals and every `sitemap.xml` entry now carry the trailing slash the deploy actually serves, removing a 301 hop from 94 URLs.
- **`llms-full.txt`** is generated at build time: the whole corpus, 135 KB, in one fetch.
- `robots.txt` names 16 AI crawlers explicitly and points at both llms files.

### Verified

`pnpm verify` exits 0. The docs build prerenders 93 routes plus `404.html`, `sitemap.xml` and `llms-full.txt`; all 94 JSON-LD blocks parse as valid schema.org JSON.

### Not done: the off-site half

The Brand dimension (25% of the score, currently 30/100) cannot be fixed from this repository. These are account-level actions for a human:

1. Create the **Wikidata** item for Manti UI (instance of: free software library; official website, source repository, license, programmed in). This is the single highest-value item, and it also resolves the Mantine collision at the entity level.
2. Post **"Show HN: Manti UI"**, one r/reactjs post, and one Dev.to article.
3. Submit PRs to `awesome-react-components`, `awesome-design-systems`, and the Zag.js ecosystem list.
4. Register the `@mantiui` X and Bluesky handles, then add `twitter:site` and extend `ORG_PROFILES` in `packages/docs/src/seo/meta.ts`.
5. Set the GitHub **organization** website field to `https://manti.design` and change the org display name from "Mantı UI" to "Manti UI".
6. List on AlternativeTo and StackShare as a Mantine/Radix/Chakra alternative.

---

*Generated by [geo-audit](https://github.com/Cognitic-Labs/geoskills) — an open-source GEO diagnostic skill*
*Scoring methodology based on research from Princeton, Georgia Tech, BrightEdge, and 101 industry sources*

<!-- GEO-AUDIT-META
scoring_model: v2
url: https://manti.design
date: 2026-09-13
business_type: SaaS
geo_score: 59
grade: C
technical: 99
citability: 57
schema: 60
brand: 30
GEO-AUDIT-META -->
