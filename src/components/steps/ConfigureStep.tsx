import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Database, Gauge, RotateCcw, Server, User } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'
import { Slider } from '../ui/Slider'
import { Penguin } from '../ui/Penguin'
import { ENHANCED_MODE, GPU_OPTIONS, GPU_RANGE, GPU_SPEC_UNIT } from '../../data/pricing'
import { computeRequirements, defaultStorageTB } from '../../lib/calculations'
import { cn, formatCapacity, formatMoney, formatNumber } from '../../lib/utils'

function Card({ icon, title, children, className }: { icon: React.ReactNode; title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-3xl border border-penguin-lighter bg-penguin/80 p-5 md:p-6 backdrop-blur', className)}>
      <div className="mb-4 flex items-center gap-2 text-yellow">
        {icon}
        <h3 className="text-sm font-black uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function RackField({ gpuCount }: { gpuCount: number }) {
  const units = Math.ceil(gpuCount / 256)
  const shown = Math.min(units, 40)
  return (
    <div className="flex flex-wrap gap-1.5" aria-label={`${units} scalable units of 256 GPUs`}>
      {Array.from({ length: shown }, (_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: Math.min(i * 0.02, 0.5), type: 'spring', stiffness: 400, damping: 20 }}
          className="flex h-7 w-5 flex-col justify-around rounded-sm bg-penguin-lighter p-[3px]"
        >
          <span className="block h-[3px] rounded-full bg-yellow" />
          <span className="block h-[3px] rounded-full bg-yellow/70" />
          <span className="block h-[3px] rounded-full bg-yellow/40" />
        </motion.div>
      ))}
      {units > shown && <span className="self-center pl-1 text-xs text-muted">+{units - shown} more</span>}
    </div>
  )
}

export function ConfigureStep() {
  const { state, dispatch, play } = useGame()
  const { gpuCount, storageTB, storageOverridden, gpuId, playerName } = state
  const req = computeRequirements(gpuCount, storageTB)
  const defaultTB = defaultStorageTB(gpuCount)
  const gpu = GPU_OPTIONS.find((g) => g.id === gpuId) ?? GPU_OPTIONS[0]

  const minStorage = Math.max(1000, Math.round(defaultTB * 0.5 / 1000) * 1000)
  const maxStorage = Math.round(defaultTB * 2 / 1000) * 1000

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-5 py-8 md:px-8 md:py-10">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow">Step 1 of 2</p>
          <h2 className="mt-1 text-3xl font-black uppercase tracking-tight md:text-5xl">Build your GPU cluster</h2>
          <p className="mt-2 text-muted md:text-lg">Size the cluster. We'll size the storage two ways and you guess the difference.</p>
        </div>
        <Penguin mood="thinking" className="hidden h-28 w-24 shrink-0 md:block" />
      </motion.header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card icon={<User className="h-5 w-5" />} title="Who's playing?" className="md:col-span-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
            placeholder="Your name (for the leaderboard)"
            maxLength={24}
            autoComplete="off"
            enterKeyHint="done"
            className="w-full rounded-2xl border-2 border-penguin-lighter bg-ink px-5 py-4 text-xl font-bold text-snow placeholder:text-muted/60 focus:border-yellow focus:outline-none md:text-2xl"
          />
        </Card>

        <Card icon={<Cpu className="h-5 w-5" />} title="GPUs in the cluster" className="md:col-span-2">
          <Slider
            label="GPU count"
            value={gpuCount}
            min={GPU_RANGE.min}
            max={GPU_RANGE.max}
            step={GPU_RANGE.step}
            onChange={(v) => { dispatch({ type: 'SET_GPU_COUNT', gpuCount: v }); play('tick') }}
            format={(v) => formatNumber(v)}
            hint={`${formatNumber(Math.ceil(gpuCount / 256))} scalable units × 256 GPUs`}
          />
          <div className="mt-4">
            <RackField gpuCount={gpuCount} />
          </div>
        </Card>

        <Card icon={<Server className="h-5 w-5" />} title="Which GPU are we buying more of?">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GPU_OPTIONS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => { dispatch({ type: 'SET_GPU_ID', gpuId: g.id }); play('click') }}
                className={cn(
                  'rounded-2xl border-2 px-3 py-3 text-left transition-colors cursor-pointer',
                  g.id === gpuId ? 'border-yellow bg-yellow text-penguin' : 'border-penguin-lighter bg-ink text-snow hover:border-yellow/60',
                )}
              >
                <div className="text-base font-black leading-none">{g.name}</div>
                <div className={cn('mt-1 text-[11px] font-semibold uppercase tracking-wide', g.id === gpuId ? 'text-penguin/70' : 'text-muted')}>
                  {g.vendor} · {formatMoney(g.price)}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card icon={<Gauge className="h-5 w-5" />} title="Required throughput">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-ink p-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Read</p>
              <p className="mt-1 text-3xl font-black text-yellow tabular">{formatNumber(req.readGBs)}</p>
              <p className="text-xs text-muted">GB/s</p>
            </div>
            <div className="rounded-2xl bg-ink p-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Write</p>
              <p className="mt-1 text-3xl font-black text-yellow tabular">{formatNumber(req.writeGBs)}</p>
              <p className="text-xs text-muted">GB/s</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Enhanced-mode checkpointing: {ENHANCED_MODE.readGBsPerUnit} / {ENHANCED_MODE.writeGBsPerUnit} GB/s and {ENHANCED_MODE.storagePBPerUnit} PB per {formatNumber(GPU_SPEC_UNIT)} GPUs.
          </p>
        </Card>

        <Card icon={<Database className="h-5 w-5" />} title="Usable storage" className="md:col-span-2">
          <Slider
            label="Capacity"
            value={storageTB}
            min={minStorage}
            max={maxStorage}
            step={1000}
            onChange={(v) => { dispatch({ type: 'SET_STORAGE', storageTB: v }); play('tick') }}
            format={formatCapacity}
            hint={`Default ${formatCapacity(defaultTB)} · 20% flash / 80% HDD on the mixed fleet`}
          />
          {storageOverridden && (
            <button type="button" onClick={() => dispatch({ type: 'RESET_STORAGE' })} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-yellow hover:underline cursor-pointer">
              <RotateCcw className="h-3 w-3" /> Reset to default
            </button>
          )}
        </Card>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col items-center gap-3">
        <Button size="xl" onClick={() => dispatch({ type: 'GO', step: 'guess' })}>
          Next: make my guess <ArrowRight className="h-6 w-6" />
        </Button>
        <p className="text-xs text-muted">
          {formatNumber(gpuCount)} × {gpu.vendor} {gpu.name} · {formatCapacity(storageTB)} usable
        </p>
      </motion.div>
    </div>
  )
}
