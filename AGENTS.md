<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Single Next.js app (not a monorepo). Package manager is **npm** (`package-lock.json`; do not introduce pnpm or yarn).

---

## 1. Commands & Verification

- `npm run dev` — start local development server (Turbopack only).
- `npm run build` — production build (Turbopack; does not run lint).
- `npm run lint` — `biome check` (checks lint **and** formatting; fails on format or import order issues).
- `npm run format` — `biome format --write`.
- `npx @biomejs/biome check --write` — broader automated fix (formats code and auto-organizes imports).
- `npx tsc --noEmit` — TypeScript type checking (run `npm run dev` or `npm run build` first if Next route types are missing).
- **Mandatory Quality Gate**: `npm run lint` + `npx tsc --noEmit` is the full verification loop before finishing any task.

---

## 2. Runtime Dependencies & Environment

- **Required `.env` variables**:
  - `MONGO_DB_URL`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- **External Backend API**:
  - Runs at `http://localhost:5000` (defined as `API_BASE_URL` in `src/lib/api.ts`).
  - `GET /banner-images` — returns array of 3 production banner images, descriptions, and Unsplash URLs.
  - `GET /studios?limit=6` — returns dynamic studio listings (top 6 displayed on homepage).
  - `GET /studios` — returns full studio catalog; used by `BrowseCategories` to calculate live space counts and starting rates.
  - `GET /auth-reviews` — returns creator testimonials displayed on auth sidebars.
- **Authentication**:
  - Powered by **better-auth** with MongoDB adapter (`studioSpaceDB`).
  - Server config: `src/lib/auth.ts`
  - Client config: `src/lib/auth-client.ts`
  - Catch-all route: `src/app/api/auth/[...all]/route.ts`
  - Route guard: `src/proxy.ts` (redirects logged-in users away from `/login` and `/signup`).

---

## 3. Next.js 16 Architectural Rules

- **`proxy.ts` replaces `middleware.ts`**: The old Edge middleware convention is deprecated. Request interception lives in `src/proxy.ts` running in Node.js runtime.
- **Component Caching (`cacheComponents: true`)**: Pages using dynamic APIs (`cookies`, `headers`, uncached fetch/DB) must be wrapped in `<Suspense>` or cached via `use cache`, or production builds will fail. Do not remove this flag.
- **Client Prerender Stability**: Do not evaluate non-deterministic client-side values (such as bare `new Date()` or timestamps) in client components during prerendering. Read dynamic time values inside `useEffect` or state initialized to stable defaults.
- **React Compiler (`reactCompiler: true`)**: `babel-plugin-react-compiler` automatically optimizes memoization. Do not manually introduce `useMemo`, `useCallback`, or `React.memo` unless required by third-party libraries.
- **Remote Images**: `next.config.ts` includes `images.unsplash.com` in `remotePatterns`. When rendering external images, ensure `unoptimized` is specified on `<Image />` where appropriate.

---

## 4. UI, Styling & Component Architecture

### Theme & Styling
- **Tailwind CSS v4 (CSS-first)**: No `tailwind.config` file. Theme tokens and dark mode variant (`@custom-variant dark`) reside in `src/app/globals.css`.
- **Brand Colors**:
  - `--color-brand: #ff5c1a` (vibrant studio orange)
  - `--color-brand-strong: #ec4c0c`
- **Typography**:
  - Sans: Geist Sans (`--font-geist-sans`)
  - Mono: Geist Mono (`--font-geist-mono`)
  - Display / Serif: Instrument Serif (`--font-instrument-serif`)
- **shadcn / Base UI**:
  - Uses shadcn's `base-nova` style built on `@base-ui/react` (Base UI), **NOT** Radix UI (`@radix-ui/react-*`).
  - Generate new components via `npx shadcn@latest add <name>`.
  - Import `cn` from `@/lib/utils` (`import { cn } from "@/lib/utils"`).

### Shared & Global Layout Components
- **`Navbar` (`src/components/shared/Navbar.tsx`)**:
  - Brand lockup with Aperture icon and tagline *"CONVERTING SPACES INTO STAGES"*.
  - Navigation links: Home (`/`), Explore Studios (`/studios`), How It Works (`/#howitworks`), About Us (`/about`).
  - Account menu: better-auth user session state, avatar with initials fallback, user dropdown, and logout.
  - Mobile slide-down drawer with menu toggle button.
- **`Footer` (`src/components/shared/Footer.tsx`)**:
  - StudioSpace branding, mission statement, and trust badges (*Verified Space Host*, *Instant Check-in Ready*).
  - Newsletter Dispatch ("The Call Sheet Dispatch") with email input, loading/success states, and toast feedback.
  - Quick Links, Studio Categories, Support & Host Trust links.
  - **Social Links**: Uses the **official new X logo** (strict rule: **do NOT use the old Twitter bird**), Instagram, YouTube, and LinkedIn.
  - Pinned bottom bar with copyright and legal links (`/privacy`, `/terms`, `/cookies`, `/security`).
- **Global Layout (`src/app/layout.tsx`)**:
  - Enforces `scrollBehavior: 'smooth'` for smooth anchor navigation (`/#howitworks`).
  - Wraps `{children}` in a `flex-1 flex flex-col` container so the Footer is always pinned to the bottom.

---

## 5. Homepage Sections (`src/app/page.tsx`)

The homepage coordinates four modular, responsive components:

1. **`Banner` (`src/components/homepage/banner.tsx`)**:
   - Hero banner with *"Curated Production Spaces"* pill badge.
   - Primary heading: *"Your Creative Vision Deserves the Perfect Space."*
   - Subtext and primary CTAs linking to `/studios` ("Explore Studios" & "Host Your Space").
   - Live platform stats: `320+ Vetted Studios`, `4.96 Average Rating`, `100% Verified Hosts`.
   - Interactive Swiper.js slider fetching high-res studio assets from `http://localhost:5000/banner-images`. Features frosted glass overlay controls, active orange pill dot indicators, live availability badges, and hourly rates.
2. **`BrowseCategories` (`src/components/homepage/BrowseCategories.tsx`)**:
   - 5 core studio disciplines: **Photo Studios**, **Sound Stages**, **Podcast Rooms**, **Music Suites**, **Art Workshops**.
   - Dynamically queries `http://localhost:5000/studios` to calculate available studio counts and starting hourly rates per discipline.
   - Each card links to `/studios?category=${encodeURIComponent(name)}` to pre-filter catalog results.
   - Image zoom transitions, category icon badges (`Camera`, `Film`, `Mic`, `Music2`, `Palette`), and space counters.
3. **`FeaturedStudios` (`src/components/homepage/FeaturedStudios.tsx`)**:
   - Dynamically queries `http://localhost:5000/studios?limit=6`.
   - Sorts top 6 rated studios (`b.rating - a.rating`).
   - Cards display image, category badge, optional `Featured` tag, title, description, location, rating (`★ 4.97 (73)`), hourly rate (`$XX / hour`), favorite toggle, and a `"View Details"` button linking to `/studios/${studio._id}`.
   - Includes 6 pulse skeleton cards during loading and an interactive retry state.
4. **`HowItWorks` (`src/components/homepage/HowItWorks.tsx`)**:
   - Anchor target: `id="howitworks"` with `scroll-mt-20` offset for navbar clearance.
   - 4-step workflow:
     1. **`01. Discover Spaces`**
     2. **`02. Select Shoot Hours`**
     3. **`03. Book Instantly`**
     4. **`04. Create & Produce`**
   - Features step counters, icon badges, a desktop flow connector, and a bottom call-to-action banner linking to `/studios` and `/studios/new`.

---

## 6. Biome Linter & Formatter Rules

- **Indentation**: 2 spaces.
- **Import Organization**: Automatically checked and ordered by Biome. Stale import order will fail `npm run lint`.
- **Unique Keys**: Never use array index (`idx`) as keys in mapped JSX lists (e.g. `key={idx}`); use static string arrays for skeletons or entity `_id` values.
- **Hook Dependencies**: Ensure all variables referenced inside `useEffect` are either declared inside the effect, included in the dependency array, or intentionally used to prevent stale closures.
- Always run `npx @biomejs/biome check --write` followed by `npm run lint` before committing changes.
