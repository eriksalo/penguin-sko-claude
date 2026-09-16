# CLAUDE.md — Penguin SKO GPU Savings Challenge

## What this is
Booth game for the Penguin Computing Sales Kickoff 2026. Players size a GPU cluster and guess how
many extra GPUs the Penguin + VDURA mixed-fleet storage savings buy vs. an all-flash competitor.
Single-page React wizard, no backend, deployed on AWS Amplify Hosting from `eriksalo/penguin-sko-claude`.

## Stack
React 19 · Vite 7 · TypeScript 5.9 (strict, `erasableSyntaxOnly`) · Tailwind CSS v4 (`@theme` tokens in
`src/index.css`) · Framer Motion · canvas-confetti · lucide-react · vitest.

## Commands
- `npm run dev` — dev server
- `npm test` — vitest (`src/lib/*.test.ts`); Amplify runs this before every build
- `npm run build` — `tsc -b && vite build`
- `npm run typecheck` — type-check only

## Layout
```
amplify.yml                      Amplify build spec (Node 22, npm ci, test, build → dist/)
public/_redirects                SPA fallback
src/data/pricing.ts              Q3 2026 pricing + sizing constants (single source of truth)
src/lib/calculations.ts          Cost engine: port of calculator.js (VDURA + C/D Box)
src/lib/scoring.ts               Accuracy score + penguin verdict tiers
src/lib/leaderboard.ts           localStorage leaderboard, CSV export
src/lib/sound.ts                 WebAudio cues (no assets)
src/context/GameContext.tsx      useReducer state machine: welcome → configure → guess → reveal (+ leaderboard overlay)
src/components/steps/            One component per screen
src/components/ui/               Penguin mascot, Button, Slider, AnimatedNumber, BomTable, Snow, Chrome, Brand
```

## Rules of the road
- **Pricing changes go in `src/data/pricing.ts` only.** The engine in `calculations.ts` mirrors
  `calculator.js` in eriksalo/ssdgpu_costcalculator; keep it a faithful port (including its quirk of
  picking the smallest QLC drive and scaling D Boxes). Update `PRICING_QUARTER` when numbers change.
- Hand-traced numbers in `calculations.test.ts` must be re-derived when pricing changes; the
  invariant tests (savings > 0 across the slider, monotonic extra GPUs) should always hold.
- The score is saved to the leaderboard in `lockIn()` (GameContext), not in an effect, so StrictMode
  and re-renders cannot double-save.
- Brand: Penguin Yellow `#ffcd30`, Penguin Black `#242b2e`, DM Sans. Yellow = Penguin/VDURA, ice blue =
  competitor. The competitor is never named in the UI ("All-Flash Competitor").
- Keep it kiosk-friendly: big touch targets, no hover-only affordances, idle reset (3 min) in `App.tsx`.
- Sound must never autoplay; the AudioContext is created lazily on a user gesture.

## Source repos (private, need the `eriksalo` GitHub account)
- Game design: https://github.com/eriksalo/GtcContest
- Pricing: https://github.com/eriksalo/ssdgpu_costcalculator (`pricing-config.json`, `calculator.js`)
