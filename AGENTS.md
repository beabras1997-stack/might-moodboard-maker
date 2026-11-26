# AGENTS.md
- MighT is a browser-only demo: all state lives in localStorage via `src/lib/might/store.ts` (no auth, no backend) — the brief forbids login and complex backends.
- Each of the six sections is its own route sharing the `Shell` bottom-nav from `src/components/might/ui.tsx` — keeps sections linkable and consistent.
- Avatars are CDN asset pointers in `src/assets/avatars`; they don't load on sandbox localhost, only in the preview.
- The MighT figure is a parametric SVG (`MightFigure.tsx`) driven by per-tag recipes in `src/lib/might/figure.ts`: head = Personalidade, arms = Poder, hands = Carácter — add new tags there, never as static images.
