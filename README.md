# Penguin Computing · The GPU Savings Challenge

Game-show style booth app for the **Penguin Computing Sales Kickoff 2026**. Players size a GPU
cluster, then guess how many extra GPUs the storage savings of a Penguin + VDURA **mixed-fleet**
system (SSD + HDD) buy versus an **all-flash competitor**. Big reveal, scoring, confetti, and a
leaderboard that survives the whole event.

Modeled on the GTC 2026 [GPU Savings Challenge](https://github.com/eriksalo/GtcContest) with pricing
updated to **Q3 2026** from the [VDURA SSD/GPU cost calculator](https://github.com/eriksalo/ssdgpu_costcalculator).

## Game flow

1. **Welcome / attract** — Penguin mascot, rotating taunts, "score to beat", LET'S PLAY.
2. **Build your cluster** — player name, GPU slider (256–10,240 in 256-GPU scalable units), which GPU
   to "buy more of" (B200 default), auto-sized storage with override, required read/write throughput.
3. **Make your guess** — big number input, ±10 buttons, slider, and quick picks as a percentage of
   the cluster. LOCK IT IN.
4. **The reveal** — 3-2-1 drumroll, animated savings and extra-GPU count, penguin-tiered verdict
   (Emperor → Ice Cold), score, leaderboard rank, confetti, then the full cost comparison and BOM.
5. **Leaderboard** — podium + top 15, CSV export, guarded reset. Stored in the browser's
   `localStorage`, so one booth device keeps one board for the whole show.

Kiosk niceties: fullscreen toggle, sound toggle (WebAudio synth, no assets), and an automatic return
to the attract screen after 3 idle minutes.

## Scoring

`score = round(1000 × (1 − |guess − answer| / answer))`, floored at 0. An exact answer scores **1,250**.

| Accuracy | Verdict |
| --- | --- |
| exact | Perfect. Emperor Penguin. |
| ≥ 90% | Emperor-level guess |
| ≥ 75% | King Penguin |
| ≥ 50% | Rockhopper |
| ≥ 25% | A little chilly |
| < 25% | Ice cold |

## The math

`src/lib/calculations.ts` is a line-for-line port of `calculateVDURA` and `calculateCompetitorVCDBox`
from the cost calculator's `calculator.js`. `src/data/pricing.ts` holds the Q3 2026 numbers from its
`pricing-config.json`.

**Requirements** (Enhanced mode, per 1,024 GPUs): 500 GB/s read, 250 GB/s write, 15 PB usable
(rounded up to whole PB).

**VDURA mixed fleet**: VELO directors (3 + 1 per 10 VPODs) + VPODs (12 × 8/15/30 TB TLC, sized by
throughput and 20% of capacity) + 4U108 JBODs (3,240 TB each, 80% of capacity, min 3).
Software + support = hardware (50/50). Total = (HW + SW) × 1.15 partner margin.

**All-flash competitor** (C Box + D Box): C Boxes by throughput (40/20 GB/s, min 4); D Boxes by
capacity with 8 × 800 GB SCM + 22 × QLC (15/30 TB), never fewer than C Boxes. Software + support =
1.5 × hardware (60/40). Total = (HW + SW) × 1.15.

**Savings** = all-flash total − VDURA total. **Extra GPUs** = ⌊savings ÷ GPU price⌋.

Representative results at Q3 2026 pricing (B200 @ $45K):

| GPUs | VDURA | All-flash | Savings | Extra B200s |
| --- | --- | --- | --- | --- |
| 256 | $3.1M | $7.7M | $4.7M | 104 |
| 1,024 | $7.3M | $28.9M | $21.6M | 480 |
| 4,096 | $27.2M | $114.8M | $87.6M | 1,946 |
| 10,240 | $67.4M | $286.1M | $218.7M | 4,860 |

### Updating pricing for a new quarter

1. Pull the new `quarters.<Q>` block from the calculator's `pricing-config.json`.
2. Update the constants in `src/data/pricing.ts` and bump `PRICING_QUARTER`.
3. Run `npm test`. The hand-traced expectations in `src/lib/calculations.test.ts` will need the new
   numbers; the invariants (savings positive, monotonic, requirements met) should keep passing.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # vitest: engine, scoring, leaderboard
npm run build      # tsc -b && vite build → dist/
```

Stack: React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS v4 · Framer Motion · canvas-confetti · lucide-react.

## Deployment (AWS Amplify Hosting)

`amplify.yml` at the repo root runs tests and builds `dist/`. Connect this repo in Amplify Hosting,
pick the `main` branch, and Amplify picks up the build spec automatically. `public/_redirects` sends
every path to `index.html`.

Recommended Amplify settings: Node 22 (set by the build spec), no environment variables required.

## Branding

Penguin Yellow `#ffcd30` and Penguin Black `#242b2e`, DM Sans. The mascot in
`src/components/ui/Penguin.tsx` is an original illustration. To use the official Penguin Computing
logo, drop it in `public/` and swap the text wordmark in `src/components/ui/Brand.tsx` for an `<img>`.

Pricing shown in the app is illustrative list pricing from the VDURA cost calculator and is labeled
"not a quote".
