import { useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Minus, Plus } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'
import { Penguin } from '../ui/Penguin'
import { VduraLogo } from '../ui/Brand'
import { VDURA } from '../../data/pricing'
import { computeRequirements, gpuOption } from '../../lib/calculations'
import { cn, formatCapacity, formatMoney, formatNumber } from '../../lib/utils'

const QUICK_PCTS = [0.05, 0.1, 0.25, 0.5, 0.75, 1]

export function GuessStep() {
  const { state, dispatch, play, lockIn } = useGame()
  const { gpuCount, storageTB, gpuId, guess, playerName } = state
  const gpu = gpuOption(gpuId)
  const req = computeRequirements(gpuCount, storageTB)
  const [locking, setLocking] = useState(false)
  const sliderMax = gpuCount

  const set = (v: number) => {
    dispatch({ type: 'SET_GUESS', guess: v })
  }
  const bump = (delta: number) => {
    set(guess + delta)
    play('tick')
  }

  const onLock = () => {
    if (locking) return
    setLocking(true)
    play('drumroll', 0.6)
    window.setTimeout(lockIn, 350)
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-8 md:px-8 md:py-10">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow">Step 2 of 2</p>
        <h2 className="mt-1 text-3xl font-black uppercase tracking-tight md:text-5xl">
          {playerName ? `${playerName}, ` : ''}how many extra <span className="text-yellow">{gpu.name}s</span> does the storage savings buy?
        </h2>
        <p className="mt-3 text-muted md:text-lg">
          Same cluster, same capacity, same throughput. VDURA Mixed Fleet from Penguin Computing versus an all-flash competitor.
          Every {formatMoney(gpu.price)} saved is one more {gpu.vendor} {gpu.name}.
        </p>
      </motion.header>

      <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
        {[
          `${formatNumber(gpuCount)} GPUs`,
          `${formatCapacity(storageTB)} usable`,
          `${formatNumber(req.readGBs)} / ${formatNumber(req.writeGBs)} GB/s`,
          `${gpu.vendor} ${gpu.name} @ ${formatMoney(gpu.price)}`,
        ].map((chip) => (
          <span key={chip} className="rounded-full border border-penguin-lighter bg-penguin/70 px-3 py-1.5 text-muted">
            {chip}
          </span>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 md:gap-3">
        <div className="flex flex-col justify-center rounded-2xl border border-vdura/50 bg-vdura/10 px-4 py-3">
          <VduraLogo className="h-5 md:h-6" />
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-vdura">
            Mixed Fleet · {VDURA.ssdCapacityPercent}% TLC flash / {100 - VDURA.ssdCapacityPercent}% HDD
          </p>
        </div>
        <div className="flex items-center text-xl font-black uppercase tracking-widest text-muted md:text-2xl">vs</div>
        <div className="flex flex-col justify-center rounded-2xl border border-ice/40 bg-ice/10 px-4 py-3 text-right">
          <p className="text-base font-black uppercase leading-none tracking-wide text-ice md:text-lg">All-Flash Competitor</p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-ice/80">100% QLC flash</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border-2 border-yellow/50 bg-penguin/80 p-6 md:p-10"
      >
        <Penguin mood="thinking" className="pointer-events-none absolute -right-6 -top-4 h-44 w-36 opacity-20 md:opacity-40" />

        <div className="relative flex items-center justify-center gap-3 md:gap-6">
          <button type="button" aria-label="minus 10" onClick={() => bump(-10)} className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-penguin-lighter bg-ink text-yellow hover:border-yellow cursor-pointer md:h-20 md:w-20">
            <Minus className="h-7 w-7" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={99_999}
            value={guess}
            onChange={(e) => set(Number(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            aria-label="Your guess: extra GPUs"
            className="w-48 border-b-4 border-yellow/40 bg-transparent text-center text-7xl font-black text-yellow tabular focus:border-yellow focus:outline-none md:w-72 md:text-9xl"
          />
          <button type="button" aria-label="plus 10" onClick={() => bump(10)} className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-penguin-lighter bg-ink text-yellow hover:border-yellow cursor-pointer md:h-20 md:w-20">
            <Plus className="h-7 w-7" />
          </button>
        </div>
        <p className="mt-3 text-center text-sm font-semibold uppercase tracking-widest text-muted">extra {gpu.name} GPUs</p>

        <div className="mt-8">
          <input
            type="range"
            className="pc-range"
            min={0}
            max={sliderMax}
            step={1}
            value={Math.min(guess, sliderMax)}
            aria-label="Guess slider"
            onChange={(e) => set(Number(e.target.value))}
            style={{ '--fill': `${(Math.min(guess, sliderMax) / sliderMax) * 100}%` } as CSSProperties}
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-muted">
            <span>0</span>
            <span>Slide, tap a quick pick, or type</span>
            <span>{formatNumber(sliderMax)} (double the cluster)</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {QUICK_PCTS.map((p) => {
            const v = Math.round(gpuCount * p)
            const active = guess === v
            return (
              <button
                key={p}
                type="button"
                onClick={() => { set(v); play('click') }}
                className={cn(
                  'rounded-xl border-2 px-3 py-2 text-sm font-bold tabular transition-colors cursor-pointer',
                  active ? 'border-yellow bg-yellow text-penguin' : 'border-penguin-lighter bg-ink text-snow hover:border-yellow/60',
                )}
              >
                {formatNumber(v)} <span className={cn('text-[10px] uppercase', active ? 'text-penguin/70' : 'text-muted')}>({Math.round(p * 100)}%)</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button size="xl" onClick={onLock} disabled={locking} className="min-w-[280px]">
          <Lock className="h-6 w-6" /> {locking ? 'Locking…' : 'Lock it in'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'GO', step: 'configure' })}>
          <ArrowLeft className="h-4 w-4" /> Change my cluster
        </Button>
      </div>
    </div>
  )
}
