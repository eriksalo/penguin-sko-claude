import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { RotateCcw, Trophy } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { BomTable } from '../ui/BomTable'
import { Penguin, type Mood } from '../ui/Penguin'
import { PoweredBy } from '../ui/Brand'
import { accuracyScore, verdict } from '../../lib/scoring'
import { rankOf, readScores } from '../../lib/leaderboard'
import { cn, formatMoney, formatNumber } from '../../lib/utils'

const DRUMROLL_MS = 3400
const SCRAMBLE_WORDS = ['Sizing VPODs…', 'Counting JBODs…', 'Pricing 30TB QLC…', 'Adding partner margin…', 'Carrying the one…', 'Checking with Finance…']

type Phase = 'drumroll' | 'savings' | 'gpus' | 'verdict' | 'done'

function fireConfetti(big: boolean) {
  const colors = ['#ffcd30', '#f5f6f8', '#8fd3ff', '#242b2e']
  const base = { colors, zIndex: 60, disableForReducedMotion: true }
  confetti({ ...base, particleCount: big ? 160 : 70, spread: big ? 100 : 60, origin: { y: 0.55 } })
  if (big) {
    window.setTimeout(() => confetti({ ...base, particleCount: 90, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 250)
    window.setTimeout(() => confetti({ ...base, particleCount: 90, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 450)
  }
}

export function RevealStep() {
  const { state, dispatch, play } = useGame()
  const { result, guess, saved } = state
  const [phase, setPhase] = useState<Phase>('drumroll')
  const [word, setWord] = useState(0)
  const [count, setCount] = useState(3)
  const started = useRef(false)

  const v = useMemo(() => (result ? verdict(guess, result.extraGpus) : null), [result, guess])
  const score = result ? accuracyScore(guess, result.extraGpus) : 0
  const rankInfo = useMemo(() => {
    if (!saved) return null
    const all = readScores()
    return { rank: rankOf(saved.id, all), total: all.length }
  }, [saved])

  // Drumroll
  useEffect(() => {
    if (started.current) return
    started.current = true
    play('drumroll', DRUMROLL_MS / 1000)
    const words = window.setInterval(() => setWord((w) => (w + 1) % SCRAMBLE_WORDS.length), 550)
    const c1 = window.setTimeout(() => setCount(2), DRUMROLL_MS - 2200)
    const c2 = window.setTimeout(() => setCount(1), DRUMROLL_MS - 1400)
    const c3 = window.setTimeout(() => setCount(0), DRUMROLL_MS - 600)
    const go = window.setTimeout(() => {
      window.clearInterval(words)
      setPhase('savings')
      play('reveal')
    }, DRUMROLL_MS)
    return () => {
      window.clearInterval(words)
      ;[c1, c2, c3, go].forEach(window.clearTimeout)
    }
  }, [play])

  // Phase chain after drumroll
  useEffect(() => {
    if (phase === 'savings') {
      const t = window.setTimeout(() => setPhase('gpus'), 1900)
      return () => window.clearTimeout(t)
    }
    if (phase === 'gpus') {
      const t = window.setTimeout(() => setPhase('verdict'), 2300)
      return () => window.clearTimeout(t)
    }
    if (phase === 'verdict' && v) {
      const great = v.tier === 'emperor' || v.tier === 'king'
      if (great) {
        fireConfetti(v.tier === 'emperor')
        play('fanfare')
      } else if (v.tier === 'ice') play('womp')
      else play('reveal')
      const t = window.setTimeout(() => setPhase('done'), 900)
      return () => window.clearTimeout(t)
    }
  }, [phase, v, play])

  if (!result || !v) return null
  const { extraGpus, savings, gpu } = result
  const diff = extraGpus - guess
  const mood: Mood = phase === 'drumroll' ? 'shocked' : v.tier === 'emperor' ? 'cool' : v.tier === 'king' || v.tier === 'rockhopper' ? 'happy' : v.tier === 'ice' ? 'sad' : 'idle'
  const barMax = Math.max(extraGpus, guess, 1)

  if (phase === 'drumroll') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <motion.div animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }} transition={{ duration: 0.35, repeat: Infinity }} className="w-40 md:w-56">
          <Penguin mood="shocked" className="w-full" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-[9rem] font-black leading-none text-yellow tabular md:text-[13rem]"
          >
            {count > 0 ? count : '!'}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={word} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-2 text-lg font-semibold uppercase tracking-widest text-muted">
            {SCRAMBLE_WORDS[word]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-10 text-sm text-muted">
          Your guess: <span className="font-black text-snow tabular">{formatNumber(guess)}</span> extra {gpu.name}s
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-8 md:px-8 md:py-10">
      {/* Savings */}
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }} className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Storage savings, Penguin + VDURA vs. all-flash</p>
        <p className="mt-2 text-6xl font-black text-yellow tabular md:text-8xl">
          <AnimatedNumber value={savings} from={0} duration={1700} format={formatMoney} />
        </p>
        <p className="mt-1 text-sm text-muted">{result.savingsPercent.toFixed(0)}% less than the all-flash bill</p>
      </motion.div>

      {/* Extra GPUs */}
      <AnimatePresence>
        {phase !== 'savings' && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative mt-8 overflow-hidden rounded-3xl border-2 border-yellow/60 bg-penguin/80 p-6 text-center md:p-10"
          >
            <div className="absolute -left-4 -bottom-6 w-32 opacity-90 md:w-44">
              <Penguin mood={mood} wave={mood === 'cool'} className="w-full drop-shadow-2xl" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted">That buys</p>
            <p className="mt-1 text-8xl font-black leading-none text-yellow tabular md:text-[11rem]">
              <AnimatedNumber value={extraGpus} from={0} duration={2000} />
            </p>
            <p className="mt-2 text-xl font-bold uppercase tracking-wider text-snow md:text-2xl">
              extra {gpu.vendor} {gpu.name} GPUs
            </p>
            <p className="text-xs text-muted">at {formatMoney(gpu.price)} each</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verdict */}
      <AnimatePresence>
        {(phase === 'verdict' || phase === 'done') && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} className="mt-6 space-y-6">
            <div
              className={cn(
                'rounded-3xl border-2 p-6 text-center md:p-8',
                v.tier === 'emperor' && 'border-yellow bg-yellow text-penguin shadow-glow-lg',
                v.tier === 'king' && 'border-yellow/70 bg-yellow/15',
                v.tier === 'rockhopper' && 'border-snow/40 bg-penguin/80',
                v.tier === 'chilly' && 'border-ice/50 bg-ice/10',
                v.tier === 'ice' && 'border-ice bg-ice/20',
              )}
            >
              <h3 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{v.title}</h3>
              <p className={cn('mt-2 text-base md:text-lg', v.tier === 'emperor' ? 'text-penguin/80' : 'text-snow')}>{v.line}</p>

              <div className="mx-auto mt-6 max-w-xl space-y-2 text-left">
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>Your guess</span>
                    <span className="tabular">{formatNumber(guess)}</span>
                  </div>
                  <div className={cn('h-4 rounded-full', v.tier === 'emperor' ? 'bg-penguin/20' : 'bg-ink')}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(guess / barMax) * 100}%` }} transition={{ duration: 0.9, delay: 0.2 }} className={cn('h-4 rounded-full', v.tier === 'emperor' ? 'bg-penguin' : 'bg-ice')} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span>The answer</span>
                    <span className="tabular">{formatNumber(extraGpus)}</span>
                  </div>
                  <div className={cn('h-4 rounded-full', v.tier === 'emperor' ? 'bg-penguin/20' : 'bg-ink')}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(extraGpus / barMax) * 100}%` }} transition={{ duration: 0.9, delay: 0.4 }} className={cn('h-4 rounded-full', v.tier === 'emperor' ? 'bg-penguin' : 'bg-yellow')} />
                  </div>
                </div>
              </div>

              <p className={cn('mt-4 text-sm', v.tier === 'emperor' ? 'text-penguin/80' : 'text-muted')}>
                {diff === 0 ? 'Dead on.' : diff > 0 ? `${formatNumber(diff)} more than you guessed.` : `${formatNumber(-diff)} fewer than you guessed.`}
              </p>

              <div className={cn('mt-6 flex flex-wrap items-center justify-center gap-6 border-t pt-5', v.tier === 'emperor' ? 'border-penguin/20' : 'border-penguin-lighter')}>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">Score</p>
                  <p className="text-4xl font-black tabular">{formatNumber(score)}</p>
                </div>
                {rankInfo && rankInfo.rank > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">Leaderboard</p>
                    <p className="text-4xl font-black tabular">
                      #{rankInfo.rank} <span className="text-base font-bold opacity-70">of {rankInfo.total}</span>
                    </p>
                  </div>
                )}
                {saved && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">Player</p>
                    <p className="text-2xl font-black">{saved.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => dispatch({ type: 'RESET' })}>
                <RotateCcw className="h-5 w-5" /> Play again
              </Button>
              <Button variant="ghost" size="lg" onClick={() => dispatch({ type: 'OPEN_LEADERBOARD' })}>
                <Trophy className="h-5 w-5" /> Leaderboard
              </Button>
            </div>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-4">
              <h4 className="mb-1 text-center text-2xl font-black uppercase tracking-tight md:text-3xl">The math behind the number</h4>
              <p className="mb-5 text-center text-sm text-muted">
                {formatNumber(result.requirements.gpuCount)} GPUs · {formatNumber(result.requirements.readGBs)} / {formatNumber(result.requirements.writeGBs)} GB/s · {(result.requirements.storageTB / 1000).toFixed(0)} PB usable
              </p>
              <BomTable result={result} />
              <PoweredBy className="mt-6 text-center" />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
