import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { computeComparison, defaultStorageTB, type Comparison } from '../lib/calculations'
import { DEFAULT_GPU_ID, GPU_RANGE } from '../data/pricing'
import { accuracyScore } from '../lib/scoring'
import { addScore, type ScoreEntry } from '../lib/leaderboard'
import { sfx } from '../lib/sound'
import { clamp } from '../lib/utils'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Step = 'welcome' | 'configure' | 'guess' | 'reveal' | 'leaderboard'

export interface GameState {
  step: Step
  /** where the leaderboard should return to */
  returnStep: Step
  playerName: string
  gpuCount: number
  storageTB: number
  storageOverridden: boolean
  gpuId: string
  guess: number
  result: Comparison | null
  saved: ScoreEntry | null
  soundOn: boolean
}

type Action =
  | { type: 'GO'; step: Step }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_GPU_COUNT'; gpuCount: number }
  | { type: 'SET_STORAGE'; storageTB: number }
  | { type: 'RESET_STORAGE' }
  | { type: 'SET_GPU_ID'; gpuId: string }
  | { type: 'SET_GUESS'; guess: number }
  | { type: 'LOCKED_IN'; result: Comparison; saved: ScoreEntry | null }
  | { type: 'OPEN_LEADERBOARD' }
  | { type: 'CLOSE_LEADERBOARD' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET' }

const SOUND_KEY = 'penguin-sko-sound'

function readSoundPref(): boolean {
  try {
    const v = localStorage.getItem(SOUND_KEY)
    return v === null ? true : v === '1'
  } catch {
    return true
  }
}

const initialState: GameState = {
  step: 'welcome',
  returnStep: 'welcome',
  playerName: '',
  gpuCount: GPU_RANGE.default,
  storageTB: defaultStorageTB(GPU_RANGE.default),
  storageOverridden: false,
  gpuId: DEFAULT_GPU_ID,
  guess: 100,
  result: null,
  saved: null,
  soundOn: readSoundPref(),
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO':
      return { ...state, step: action.step }
    case 'SET_NAME':
      return { ...state, playerName: action.name.slice(0, 24) }
    case 'SET_GPU_COUNT': {
      const gpuCount = clamp(action.gpuCount, GPU_RANGE.min, GPU_RANGE.max)
      return {
        ...state,
        gpuCount,
        storageTB: state.storageOverridden ? state.storageTB : defaultStorageTB(gpuCount),
      }
    }
    case 'SET_STORAGE':
      return { ...state, storageTB: action.storageTB, storageOverridden: true }
    case 'RESET_STORAGE':
      return { ...state, storageTB: defaultStorageTB(state.gpuCount), storageOverridden: false }
    case 'SET_GPU_ID':
      return { ...state, gpuId: action.gpuId }
    case 'SET_GUESS':
      return { ...state, guess: clamp(Math.round(action.guess), 0, 99_999) }
    case 'LOCKED_IN':
      return { ...state, result: action.result, saved: action.saved, step: 'reveal' }
    case 'OPEN_LEADERBOARD':
      return { ...state, returnStep: state.step === 'leaderboard' ? state.returnStep : state.step, step: 'leaderboard' }
    case 'CLOSE_LEADERBOARD':
      return { ...state, step: state.returnStep }
    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn }
    case 'RESET':
      return { ...initialState, soundOn: state.soundOn }
    default:
      return state
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
  /** Play a sound cue if sound is enabled. */
  play: (cue: keyof typeof sfx, ...args: number[]) => void
  /** Compute the answer, save the score, and move to the reveal. */
  lockIn: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, state.soundOn ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [state.soundOn])

  const play = useCallback(
    (cue: keyof typeof sfx, ...args: number[]) => {
      if (!state.soundOn) return
      try {
        ;(sfx[cue] as (...a: number[]) => void)(...args)
      } catch {
        /* audio unavailable */
      }
    },
    [state.soundOn],
  )

  const lockIn = useCallback(() => {
    const result = computeComparison(state.gpuCount, state.storageTB, state.gpuId)
    let saved: ScoreEntry | null = null
    try {
      saved = addScore({
        name: state.playerName,
        score: accuracyScore(state.guess, result.extraGpus),
        guess: state.guess,
        actual: result.extraGpus,
        gpuCount: state.gpuCount,
        gpuName: result.gpu.name,
        savings: result.savings,
      })
    } catch {
      saved = null
    }
    dispatch({ type: 'LOCKED_IN', result, saved })
  }, [state.gpuCount, state.storageTB, state.gpuId, state.playerName, state.guess])

  const value = useMemo(() => ({ state, dispatch, play, lockIn }), [state, play, lockIn])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
