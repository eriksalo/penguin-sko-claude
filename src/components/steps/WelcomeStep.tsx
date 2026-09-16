import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Trophy } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'
import { Penguin } from '../ui/Penguin'
import { PoweredBy, Wordmark } from '../ui/Brand'
import { rankScores, readScores } from '../../lib/leaderboard'
import { PRICING_QUARTER } from '../../data/pricing'
import { formatNumber } from '../../lib/utils'

const TAUNTS = [
  'Think you know what all-flash really costs in 2026?',
  'Storage savings so big they buy GPUs. How many? You tell us.',
  'Beat the leaderboard. Bragging rights for the whole SKO.',
  'Mixed fleet vs. all-flash. Guess the gap. Win the glory.',
]

export function WelcomeStep() {
  const { dispatch } = useGame()
  const [taunt, setTaunt] = useState(0)
  const scores = rankScores(readScores())
  const top = scores[0]

  useEffect(() => {
    const t = setInterval(() => setTaunt((i) => (i + 1) % TAUNTS.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-6 py-14 text-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Wordmark size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow/40 bg-yellow/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-yellow"
      >
        Sales Kickoff 2026
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="relative mt-6"
      >
        <div className="relative mx-auto w-44 md:w-56">
          <div className="absolute inset-x-8 bottom-1 h-6 rounded-full bg-black/40 blur-md" />
          <div className="animate-bob">
            <Penguin mood="idle" wave className="w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
      >
        The GPU
        <br />
        <span className="text-shimmer">Savings</span>
        <br />
        Challenge
      </motion.h1>

      <motion.p
        key={taunt}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mt-6 max-w-2xl text-lg font-medium text-muted md:text-2xl"
      >
        {TAUNTS[taunt]}
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col items-center gap-4">
        <div className="relative">
          <span className="absolute inset-0 rounded-2xl bg-yellow/40 animate-pulse-ring" />
          <Button size="xl" onClick={() => dispatch({ type: 'GO', step: 'configure' })} className="relative">
            <Play className="h-6 w-6 fill-current" /> Let's Play
          </Button>
        </div>
        <Button variant="ghost" size="md" onClick={() => dispatch({ type: 'OPEN_LEADERBOARD' })}>
          <Trophy className="h-4 w-4" /> Leaderboard {scores.length > 0 && <span className="text-muted">({scores.length})</span>}
        </Button>
      </motion.div>

      {top && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 rounded-2xl border border-penguin-lighter bg-penguin/70 px-5 py-3 text-sm">
          <span className="text-muted">Score to beat:</span> <span className="font-black text-yellow tabular">{formatNumber(top.score)}</span>{' '}
          <span className="text-muted">by</span> <span className="font-bold text-snow">{top.name}</span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-10 space-y-1">
        <PoweredBy />
        <p className="text-[11px] uppercase tracking-widest text-muted/70">{PRICING_QUARTER} pricing · illustrative, not a quote</p>
      </motion.div>
    </div>
  )
}
