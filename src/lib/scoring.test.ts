import { describe, expect, it } from 'vitest'
import { accuracyScore, verdict } from './scoring'

describe('scoring', () => {
  it('perfect guess gets max plus bonus', () => expect(accuracyScore(480, 480)).toBe(1250))
  it('scales linearly with relative error', () => {
    expect(accuracyScore(432, 480)).toBe(900)
    expect(accuracyScore(240, 480)).toBe(500)
    expect(accuracyScore(0, 480)).toBe(0)
  })
  it('never goes negative for wild overshoots', () => expect(accuracyScore(5000, 480)).toBe(0))
  it('tiers', () => {
    expect(verdict(480, 480).tier).toBe('emperor')
    expect(verdict(450, 480).tier).toBe('emperor')
    expect(verdict(400, 480).tier).toBe('king')
    expect(verdict(300, 480).tier).toBe('rockhopper')
    expect(verdict(150, 480).tier).toBe('chilly')
    expect(verdict(10, 480).tier).toBe('ice')
    expect(verdict(5000, 480).title).toContain('HIGH')
  })
})
