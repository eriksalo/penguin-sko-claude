import { describe, expect, it } from 'vitest'
import { calculateAllFlash, calculateVdura, computeComparison, computeRequirements, defaultStorageTB } from './calculations'
import { GPU_RANGE } from '../data/pricing'

describe('requirements', () => {
  it('scales enhanced-mode specs per 1024 GPUs', () => {
    const r = computeRequirements(1024)
    expect(r).toEqual({ gpuCount: 1024, readGBs: 500, writeGBs: 250, storageTB: 15_000 })
  })
  it('rounds storage up to whole PB like the calculator', () => {
    expect(defaultStorageTB(256)).toBe(4_000) // 3.75 PB → 4 PB
    expect(defaultStorageTB(10_240)).toBe(150_000)
  })
})

describe('VDURA mixed fleet @ 1024 GPUs (matches calculator.js hand trace)', () => {
  const bom = calculateVdura(computeRequirements(1024))
  it('sizes the fleet', () => {
    expect(bom.vpods).toBe(9) // ceil(3000 TB / (12 × 30 TB))
    expect(bom.velos).toBe(3)
    expect(bom.jbods).toBe(4) // ceil(12000 / 3240)
    expect(bom.ssdSizeTB).toBe(30)
  })
  it('prices the fleet', () => {
    const velo = 3 * (6_475 + 2 * 1_506 + 750 * 15.75)
    const vpod = 9 * (6_475 + 12 * 22_600 + 384 * 15.75)
    const jbod = 4 * 137_767
    expect(bom.hardwareCost).toBeCloseTo(velo + vpod + jbod, 2)
    expect(bom.softwareCost).toBeCloseTo(bom.hardwareCost, 2)
    expect(bom.totalCost).toBeCloseTo(bom.hardwareCost * 2 * 1.15, 2)
  })
  it('meets or exceeds requirements', () => {
    expect(bom.capacityTB).toBeGreaterThanOrEqual(15_000)
    expect(bom.readGBs).toBeGreaterThanOrEqual(500)
    expect(bom.writeGBs).toBeGreaterThanOrEqual(250)
  })
})

describe('All-flash C+D Box @ 1024 GPUs', () => {
  const bom = calculateAllFlash(computeRequirements(1024))
  it('sizes the cluster', () => {
    expect(bom.cBoxes).toBe(13) // ceil(500/40) = ceil(250/20) = 13
    // calculator.js: no QLC size fits in the 4-box minimum, so it takes the
    // smallest QLC and scales D Boxes: ceil(15000 / (6.4 + 22×15)) = 45
    expect(bom.dBoxes).toBe(45)
    expect(bom.qlcSizeTB).toBe(15)
  })
  it('prices the cluster', () => {
    const c = 13 * (5_544 + 1_000 * 15.75)
    const d = 45 * (7_000 + 8 * 1_413 + 22 * 9_040)
    expect(bom.hardwareCost).toBeCloseTo(c + d, 2)
    expect(bom.softwareCost).toBeCloseTo(bom.hardwareCost * 1.5, 2)
    expect(bom.totalCost).toBeCloseTo(bom.hardwareCost * 2.5 * 1.15, 2)
  })
})

describe('small clusters hit minimums', () => {
  const v = calculateVdura(computeRequirements(256))
  const a = calculateAllFlash(computeRequirements(256))
  it('VDURA: 3 JBODs (min), 3 VPODs (JBODs not < VPODs so min stays 3), 3 VELOs', () => {
    expect(v.jbods).toBe(3) // ceil(3200/3240)=1 → raised to minimum 3
    expect(v.vpods).toBe(3) // max(perf 2, capacity ceil(800/360)=3, min 3)
    expect(v.velos).toBe(3)
    expect(v.ssdSizeTB).toBe(30) // 3×12×15=540 < 800, 3×12×30=1080 ok
  })
  it('All-flash: C Boxes from throughput, D Boxes ≥ C Boxes', () => {
    expect(a.cBoxes).toBe(4) // ceil(125/40)=4, ceil(63/20)=4
    expect(a.dBoxes).toBeGreaterThanOrEqual(a.cBoxes)
    expect(a.capacityTB).toBeGreaterThanOrEqual(4_000)
  })
})

describe('comparison', () => {
  it('VDURA saves money across the whole slider range', () => {
    for (let g = GPU_RANGE.min; g <= GPU_RANGE.max; g += GPU_RANGE.step) {
      const c = computeComparison(g, undefined, 'b200')
      expect(c.savings, `gpus=${g}`).toBeGreaterThan(0)
      expect(c.extraGpus).toBe(Math.floor(c.savings / 45_000))
    }
  })
  it('extra GPUs grow monotonically with cluster size', () => {
    let last = 0
    for (let g = GPU_RANGE.min; g <= GPU_RANGE.max; g += GPU_RANGE.step) {
      const c = computeComparison(g, undefined, 'b200')
      expect(c.extraGpus).toBeGreaterThanOrEqual(last)
      last = c.extraGpus
    }
  })
  it('cheaper GPUs mean more extra GPUs', () => {
    const b200 = computeComparison(1024, undefined, 'b200').extraGpus
    const mi325x = computeComparison(1024, undefined, 'mi325x').extraGpus
    expect(mi325x).toBeGreaterThan(b200)
  })
  it('falls back to B200 for unknown GPU ids', () => {
    expect(computeComparison(1024, undefined, 'nope').gpu.id).toBe('b200')
  })
})
