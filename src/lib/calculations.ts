// Cost engine — faithful port of `calculateVDURA` and `calculateCompetitorVCDBox`
// from eriksalo/ssdgpu_costcalculator/calculator.js, using Q3 2026 pricing.

import {
  ALL_FLASH,
  ENHANCED_MODE,
  GPU_OPTIONS,
  GPU_SPEC_UNIT,
  PARTNER_MARGIN,
  VDURA,
  type GpuOption,
} from '../data/pricing'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Requirements {
  gpuCount: number
  readGBs: number
  writeGBs: number
  storageTB: number
}

export interface BomLine {
  name: string
  quantity: number
  unitPrice: number
  unit?: string
}

export interface VendorBom {
  hardwareCost: number
  softwareCost: number
  totalCost: number
  capacityTB: number
  readGBs: number
  writeGBs: number
  lines: BomLine[]
}

export interface VduraBom extends VendorBom {
  velos: number
  vpods: number
  jbods: number
  ssdSizeTB: number
  ssdCapacityTB: number
  hddCapacityTB: number
}

export interface AllFlashBom extends VendorBom {
  cBoxes: number
  dBoxes: number
  qlcSizeTB: number
}

export interface Comparison {
  requirements: Requirements
  vdura: VduraBom
  allFlash: AllFlashBom
  gpu: GpuOption
  savings: number
  extraGpus: number
  savingsPercent: number
}

// ─── Requirements ───────────────────────────────────────────────────────────

export function defaultStorageTB(gpuCount: number): number {
  // Calculator rounds capacity up to whole PB.
  return Math.ceil((gpuCount / GPU_SPEC_UNIT) * ENHANCED_MODE.storagePBPerUnit) * 1000
}

export function computeRequirements(gpuCount: number, storageTB?: number): Requirements {
  const units = gpuCount / GPU_SPEC_UNIT
  return {
    gpuCount,
    readGBs: Math.ceil(units * ENHANCED_MODE.readGBsPerUnit),
    writeGBs: Math.ceil(units * ENHANCED_MODE.writeGBsPerUnit),
    storageTB: storageTB ?? defaultStorageTB(gpuCount),
  }
}

function finish(hardwareCost: number, softwareMultiplier: number) {
  const softwareCost = hardwareCost * softwareMultiplier
  const totalCost = (hardwareCost + softwareCost) * PARTNER_MARGIN
  return { softwareCost, totalCost }
}

// ─── VDURA Mixed Fleet ──────────────────────────────────────────────────────

export function calculateVdura(req: Requirements): VduraBom {
  const { readGBs, writeGBs, storageTB } = req
  const { velo, vpod, jbod } = VDURA

  const vpodsForPerformance = Math.max(
    Math.ceil(readGBs / vpod.readGBs),
    Math.ceil(writeGBs / vpod.writeGBs),
  )

  const ssdTargetTB = (storageTB * VDURA.ssdCapacityPercent) / 100
  const hddTargetTB = storageTB - ssdTargetTB

  const largestSsd = Math.max(...VDURA.vpodSsdSizesTB)
  const vpodsForCapacity = Math.ceil(ssdTargetTB / (largestSsd * vpod.ssdCount))

  let jbods = Math.ceil(hddTargetTB / jbod.capacityTB)
  if (jbods > 0 && jbods < jbod.minCount) jbods = jbod.minCount

  let minVpods: number = vpod.minCount
  const initialVpods = Math.max(vpodsForPerformance, vpodsForCapacity, minVpods)
  if (jbods > 0 && jbods < initialVpods) minVpods = vpod.minCountWithJbods
  const vpods = Math.max(vpodsForPerformance, vpodsForCapacity, minVpods)

  const velos = velo.minCount + Math.floor((vpods - 1) / velo.perVpods)

  // Smallest SSD that meets the SSD capacity target across all VPODs.
  let ssdSizeTB: number = largestSsd
  for (const size of VDURA.vpodSsdSizesTB) {
    if (vpods * vpod.ssdCount * size >= ssdTargetTB) {
      ssdSizeTB = size
      break
    }
  }

  const veloSsdPrice = VDURA.ssdPrices[velo.ssdSizeTB]
  const vpodSsdPrice = VDURA.ssdPrices[ssdSizeTB]

  const lines: BomLine[] = [
    { name: 'VELO Director (server + CPU)', quantity: velos, unitPrice: velo.baseCost },
    { name: `VELO ${velo.ssdSizeTB}TB TLC SSD`, quantity: velos * velo.ssdCount, unitPrice: veloSsdPrice, unit: 'drives' },
    { name: `VELO DRAM (${velo.dramGB}GB each)`, quantity: velos * velo.dramGB, unitPrice: VDURA.dramPricePerGB, unit: 'GB' },
    { name: 'VPOD Storage Server (server + CPU)', quantity: vpods, unitPrice: vpod.baseCost },
    { name: `VPOD ${ssdSizeTB}TB TLC SSD`, quantity: vpods * vpod.ssdCount, unitPrice: vpodSsdPrice, unit: 'drives' },
    { name: `VPOD DRAM (${vpod.dramGB}GB each)`, quantity: vpods * vpod.dramGB, unitPrice: VDURA.dramPricePerGB, unit: 'GB' },
  ]
  if (jbods > 0) lines.push({ name: jbod.description, quantity: jbods, unitPrice: jbod.cost, unit: 'units' })

  const hardwareCost = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)
  const { softwareCost, totalCost } = finish(hardwareCost, VDURA.softwareMultiplier)

  const ssdCapacityTB = velos * velo.ssdCount * velo.ssdSizeTB + vpods * vpod.ssdCount * ssdSizeTB
  const hddCapacityTB = jbods * jbod.capacityTB

  return {
    velos,
    vpods,
    jbods,
    ssdSizeTB,
    ssdCapacityTB,
    hddCapacityTB,
    capacityTB: ssdCapacityTB + hddCapacityTB,
    readGBs: vpods * vpod.readGBs,
    writeGBs: vpods * vpod.writeGBs,
    hardwareCost,
    softwareCost,
    totalCost,
    lines,
  }
}

// ─── All-Flash Competitor (C Box + D Box) ───────────────────────────────────

export function calculateAllFlash(req: Requirements): AllFlashBom {
  const { readGBs, writeGBs, storageTB } = req
  const { cBox, dBox } = ALL_FLASH

  const cBoxesForPerformance = Math.max(
    Math.ceil(readGBs / cBox.readGBs),
    Math.ceil(writeGBs / cBox.writeGBs),
  )

  const scmPerDBoxTB = (dBox.scm.sizeGB * dBox.scm.count) / 1000
  const qlcSizes = [...dBox.qlc.sizesTB].sort((a, b) => a - b)
  const capacityPerDBox = (qlc: number) => scmPerDBoxTB + qlc * dBox.qlc.count

  // Smallest QLC that fits within the minimum D Box count; otherwise scale D Boxes.
  let dBoxesForCapacity: number = dBox.minCount
  let qlcSizeTB: number | null = null
  for (const qlc of qlcSizes) {
    if (Math.ceil(storageTB / capacityPerDBox(qlc)) <= dBox.minCount) {
      qlcSizeTB = qlc
      break
    }
  }
  if (qlcSizeTB === null) {
    qlcSizeTB = qlcSizes[0]
    dBoxesForCapacity = Math.ceil(storageTB / capacityPerDBox(qlcSizeTB))
    const largest = qlcSizes[qlcSizes.length - 1]
    const minWithLargest = Math.ceil(storageTB / capacityPerDBox(largest))
    if (dBoxesForCapacity < minWithLargest) {
      dBoxesForCapacity = minWithLargest
      qlcSizeTB = largest
    }
  }

  const cBoxes = Math.max(cBoxesForPerformance, cBox.minCount)
  const dBoxes = Math.max(dBoxesForCapacity, cBoxes, dBox.minCount)

  if (dBoxes * capacityPerDBox(qlcSizeTB) < storageTB) {
    qlcSizeTB = qlcSizes.find((q) => dBoxes * capacityPerDBox(q) >= storageTB) ?? qlcSizes[qlcSizes.length - 1]
  }

  const lines: BomLine[] = [
    { name: 'C Box performance node', quantity: cBoxes, unitPrice: cBox.baseCost },
    { name: `C Box DRAM (${cBox.dramGB}GB each)`, quantity: cBoxes * cBox.dramGB, unitPrice: ALL_FLASH.dramPricePerGB, unit: 'GB' },
    { name: 'D Box capacity node (base)', quantity: dBoxes, unitPrice: dBox.baseCost },
    { name: `SCM drive (${dBox.scm.sizeGB}GB)`, quantity: dBoxes * dBox.scm.count, unitPrice: dBox.scm.costPerDrive, unit: 'drives' },
    { name: `${qlcSizeTB}TB QLC SSD`, quantity: dBoxes * dBox.qlc.count, unitPrice: dBox.qlc.prices[qlcSizeTB], unit: 'drives' },
  ]

  const hardwareCost = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)
  const { softwareCost, totalCost } = finish(hardwareCost, ALL_FLASH.softwareMultiplier)

  return {
    cBoxes,
    dBoxes,
    qlcSizeTB,
    capacityTB: dBoxes * capacityPerDBox(qlcSizeTB),
    readGBs: cBoxes * cBox.readGBs,
    writeGBs: cBoxes * cBox.writeGBs,
    hardwareCost,
    softwareCost,
    totalCost,
    lines,
  }
}

// ─── Comparison ─────────────────────────────────────────────────────────────

export function gpuOption(id: string): GpuOption {
  return GPU_OPTIONS.find((g) => g.id === id) ?? GPU_OPTIONS[0]
}

export function computeComparison(gpuCount: number, storageTB: number | undefined, gpuId: string): Comparison {
  const requirements = computeRequirements(gpuCount, storageTB)
  const vdura = calculateVdura(requirements)
  const allFlash = calculateAllFlash(requirements)
  const gpu = gpuOption(gpuId)
  const savings = allFlash.totalCost - vdura.totalCost
  return {
    requirements,
    vdura,
    allFlash,
    gpu,
    savings,
    extraGpus: Math.max(0, Math.floor(savings / gpu.price)),
    savingsPercent: allFlash.totalCost > 0 ? (savings / allFlash.totalCost) * 100 : 0,
  }
}
