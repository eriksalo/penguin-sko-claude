import { beforeEach, describe, expect, it } from 'vitest'
import { addScore, clearScores, csvCell, rankScores, readScores, sanitizeName, scoresToCsv, STORAGE_KEY } from './leaderboard'

class MemoryStorage {
  private m = new Map<string, string>()
  getItem(k: string) { return this.m.get(k) ?? null }
  setItem(k: string, v: string) { this.m.set(k, v) }
  removeItem(k: string) { this.m.delete(k) }
}

beforeEach(() => {
  ;(globalThis as unknown as { localStorage: MemoryStorage }).localStorage = new MemoryStorage()
})

const base = { guess: 400, actual: 480, gpuCount: 1024, gpuName: 'B200', savings: 21_000_000 }

describe('leaderboard', () => {
  it('stores and ranks by score, then earliest date', () => {
    addScore({ ...base, name: 'A', score: 500 })
    addScore({ ...base, name: 'B', score: 900 })
    addScore({ ...base, name: 'C', score: 500 })
    expect(rankScores(readScores()).map((s) => s.name)).toEqual(['B', 'A', 'C'])
  })
  it('ignores corrupt storage', () => {
    localStorage.setItem(STORAGE_KEY, '{"nope":1}')
    expect(readScores()).toEqual([])
    localStorage.setItem(STORAGE_KEY, '[{"id":"x"}, 5, null]')
    expect(readScores()).toEqual([])
  })
  it('sanitizes names', () => {
    expect(sanitizeName('  <b>Bob   Smith</b> ')).toBe('bBob Smith/b')
    expect(sanitizeName('')).toBe('Anonymous Penguin')
    expect(sanitizeName('x'.repeat(50))).toHaveLength(24)
  })
  it('neutralises spreadsheet formulas in CSV', () => {
    expect(csvCell('=HYPERLINK("x")')).toBe('"\'=HYPERLINK(""x"")"')
    addScore({ ...base, name: '+cmd', score: 1 })
    expect(scoresToCsv(readScores())).toContain('"\'+cmd"')
  })
  it('clears', () => {
    addScore({ ...base, name: 'A', score: 1 })
    clearScores()
    expect(readScores()).toEqual([])
  })
})
