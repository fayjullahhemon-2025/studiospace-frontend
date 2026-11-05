<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Single Next.js app (not a monorepo). Package manager is **npm** (`package-lock.json`; don't introduce pnpm/yarn).

## Commands

- `npm run dev` — dev server (Turbopack only)
- `npm run build` — production build (Turbopack; does NOT lint)
- `npm run lint` — `biome check` (checks lint **and** formatting; will fail on format-only issues)
- `npm run format` — `biome format --write`; for broader autofix use `npx @biomejs/biome check --write`
- Typecheck: no script exists — run `npx tsc --noEmit`. Run `npm run dev` or `npm run build` first if route-type errors reference missing `.next/dev/types` files.
- No test framework is installed.
- No CI or pre-commit hooks — `npm run lint` + `npx tsc --noEmit` is the full verification loop.

## Runtime dependencies (not obvious from code)

- `.env` (git-ignored, not committed) must define: `MONGO_DB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- A separate backend API runs at `http://localhost:5000`, hardcoded as `API_BASE_URL` in `src/lib/api.ts` (used by auth sidebar components). Frontend features calling it fail unless that service is running.
- Auth is **better-auth** + MongoDB: server config `src/lib/auth.ts` (db `studioSpaceDB`), client `src/lib/auth-client.ts`, catch-all handler `src/app/api/auth/[...all]/route.ts`. Next.js request interception uses `src/proxy.ts` (redirects logged-in users off `/login`, `/signup`).

## Next.js 16 gotchas (verified against node_modules/next/dist/docs)

- App Router lives in `src/` (`src/app/`). Path alias `@/*` → `src/*` (tsconfig.json).
- `middleware` file convention is deprecated — create `proxy.ts` with `export function proxy` instead (runtime is nodejs, not edge).
- `cacheComponents: true` is enabled: pages using dynamic APIs (`cookies`, `headers`, uncached fetch/DB) must be wrapped in `<Suspense>` or cached via `use cache`, or the build fails. Don't remove this flag to "fix" build errors.
- `reactCompiler: true` is enabled (`babel-plugin-react-compiler`): do not manually add `useMemo`/`useCallback`/`memo` unless a dependency explicitly requires it.
- AMP and `next lint` were removed in this version.

## Styling / shadcn

- Tailwind v4 (CSS-first): no `tailwind.config`; theme tokens and dark-mode variant (`@custom-variant dark`) live in `src/app/globals.css`.
- shadcn uses the `base-nova` style built on `@base-ui/react` (Base UI), NOT Radix — primitives import from `@base-ui/react`, not `@radix-ui/react-*`.
- Add components via `npx shadcn@latest add <name>` (config in `components.json`); generated files go to `src/components/ui`.
- `cn` is re-exported from the `cn` package by `src/lib/utils.ts`, import it as `import { cn } from "@/lib/utils"`.

## Biome

- Formatter: 2-space indent; imports are auto-organized via `assist.actions.source.organizeImports` — `npm run lint` fails if import order is stale.
- Biome is the only lint/format tool; there is no ESLint or Prettier.
