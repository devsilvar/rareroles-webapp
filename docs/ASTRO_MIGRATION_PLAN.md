# RareRoles — Astro Migration Plan (Landing Pages → Astro, Dashboard stays React)

**Status:** Plan v4 — fourth senior review pass completed; execution mechanics validated.
**Date:** 2026-08-27 · **Git baseline:** `f72c655` (main) · branch `arena/01a043b1-rareroles-webapp`

> Scope agreement (locked in pass 3): **the dashboard is not converted to Astro.** Landing pages → Astro SSG; the `/admin` dashboard stays exactly the React app it is today, mounted under Astro without rewrites. Repo gets monorepo-_style_ internal boundaries (`src/pages` = routes only, `src/admin` = the React app) but remains one package/one build — see §2.1 for the full monorepo-vs-single-package decision.

---

## Pass-3 review log — what passes 1+2 still missed (verified against source)

| #    | Finding                                                                                                                                                                                               | Why it breaks things                                                                                                                                                                              | Correction                                                                                                                                                                                                                                                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P3-1 | **23 `.tsx` files live inside `src/pages/`** (13 admin pages, 6 public, 4 dead). With `@astrojs/react` installed, **`.tsx` files in `src/pages/` become Astro routes**                                | Astro would emit junk routes (`/Home`, `/admin/OverviewPage`…) — and admin pages would render **without `ProtectedRoute`** (auth gating lives in `App.tsx`, not the page files) at crawlable URLs | **Mandatory Phase-1 structural step:** relocate admin React pages `src/pages/admin/**` → `src/admin/pages/**` (pure `git mv` + import patch, proven by the still-green Vite build) _before_ Astro onboarding. Public `.tsx` pages are removed as each is converted. Acceptance test: `/admin/OverviewPage`, `/Home` return 404 |
| P3-2 | **The SPA catch-all exists twice** — `netlify.toml` AND `public/_redirects` (`/* → /index.html 200`)                                                                                                  | Editing only `netlify.toml` leaves the copy in `public/`, which Astro faithfully copies into `dist/` → 404s and static assets still swallowed, exactly what we removed it to fix                  | Cutover diff touches **both**: netlify.toml + delete `public/_redirects`                                                                                                                                                                                                                                                       |
| P3-3 | **`robots.txt` hardcodes** `Sitemap: https://rarerolestechnologies.com/sitemap.xml`, and `public/sitemap.xml` already lists exactly the 7 canonical URLs                                              | `@astrojs/sitemap` (proposed in v2) emits `sitemap-index.xml`/`sitemap-0.xml`, not `/sitemap.xml` → either robots repointing or a stale duplicate                                                 | **Drop `@astrojs/sitemap`.** Keep the hand-maintained `public/sitemap.xml` (zero drift, zero new behavior). Revisit only if page count grows                                                                                                                                                                                   |
| P3-4 | **`vite build` and `astro build` both default to `dist/`**                                                                                                                                            | During the coexistence phases (1–4) the two builds trample each other's output                                                                                                                    | Temporary `outDir: "dist-astro"` (+ gitignore) until Phase 5; Vite `dist/` stays the deployed artifact until cutover                                                                                                                                                                                                           |
| P3-5 | **`@cloudinary/react` has zero imports** (only `@cloudinary/url-gen` is used, inside `lib/cloudinary-utils.ts`)                                                                                       | Dead dependency inflates install/bundle surface                                                                                                                                                   | Added to cleanup list (re-verify at Phase 5, then remove)                                                                                                                                                                                                                                                                      |
| P3-6 | Admin internal navigation fully audited: `navigate("/admin")`, `navigate("/admin/login")`, sidebar array `path: "/admin/…"`, `to="/admin/overview"`, `<Navigate to="/admin/login">` in ProtectedRoute | Confirms pass-2 decision: **no `basename`**; the route table + every link work verbatim inside the island mount                                                                                   | §4.4 unchanged, now evidence-backed                                                                                                                                                                                                                                                                                            |

_(Pass-2 corrections preserved in context — hero badge island, Talent/Companies modals, marketing-script double-count trap, analytics referrer pinning, Prettier/Bun/env tooling, Toaster ownership, no-basename mount.)_

## Pass-4 review log — execution-mechanics validation (verified against source)

| #    | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Impact on plan                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-1 | **Page `<title>` is decided by a React effect cascade, not the `SEO` prop alone.** Every public page renders `<SEO title="X">` (child effect → `X \| RareRoles`), then its **own** `useEffect` overrides `document.title` (React child effects run before parent effects → the page-level override wins). Extracted effective titles: Home = `Rare Tech Talent, On Demand \| RareRoles` · About = `About — The talent partner for rare tech roles \| RareRoles` · Companies/Services = `Our Services — Specialized Talent Solutions \| RareRoles` · Contact = `Contact — Get in touch \| RareRoles` · Talent/Why-Choose-Us = `Why Choose Us — For Companies & Talent \| RareRoles` · 404 = `Page not found \| RareRoles` | §4.1 gains the exact title table — zero guessing at conversion time; P0 captures the live prerendered `<head>` per route as ground truth to diff against                      |
| P4-2 | **Admin pages never set `document.title`** (zero call sites verified) — every admin screen shows the static `index.html` title today                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | AdminLayout shells hardcode exactly that title → byte-parity without runtime effects                                                                                          |
| P4-3 | **JSON-LD injection is a single** `<script type="application/ld+json">` per page (create-if-absent, content swapped on route change); schema catalog = Organization(+ContactPoint), WebSite(+SearchAction), Service(+Organization/Country)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Each Astro page bakes exactly one `ld+json` script via `set:html`; schemas move to `lib/seo.ts` verbatim                                                                      |
| P4-4 | `start-dev-server.bat` hardcodes Vite + port 5173 + `npm run dev`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Added to P5 docs batch (point to `bun run dev` / Astro 4321)                                                                                                                  |
| P4-5 | Payload honesty: the layout-level GetStarted island (Radix + heroicons + upload/sync libs) loads on **every** public page on idle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | §6 budget restated as measurable: no page ships more JS than its P0 baseline; the only new JS on static-heavy pages is the shared layout island + marketing/analytics modules |

---

## 1. Current state (audit findings)

**Stack:** Vite 8 + React 19 + TS SPA · React Router 7 · Tailwind 4 (`@tailwindcss/vite`), tokens+keyframes in `src/styles.css` + `tw-animate-css` · Radix/shadcn + Heroicons + lucide · Supabase (auth, analytics, submissions) · Cloudinary unsigned preset (CV) · Google Apps Script (Sheets backup) · Netlify.

**Routes (`src/App.tsx`):**

| Type              | Routes                                                                                                                                                                                                                              | Destination               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Public / landing  | `/`, `/about`, `/talent` (+ `/why-choose-us`), `/companies` (+ `/services`), `/contact`, 404                                                                                                                                        | **→ Astro SSG**           |
| Admin / dashboard | `/admin`, `/admin/login`, `/admin/reset-password`, `/admin/overview`, `/admin/submissions`, `/admin/visitors`, `/admin/analytics`, `/admin/hiring`, `/admin/talent`, `/admin/contact`, `/admin/marketing`, `/admin/change-password` | **Stays React, verbatim** |

**SEO today (replaced):** Puppeteer postbuild prerender + `hydrateRoot` — deleted whole. **Being kept with zero edits:** `public/sitemap.xml`, `robots.txt` (incl. its AI-crawler sections + Sitemap directive), `humans.txt`, `ai.txt`.

## 2. Target architecture

One repo, one package, one `astro build`, static output:

```
┌─────────────────────── Astro SSG — public ───────────────────────┐
│ / /about /talent /why-choose-us /companies /services /contact    │
│ 404.html → static HTML + static per-page SEO head + JSON-LD      │
│ Islands: GetStarted modal · ContactForm · ServiceModal ·         │
│          ExclusiveBadge · AnimatedCounter                        │
│ Vanilla: marketing-loader · analytics · nav toggle · tabs        │
├──────────────────────────────────────────────────────────────────┤
│ /admin/<all 12> → admin/[...path].astro shells (noindex)         │
│   → <AdminApp client:only="react" /> = today's route table       │
│     verbatim (absolute paths, no basename) + own Toaster         │
└──────────────────────────────────────────────────────────────────┘
```

### 2.1 "Should this be a monorepo?" — the decision (owner question, pass 3)

**Option A (chosen): single package, monorepo-style internal boundaries.** Astro is the site; the React dashboard ships as one island. Folder layout enforces the split:

```
src/
  pages/                 # Astro routes ONLY (.astro) — nothing else lives here
    index/about/talent/why-choose-us/companies/services/contact/404 .astro
    admin/[...path].astro
  layouts/               # PublicLayout, AdminLayout, BaseHead
  components/            # shared chrome (.astro) + islands (.tsx) + icons/ + ui/ (shadcn)
  admin/                 # ← the React dashboard (relocated from src/pages/admin; P3-1)
    AdminApp.tsx         # router mount, routes copied verbatim
    pages/… (13 files)   # Overview, Submissions, Visitors, …
  components/admin/      # DashboardLayout & friends — stay put (components/ is not a routes dir)
  lib/ constants/ hooks/ types/ styles/ assets/   # shared, imported via @/ from both worlds
```

Admin imports become `@/admin/pages/…` — a mechanical patch, validated by the Vite build _before_ Astro touches anything.

**Option B (rejected for now): true workspaces** (`apps/web` Astro + `apps/admin` Vite-React + `packages/shared`). Costs at this scale (115 files, one deploy, one design system): two build pipelines to keep green; Netlify split — either a second site + `/admin/*` proxy rewrites (asset/base-path and cache-header gotchas) or an `admin.` subdomain (Supabase auth redirect + sitemap/robots changes); duplicated env config; Tailwind tokens compiled twice (drift risk); bigger diff now. Benefits (independent deploy cadence, hard isolation) become real only with a bigger team/app — **Option A's boundaries keep the door open**: a later promotion to workspaces is mechanical because routes, admin app, and shared code are already cleanly separated. Documented trigger: if admin ever needs its own release cadence or subdomain, do Option B then.

### 2.2 URL contract

Unchanged — 7 public URLs + 12 admin URLs, no redirects introduced, sitemap/robots/OG URLs stay valid. Admin deep-link refresh works via prerendered shells (`getStaticPaths`: `{ params: { path: undefined } }` for `/admin` + the 11 subroutes) — no catch-all rewrite anywhere.

## 3. Page-by-page conversion map

| Route                       | Astro page                                                                      | Static (Astro)                                               | Islands / scripts                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `/`                         | `index.astro`                                                                   | Hero shell + video bg, 5 sections, ScriptSlot divs           | **ExclusiveBadge** (`client:idle`), **AnimatedCounter** (`client:visible`), GetStarted (layout), marketing, analytics |
| `/about`                    | `about.astro`                                                                   | full body (602 ln), ResponsiveImage, icons                   | GetStarted, marketing, analytics                                                                                      |
| `/talent`, `/why-choose-us` | two pages → shared `TalentContent.astro`                                        | both tab panes in HTML (SEO ↑ vs today's conditional render) | tab-toggle script, **ServiceModal** island, GetStarted                                                                |
| `/companies`, `/services`   | two pages → shared content                                                      | full body                                                    | ServiceModal island (shared), GetStarted                                                                              |
| `/contact`                  | `contact.astro`                                                                 | info cards, slots                                            | **ContactForm** (`client:visible`), GetStarted                                                                        |
| 404                         | `404.astro` in PublicLayout (matches today: NotFound renders inside nav/footer) | real 404 status from Netlify (improvement over SPA 200)      | —                                                                                                                     |
| `/admin/*`                  | `[...path].astro` ×12 shells                                                    | —                                                            | **AdminApp** (`client:only="react"`)                                                                                  |

## 4. Key decisions & patterns

**4.1 SEO** — `BaseHead.astro` reproduces the entire `index.html` head + every runtime mutation `SEO.tsx` performs (per-page title/description/canonical/OG/Twitter/keywords/JSON-LD). **Baked-in titles use the extracted effective-title table (P4-1)** — the visible title today is the page's `useEffect` override, not the `SEO` prop; implementations copy the P4-1 strings verbatim. JSON-LD: exactly one `<script type="application/ld+json">` per page via `set:html` (P4-3), schemas → `src/lib/seo.ts` verbatim. Canonicals self-reference on alias pages exactly as today (pathname-derived). Puppeteer pipeline deleted. Validate via `curl` diff vs production + Rich Results.

**4.2 GetStarted modal** — 8 verified trigger call sites become `data-get-started` attrs; one ~20-line framework-free store + event delegation script in PublicLayout; modal JSX/logic verbatim as a single layout island (`client:idle`); only `useContext`→store and `navigate(choice.to)` (line 153) → `location.assign()` change. Cloudinary/Supabase/Sheets/conversion logic untouched.

**4.3 Marketing scripts** — vanilla `src/scripts/marketing-loader.ts` inside PublicLayout reusing `lib/marketing-scripts.ts`: same cache key/TTL, `isAdminPath` guard, `shouldInjectOnPath`, timing strategies, slot injection (slots exist in initial HTML — the SPA retry loop is unnecessary). **`notifyPageView`/`spa_pageview` deliberately not ported** — MPA page loads fire vendor pageviews natively; porting would double-count. Admin CRUD page untouched (same lib).

**4.4 Admin mount** — `AdminApp.tsx`: `<BrowserRouter>` + the 11-route table copied verbatim (absolute paths, **no basename** — P3-6 proved every internal link is absolute) + its own `<Toaster richColors position="top-right">` (only `MarketingScriptsPage` calls `toast()` — verified sole call site) + `ProtectedRoute` wrappers. Shell pages are `noindex` and import `admin.css` (verified: admin.css has no bare global element selectors; screenshot diff still gates). PublicLayout reproduces the exact wrapper markup (`flex min-h-screen flex-col bg-background` / `main.flex-1` / sticky header / WhatsApp) for byte-identical CSS context. AdminLayout shells hardcode today's static site title "RareRoles — Rare tech talent, on demand" (P4-2: admin pages never set titles). Supabase password-recovery links land on `/admin/reset-password#access_token=…` — the island reads the hash client-side exactly as today.

**4.5 Styling** — keep `@tailwindcss/vite` in Astro's vite.plugins; **`@source` must cover `.astro`** (`@source "../src/**/*.{astro,tsx,ts}"`) — the single biggest styling footgun. All keyframes/utilities/tokens carry over verbatim; `tw-animate-css` stays; fonts load exactly as today (Montserrat CSS import + Jakarta/Inter/JetBrains links).

**4.6 Tooling (all verified)** — Bun is authoritative (`bun.lock` + `bunfig.toml` with 24h `minimumReleaseAge`; Netlify auto-detects Bun) → `bun add`, pin versions >24h old, Phase 0 confirms Netlify's actual builder, Phase 5 deletes stale `package-lock.json`. Prettier needs `prettier-plugin-astro` or `prettier --write .` crashes on `.astro`. ESLint targets only `ts/tsx` — no breakage. tsconfig → `extends: "astro/tsconfigs/strict"`, keep `@/*` paths + `jsx: react-jsx`; keep `vite-tsconfig-paths`; add `@astrojs/check`. `.gitignore`: add `.astro/`, `dist-astro/`, un-ignore this doc. Env: `vite: { envPrefix: ["VITE_", "PUBLIC_"] }` keeps all 5 lib files' `import.meta.env.VITE_*` and Netlify settings untouched (Phase-1 probe in dev+build; fallback = rename to `PUBLIC_*`). Assets: `.jfif` imports work in frontmatter via `img.src` (Vite known asset type); always import-based URLs (filenames contain spaces).

**4.7 Cutover (both redirect layers — P3-2)** — `netlify.toml`: command `astro build`, publish `dist`, remove `[[redirects]]` catch-all + Puppeteer env; **and delete `public/_redirects`** (it carries the same catch-all and would be copied into `dist/`). Keep `netlify/functions/health.js`. No URL changes → no 301s. Branch-preview compare; Netlify instant rollback = previous deploy (old Vite app).

**4.8 404 semantics** — Astro `404.astro` → real 404 status (today: SPA 200). Unknown `/admin/*` also lands there (today: public NotFound via catch-all) — equivalent outcome, noted.

**4.9 Analytics decisions (owner sign-off, Phase 0)** — (a) page views: today `usePageView` fires **only on /contact** (sole call site); recommend tracking all public pages via the vanilla module (reversible flag; flagged as intentional change). (b) Referrer: pin first-hit `document.referrer` in sessionStorage so MPA navigations don't log internal referrers (SPA behavior preserved). (c) `useAnalyticsSession` is dead (`analytics_sessions` never written) → not ported.

## 5. Phases

**P0 — Baseline & decisions** (0.5d): install+build current main (record bundles, Lighthouse mobile `/` `/contact` `/about`, Playwright screenshots 7 public + 5 admin × 3 breakpoints → `scripts/`); **curl the live production site for each of the 7 public URLs and save the full prerendered `<head>` as ground truth** (the effective titles in P4-1 only exist post-hydration; production's prerendered HTML is the highest-fidelity reference); confirm Netlify builder (Bun vs npm) from build logs; sign off §2.1 (Option A) + §4.9 + env strategy.

**P1 — Structure first, then Astro** (1d): **(a) `git mv src/pages/admin → src/admin/pages` + patch the 13 files' imports; Vite build must stay green — this proves the relocation is behavior-neutral before Astro exists (P3-1).** (b) add Astro deps (`astro`, `@astrojs/react`, `prettier-plugin-astro`, `@astrojs/check`); `astro.config.mjs` (react, static, `prefetch: true`, `site`, tailwind+vite-tsconfig-paths plugins, `envPrefix`, **`outDir: "dist-astro"` during coexistence** (P3-4)); tsconfig swap; `.gitignore`/Prettier updates. (c) Layouts + BaseHead; **env-prefix probe island** verified in dev and `astro build`; both builds green side by side. Note: until public `.tsx` pages are deleted they'll also appear as Astro dev routes (/Home etc.) — harmless pre-cutover; deployment doesn't switch until P5.

**P2 — Shared chrome → Astro** (1.5d): extract ~20 icons to `components/icons/*.astro` (inline SVG from heroicons source; modal island keeps `@heroicons`); nav (active via `Astro.url.pathname`, mobile toggle script, `data-astro-prefetch`), footer, WhatsApp (pure-CSS `group-hover` tooltip + plain `<a>` — zero JS), ui-bits→`.astro`, ResponsiveImage→`.astro`; GetStarted store + delegation + modal island; marketing-loader + analytics vanilla modules (with referrer pinning).

**P3 — Public pages** (2–3d): Home (badge + counter islands) → Contact (form island; dual-write verbatim) → Talent (tab script + ServiceModal island + services data lifted to `constants/`) → Companies (reuse ServiceModal) → About → aliases → 404. **Gate per page:** screenshot diff ≤ noise at 390/768/1440 + `curl` head-tag diff identical.

**P4 — Admin mount** (0.5–1d): `AdminApp.tsx` (verbatim routes + Toaster), `[...path].astro` + `getStaticPaths` (12 shells). Regression: login → every page → refresh `/admin/submissions` → reset flow → logout; confirm Supabase redirect URL unchanged.

**P5 — Cutover & cleanup** (0.5d): Netlify settings (command/publish/env) + **both** redirect removals (P3-2); flip Astro to `dist/`; delete `prerender.mjs`, puppeteer deps, `vite.config.ts`, `index.html`, `main.tsx`, `App.tsx`, `SEO.tsx`, `route-transition-bar.tsx`, `scroll-to-top.tsx`, `route-prefetch.ts`. Dead-code commit (all verified zero-import): `Home-Old.tsx`, `AdminDashboard.tsx`, 4× `*PageNew.tsx`, `automation-art.tsx`, `get-started-modal.tsx.backup`, `useAnalyticsSession`, dep `@cloudinary/react` (P3-5), stale `package-lock.json`. Update scripts/README/`start-dev-server.bat` (P4-4) to the Astro commands/ports.

**P6 — Verify & launch** (0.5d): full §6 on preview → production cutover; Search Console resubmit; 48h watch on Supabase analytics/marketing tables; rollback tested once on preview.

**Total: ~5–7 working days;** P3 dominant. Vite deploy untouched until P5 — the site is fully releasable at every phase boundary.

## 6. Acceptance criterias

- **Pixel/UX parity:** Playwright diffs ≤ noise (7 public + 5 admin × 3 breakpoints); ALL animations behave identically — badge rotation + IO pause, spin/shimmer/pulse keyframes, counter-on-scroll, hero video (poster/opacity/`preload="none"`), tabs, service modal → GetStarted handoff with role prefill, mobile menu, WhatsApp tooltip, hover transitions.
- **Route hygiene (P3-1):** exactly the 7 public + 12 admin URLs exist; `/Home`, `/admin/OverviewPage`, `/admin/TalentPage` etc. **return 404**; no un-gated admin shell reachable.
- **SEO:** `curl` (no JS) returns full content + correct title/description/canonical/OG/Twitter/JSON-LD for all 7 URLs — diffed tag-for-tag against the P0 ground-truth heads; robots.txt byte-identical (incl. `Sitemap: …/sitemap.xml`); hand sitemap unchanged; Rich Results pass; LCP < 2.5s mobile on `/`, improved vs P0 baseline.
- **JS payload (P4-5, measurable):** no page ships more parsed JS than its P0 baseline; static-heavy pages (`/about`, `/talent`, `/companies`) ship only the shared layout island + marketing/analytics modules on top of framework runtime.
- **Functional:** Contact dual-write (Supabase + Sheet), error path, conversion-on-success-only; GetStarted both flows + Cloudinary CV upload + dual-write + scroll-lock; marketing: enabled/path/slot/timing matrix, **no double pageviews**, owner admin workflow unchanged; admin: all 12 routes incl. direct refresh, auth bounce, recharts, CRUD.
- **Infra:** health function OK; no SPA redirect from **either** layer; `/nope` → styled 404 with real 404 status.

## 7. Risk register (hardened ×3 passes)

1. `.tsx`-in-`src/pages` becoming routes + un-gated admin shells (P3-1) → **Phase-1 relocation + route-hygiene tests**.
2. Dual SPA redirect layers (P3-2) → both edited; curl status checks in P6.
3. Tailwind `@source` missing `.astro` → per-page screenshot gates.
4. Marketing double-pageview (do-not-port list, §4.3).
5. Analytics semantics (§4.9 decisions + referrer pinning).
6. `envPrefix` assumption → P1 probe, rename fallback.
7. Prettier `.astro` crash → plugin in P1. 8. `dist/` collision → `dist-astro` until P5 (P3-4).
8. Basename double-prefix → verbatim absolute routes (P3-6). 10. GetStarted fan-out → store in P2 before pages.
9. ServiceModal content drift → verbatim JSX + shared `constants/services.ts`. 12. `.jfif`/spaced filenames → import-based URLs only.
10. Bun `minimumReleaseAge` / stale `package-lock.json` → P0 builder check. 14. Rollback = one-click previous Netlify deploy.

## 8. Out of scope (on purpose)

Admin UI/behavior conversion, Supabase schema/RLS, Apps Script, Cloudinary preset, Netlify function, copy/brand/animation timings, workspaces tooling (documented upgrade path in §2.1). Optional later: `astro:assets` images, `<ClientRouter>` view transitions (needs script-injection redesign), vanilla counter rewrite, content collections.
