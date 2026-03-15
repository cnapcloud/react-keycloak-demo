# CLAUDE.md

## General Rules

- No emojis anywhere — not in code, comments, commit messages, or responses.
- Use Korean for comments and user-facing strings; English for all code identifiers.
- Keep responses concise and direct. No trailing summaries.

## Project

React + Vite + TypeScript app with Keycloak authentication.

Active refactoring plan: `.claude/plan/refectoring-plan.md`
- Target structure is feature-based (`src/features/`, `src/components/`, `src/lib/`, etc.)
- All new files should follow the plan's folder structure
- Replacing `.jsx` files with `.tsx` as part of the migration

## Code Style

- TypeScript strict mode — no `any` unless unavoidable
- Functional components only, no class components
- Tailwind for styling — no inline styles, no CSS modules
- Path alias `@/` maps to `src/`

## API & Networking

- All HTTP calls go through `src/lib/axios.ts` (3-second timeout enforced)
- API base URL comes from `window.__ENV__.API_BASE_URL` via `src/config/env.ts`
- Never hardcode URLs or credentials

## Auth

- Keycloak instance lives in `src/lib/keycloak.ts`
- Auth state exposed via `src/features/auth/hooks/useAuth.ts`
- Bearer token injected automatically by the axios request interceptor

## UI Conventions

- Toast notifications for feedback — no modal dialogs
- Loading state: spinner inside button, not full-screen overlay
- Error states must show a clear human-readable message
- Color palette: `slate-50` bg, `slate-900` header, `blue-600` primary, `emerald-500` success, `red-500` error
