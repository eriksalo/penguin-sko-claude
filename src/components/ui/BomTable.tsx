import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Comparison, BomLine } from '../../lib/calculations'
import { PRICING_QUARTER } from '../../data/pricing'
import { cn, formatCapacity, formatExactMoney, formatMoney, formatNumber } from '../../lib/utils'
import { VduraLogo } from './Brand'

function Lines({ lines, accent }: { lines: BomLine[]; accent: 'vdura' | 'ice' }) {
  return (
    <table className="w-full text-xs md:text-sm">
      <tbody className="divide-y divide-penguin-lighter/50">
        {lines.map((l) => (
          <tr key={l.name}>
            <td className="py-1.5 pr-2 text-muted">{l.name}</td>
            <td className="py-1.5 px-2 text-right tabular whitespace-nowrap">
              {formatNumber(l.quantity)} {l.unit ?? ''}
            </td>
            <td className="py-1.5 px-2 text-right tabular text-muted whitespace-nowrap">@ {formatExactMoney(l.unitPrice)}</td>
            <td className={cn('py-1.5 pl-2 text-right tabular font-semibold whitespace-nowrap', accent === 'vdura' ? 'text-vdura' : 'text-ice')}>
              {formatMoney(l.quantity * l.unitPrice)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function BomTable({ result }: { result: Comparison }) {
  const { vdura, allFlash, savings, extraGpus, gpu, savingsPercent } = result
  const [open, setOpen] = useState(false)

  const row = (label: string, a: React.ReactNode, b: React.ReactNode, strong = false) => (
    <tr className={cn(strong && 'bg-penguin-light/60')}>
      <td className={cn('py-3 pr-3 text-left text-muted', strong && 'font-bold text-snow')}>{label}</td>
      <td className={cn('py-3 px-3 text-right tabular', strong ? 'text-lg md:text-xl font-black text-vdura' : 'text-snow')}>{a}</td>
      <td className={cn('py-3 pl-3 text-right tabular', strong ? 'text-lg md:text-xl font-black text-ice' : 'text-snow')}>{b}</td>
    </tr>
  )

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-2xl border border-penguin-lighter bg-penguin/70">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="border-b border-penguin-lighter">
              <th className="py-3 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">{PRICING_QUARTER} pricing</th>
              <th className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <VduraLogo className="h-4 md:h-5" />
                  <span className="font-black uppercase tracking-wide text-vdura">Mixed Fleet</span>
                </div>
              </th>
              <th className="py-3 pl-3 text-right text-ice font-black uppercase tracking-wide">All-Flash Competitor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-penguin-lighter/50 [&_td]:px-3 [&_th]:px-3">
            {row(
              'Architecture',
              <span>
                {vdura.velos} VELO + {vdura.vpods} VPOD ({vdura.ssdSizeTB}TB TLC){vdura.jbods > 0 && <> + {vdura.jbods} JBOD</>}
              </span>,
              <span>{allFlash.cBoxes} C Box + {allFlash.dBoxes} D Box ({allFlash.qlcSizeTB}TB QLC)</span>,
            )}
            {row(
              'Usable capacity',
              <span>{formatCapacity(vdura.capacityTB)} <span className="text-muted text-xs">({Math.round((vdura.ssdCapacityTB / vdura.capacityTB) * 100)}% flash)</span></span>,
              <span>{formatCapacity(allFlash.capacityTB)} <span className="text-muted text-xs">(100% flash)</span></span>,
            )}
            {row('Throughput (read / write)', `${formatNumber(vdura.readGBs)} / ${formatNumber(vdura.writeGBs)} GB/s`, `${formatNumber(allFlash.readGBs)} / ${formatNumber(allFlash.writeGBs)} GB/s`)}
            {row('Hardware', formatMoney(vdura.hardwareCost), formatMoney(allFlash.hardwareCost))}
            {row('Software + support', formatMoney(vdura.softwareCost), formatMoney(allFlash.softwareCost))}
            {row('Total (incl. 15% partner margin)', formatMoney(vdura.totalCost), formatMoney(allFlash.totalCost), true)}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-yellow/40 bg-gradient-to-br from-yellow/15 via-vdura/10 to-yellow/5 p-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-widest text-muted">
          <span>Storage savings with Penguin Computing +</span>
          <VduraLogo className="h-3.5" />
        </div>
        <p className="mt-1 text-3xl md:text-4xl font-black text-yellow tabular">{formatMoney(savings)}</p>
        <p className="mt-1 text-sm text-snow">
          {savingsPercent.toFixed(0)}% less than all-flash. That buys <span className="font-black text-yellow">{formatNumber(extraGpus)}</span> more {gpu.vendor} {gpu.name} GPUs at {formatMoney(gpu.price)} each.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mx-auto flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted hover:text-yellow cursor-pointer"
      >
        {open ? 'Hide' : 'Show'} full bill of materials
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid gap-4 overflow-hidden md:grid-cols-2"
          >
            <div className="rounded-2xl border border-vdura/40 bg-penguin/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <VduraLogo className="h-4" />
                <h4 className="text-sm font-black uppercase tracking-wide text-vdura">Mixed Fleet</h4>
              </div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">VELO directors · VPOD flash nodes · JBOD HDD capacity tier</p>
              <Lines lines={vdura.lines} accent="vdura" />
            </div>
            <div className="rounded-2xl border border-ice/30 bg-penguin/70 p-4">
              <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-ice">All-Flash Competitor</h4>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">C Box performance nodes · D Box SCM + QLC enclosures</p>
              <Lines lines={allFlash.lines} accent="ice" />
            </div>
            <p className="md:col-span-2 text-center text-xs text-muted">
              Illustrative {PRICING_QUARTER} list pricing from the VDURA SSD/GPU cost calculator. Software + support is 50% of VDURA total and 60% of all-flash total. Not a quote.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
