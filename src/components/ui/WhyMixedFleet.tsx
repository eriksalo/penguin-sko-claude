import { Coins, Gauge, Layers } from 'lucide-react'
import type { Comparison } from '../../lib/calculations'
import { ALL_FLASH, VDURA } from '../../data/pricing'
import { cn, formatNumber } from '../../lib/utils'
import { VduraLogo } from './Brand'

/**
 * Three VDURA Mixed Fleet talking points for the reveal screen. Copy follows
 * the SCIPAB messaging in eriksalo/ssdgpu_costcalculator; every number is
 * derived from pricing.ts or the live comparison so it never drifts.
 */
export function WhyMixedFleet({ result, className }: { result: Comparison; className?: string }) {
  const { vdura, allFlash } = result
  const flashPct = VDURA.ssdCapacityPercent
  const hddPct = 100 - flashPct
  const fewerNodes = vdura.vpods < allFlash.cBoxes

  const points = [
    {
      icon: Layers,
      title: 'One namespace, two media',
      body: `Hot data and checkpoints land on ${flashPct}% TLC flash in VPODs. The other ${hddPct}% lives on high-capacity HDDs in JBODs. Same parallel file system, same mount point, no separate tiering product to license.`,
    },
    {
      icon: Gauge,
      title: 'Performance density',
      body: `${VDURA.vpod.readGBs} GB/s read per VPOD versus ${ALL_FLASH.cBox.readGBs} GB/s per competitor performance node.${
        fewerNodes ? ` This cluster needs ${formatNumber(vdura.vpods)} VPODs where the competitor needs ${formatNumber(allFlash.cBoxes)} C Boxes.` : ''
      } Fewer nodes means fewer CPUs, DRAM and NICs exposed to component price spikes.`,
    },
    {
      icon: Coins,
      title: 'Budget goes to GPUs',
      body: `SSD prices more than tripled from 2025 into 2026 while HDD prices held steady. Keeping ${hddPct}% of capacity on HDD shields the storage bill from flash volatility, and the difference buys GPUs.`,
    },
  ]

  return (
    <section className={cn('rounded-3xl border border-vdura/40 bg-gradient-to-br from-vdura/10 to-transparent p-5 md:p-7', className)}>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Why</span>
        <VduraLogo className="h-6 md:h-7" />
        <h4 className="text-xl font-black uppercase tracking-tight text-vdura md:text-2xl">Mixed Fleet wins</h4>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {points.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-penguin-lighter bg-penguin/80 p-4">
            <div className="mb-2 flex items-center gap-2 text-vdura">
              <Icon className="h-5 w-5" />
              <h5 className="text-sm font-black uppercase tracking-wider">{title}</h5>
            </div>
            <p className="text-sm leading-relaxed text-snow/90">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
