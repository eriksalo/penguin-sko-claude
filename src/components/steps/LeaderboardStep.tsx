import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crown, Download, Play, Trash2 } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { Button } from '../ui/Button'
import { Penguin } from '../ui/Penguin'
import { CoBrand } from '../ui/Brand'
import { clearScores, rankScores, readScores, scoresToCsv, type ScoreEntry } from '../../lib/leaderboard'
import { cn, formatMoney, formatNumber } from '../../lib/utils'

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function Podium({ entry, place, highlight }: { entry?: ScoreEntry; place: 1 | 2 | 3; highlight: boolean }) {
  const heights = { 1: 'h-36 md:h-44', 2: 'h-28 md:h-32', 3: 'h-24 md:h-28' }
  const order = { 1: 'order-2', 2: 'order-1', 3: 'order-3' }
  return (
    <div className={cn('flex flex-1 flex-col items-center justify-end', order[place])}>
      {entry ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: place * 0.12 }} className="mb-2 text-center">
          {place === 1 && <Crown className="mx-auto mb-1 h-7 w-7 text-yellow" />}
          <p className={cn('max-w-[11rem] md:max-w-[16rem] break-words leading-tight font-black', place === 1 ? 'text-lg md:text-2xl text-yellow' : 'text-sm md:text-lg text-snow', highlight && 'underline decoration-yellow decoration-2')}>{entry.name}</p>
          <p className="text-2xl font-black tabular md:text-3xl">{formatNumber(entry.score)}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted">
            guessed {formatNumber(entry.guess)} · answer {formatNumber(entry.actual)}
          </p>
        </motion.div>
      ) : (
        <p className="mb-2 text-xs uppercase tracking-widest text-muted">open</p>
      )}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 * place, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ originY: 1 }}
        className={cn('flex w-full items-start justify-center rounded-t-2xl border-t-4 pt-3 text-4xl font-black', heights[place], place === 1 ? 'border-yellow bg-yellow/20 text-yellow' : 'border-penguin-lighter bg-penguin/80 text-muted')}
      >
        {place}
      </motion.div>
    </div>
  )
}

export function LeaderboardStep() {
  const { state, dispatch, play } = useGame()
  const [scores, setScores] = useState(() => rankScores(readScores()))
  const [confirming, setConfirming] = useState(false)
  const mine = state.saved?.id

  const reset = () => {
    clearScores()
    setScores([])
    setConfirming(false)
    play('womp')
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-8 md:px-8 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <CoBrand size="sm" className="mb-3 justify-start" />
          <h2 className="text-4xl font-black uppercase tracking-tight md:text-6xl">Leaderboard</h2>
          <p className="mt-1 text-muted">
            {scores.length === 0 ? 'Nobody has played yet. Be the first penguin on the ice.' : `${scores.length} ${scores.length === 1 ? 'play' : 'plays'} so far. Perfect guess = 1,250 points.`}
          </p>
        </div>
        <Penguin mood={scores.length > 0 ? 'cool' : 'idle'} className="h-28 w-24" />
      </header>

      <div className="flex items-end gap-2 md:gap-4">
        <Podium entry={scores[1]} place={2} highlight={scores[1]?.id === mine} />
        <Podium entry={scores[0]} place={1} highlight={scores[0]?.id === mine} />
        <Podium entry={scores[2]} place={3} highlight={scores[2]?.id === mine} />
      </div>

      {scores.length > 3 && (
        <ol className="mt-4 divide-y divide-penguin-lighter/60 overflow-hidden rounded-2xl border border-penguin-lighter bg-penguin/70">
          {scores.slice(3, 15).map((s, i) => (
            <li key={s.id} className={cn('flex items-center gap-4 px-4 py-3', s.id === mine && 'bg-yellow/10')}>
              <span className="w-8 text-right text-lg font-black text-muted tabular">{i + 4}</span>
              <span className={cn('flex-1 truncate font-bold', s.id === mine && 'text-yellow')}>{s.name}</span>
              <span className="hidden text-xs uppercase tracking-wider text-muted sm:block">
                {formatNumber(s.gpuCount)} GPUs · guessed {formatNumber(s.guess)} / {formatNumber(s.actual)} · saved {formatMoney(s.savings)}
              </span>
              <span className="text-xl font-black tabular text-snow">{formatNumber(s.score)}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={() => dispatch({ type: 'RESET' })}>
          <Play className="h-5 w-5 fill-current" /> Play
        </Button>
        <Button variant="ghost" size="lg" onClick={() => dispatch({ type: 'CLOSE_LEADERBOARD' })}>
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs">
        <button
          type="button"
          disabled={scores.length === 0}
          onClick={() => download(`penguin-sko-gpu-challenge-${new Date().toISOString().slice(0, 10)}.csv`, scoresToCsv(scores))}
          className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-muted hover:text-yellow disabled:opacity-30 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
        {confirming ? (
          <span className="inline-flex items-center gap-2">
            <span className="text-danger font-semibold">Wipe all {scores.length} scores?</span>
            <button type="button" onClick={reset} className="rounded-lg bg-danger px-2 py-1 font-bold uppercase text-penguin cursor-pointer">Yes, wipe</button>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg border border-penguin-lighter px-2 py-1 font-bold uppercase text-muted cursor-pointer">Cancel</button>
          </span>
        ) : (
          <button
            type="button"
            disabled={scores.length === 0}
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-muted hover:text-danger disabled:opacity-30 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Reset board
          </button>
        )}
      </div>
    </div>
  )
}
