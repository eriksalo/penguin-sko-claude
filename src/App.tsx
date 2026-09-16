import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider, useGame, type Step } from './context/GameContext'
import { Snow } from './components/ui/Snow'
import { Chrome } from './components/ui/Chrome'
import { WelcomeStep } from './components/steps/WelcomeStep'
import { ConfigureStep } from './components/steps/ConfigureStep'
import { GuessStep } from './components/steps/GuessStep'
import { RevealStep } from './components/steps/RevealStep'
import { LeaderboardStep } from './components/steps/LeaderboardStep'

const steps: Record<Step, React.FC> = {
  welcome: WelcomeStep,
  configure: ConfigureStep,
  guess: GuessStep,
  reveal: RevealStep,
  leaderboard: LeaderboardStep,
}

/** Booth idle timer: after a few minutes without input, return to the attract screen. */
const IDLE_MS = 3 * 60 * 1000

function IdleReset() {
  const { state, dispatch } = useGame()
  useEffect(() => {
    if (state.step === 'welcome') return
    let timer = window.setTimeout(() => dispatch({ type: 'RESET' }), IDLE_MS)
    const bump = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => dispatch({ type: 'RESET' }), IDLE_MS)
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel']
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, bump))
    }
  }, [state.step, dispatch])
  return null
}

function StepRenderer() {
  const { state } = useGame()
  const StepComponent = steps[state.step]

  useEffect(() => {
    document.getElementById('scroller')?.scrollTo({ top: 0 })
  }, [state.step])

  return (
    <div id="scroller" className="relative z-10 h-full w-full overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-full"
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <div className="relative h-full bg-ink">
        <Snow />
        <Chrome />
        <IdleReset />
        <StepRenderer />
      </div>
    </GameProvider>
  )
}
