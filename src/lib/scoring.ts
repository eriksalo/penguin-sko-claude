export const MAX_SCORE = 1000
export const PERFECT_BONUS = 250

export interface Verdict {
  tier: 'emperor' | 'king' | 'rockhopper' | 'chilly' | 'ice'
  title: string
  line: string
}

/** 0..1000 based on relative error; an exact answer earns a bonus on top. */
export function accuracyScore(guess: number, actual: number): number {
  if (guess === actual) return MAX_SCORE + PERFECT_BONUS
  const denom = Math.max(actual, 1)
  const error = Math.abs(guess - actual) / denom
  return Math.max(0, Math.round(MAX_SCORE * (1 - error)))
}

export function accuracyPercent(guess: number, actual: number): number {
  if (guess === actual) return 100
  const denom = Math.max(actual, 1)
  return Math.max(0, Math.round(100 * (1 - Math.abs(guess - actual) / denom)))
}

export function verdict(guess: number, actual: number): Verdict {
  const pct = accuracyPercent(guess, actual)
  if (guess === actual) {
    return { tier: 'emperor', title: 'PERFECT. EMPEROR PENGUIN.', line: 'Nailed it to the GPU. Somebody get this rep a bigger territory.' }
  }
  if (pct >= 90) return { tier: 'emperor', title: 'EMPEROR-LEVEL GUESS', line: 'Within 10%. You have clearly read the pricing deck.' }
  if (pct >= 75) return { tier: 'king', title: 'KING PENGUIN', line: 'Close! You know the VDURA Mixed Fleet math is big.' }
  if (pct >= 50) return { tier: 'rockhopper', title: 'ROCKHOPPER', line: 'Right neighborhood, wrong iceberg.' }
  if (pct >= 25) return { tier: 'chilly', title: 'A LITTLE CHILLY', line: 'The savings are bigger than that. Much bigger.' }
  return {
    tier: 'ice',
    title: guess < actual ? 'ICE COLD (WAY LOW)' : 'ICE COLD (WAY HIGH)',
    line: guess < actual ? "All-flash is expensive in 2026. VDURA's HDD tier is not. Aim higher next time." : 'Bold. Very bold. Dial it back a bit.',
  }
}
