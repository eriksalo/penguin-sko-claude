// ─── Q3 2026 Pricing ────────────────────────────────────────────────────────
// Ported from eriksalo/ssdgpu_costcalculator `pricing-config.json` → quarters.Q3_2026
// and the sizing constants in `calculator.js`. Prices are USD, integers.
//
// When the calculator is updated for a new quarter, copy the numbers here and
// bump PRICING_QUARTER. Everything else (sizing rules, margins) lives in
// src/lib/calculations.ts and should not need to change.

export const PRICING_QUARTER = 'Q3 2026'

/** Partner margin applied on top of hardware + software for every vendor. */
export const PARTNER_MARGIN = 1.15

// ─── Storage requirements per GPU (Enhanced mode) ───────────────────────────

export const GPU_SPEC_UNIT = 1024 // specs below are per this many GPUs

export const ENHANCED_MODE = {
  readGBsPerUnit: 500, // GB/s read per 1024 GPUs
  writeGBsPerUnit: 250, // GB/s write per 1024 GPUs
  storagePBPerUnit: 15, // PB usable per 1024 GPUs
} as const

export const GPU_RANGE = { min: 256, max: 10_240, step: 256, default: 1024 } as const

// ─── GPUs you can buy with the savings ──────────────────────────────────────
// Street prices from the calculator's GPU selector.

export interface GpuOption {
  id: string
  name: string
  vendor: 'NVIDIA' | 'AMD'
  price: number
}

export const GPU_OPTIONS: readonly GpuOption[] = [
  { id: 'b200', name: 'B200', vendor: 'NVIDIA', price: 45_000 },
  { id: 'h200', name: 'H200', vendor: 'NVIDIA', price: 45_000 },
  { id: 'b100', name: 'B100', vendor: 'NVIDIA', price: 35_000 },
  { id: 'h100', name: 'H100', vendor: 'NVIDIA', price: 30_000 },
  { id: 'mi355x', name: 'MI355X', vendor: 'AMD', price: 25_000 },
  { id: 'mi325x', name: 'MI325X', vendor: 'AMD', price: 18_000 },
] as const

export const DEFAULT_GPU_ID = 'b200'

// ─── VDURA Mixed Fleet (SSD + HDD) ──────────────────────────────────────────

export const VDURA = {
  velo: {
    baseCost: 6_475, // VELO Director server + CPU, no SSDs or DRAM
    dramGB: 750,
    ssdCount: 2,
    ssdSizeTB: 2,
    minCount: 3,
    perVpods: 10, // +1 VELO for every 10 VPODs beyond the first
  },
  vpod: {
    baseCost: 6_475, // VPOD server + CPU, no SSDs, JBODs or DRAM
    dramGB: 384,
    ssdCount: 12,
    minCount: 3,
    minCountWithJbods: 6, // 3 with JBODs attached + 3 without
    readGBs: 65,
    writeGBs: 32,
  },
  dramPricePerGB: 15.75,
  /** TLC SSD price by capacity (TB). 2TB is VELO-only. */
  ssdPrices: { 2: 1_506, 8: 6_026, 15: 11_299, 30: 22_600 } as Record<number, number>,
  vpodSsdSizesTB: [8, 15, 30] as const,
  jbod: {
    cost: 137_767, // 4U108 JBOD with 108× 30TB HDDs
    capacityTB: 3_240,
    minCount: 3,
    description: '4U108 JBOD, 108× 30TB HDD',
  },
  ssdCapacityPercent: 20, // 20% of usable capacity on SSD, 80% on HDD
  softwareMultiplier: 1.0, // software + support = 50% of total (hardware 50%)
} as const

// ─── All-Flash Competitor: C Box + D Box architecture ───────────────────────

export const ALL_FLASH = {
  cBox: {
    baseCost: 5_544, // performance node, no SSDs
    dramGB: 1_000,
    readGBs: 40,
    writeGBs: 20,
    minCount: 4,
  },
  dBox: {
    baseCost: 7_000,
    scm: { sizeGB: 800, count: 8, costPerDrive: 1_413 },
    qlc: { count: 22, prices: { 15: 9_040, 30: 18_080 } as Record<number, number>, sizesTB: [15, 30] as const },
    minCount: 4,
  },
  dramPricePerGB: 15.75,
  softwareMultiplier: 1.5, // software + support = 60% of total (hardware 40%)
} as const
