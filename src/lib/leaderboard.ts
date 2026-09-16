export interface ScoreEntry {
  id: string
  name: string
  score: number
  guess: number
  actual: number
  gpuCount: number
  gpuName: string
  savings: number
  date: string // ISO 8601
}

export const STORAGE_KEY = 'penguin-sko-gpu-challenge-scores-v1'
const MAX_STORED = 500
const MAX_NAME = 24

export function sanitizeName(raw: string): string {
  // strip control characters and angle brackets, collapse whitespace
  const cleaned = raw
    .split('')
    .filter((ch) => ch.charCodeAt(0) >= 32 && ch !== '<' && ch !== '>')
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME)
  return cleaned || 'Anonymous Penguin'
}

function isEntry(e: unknown): e is ScoreEntry {
  if (!e || typeof e !== 'object') return false
  const s = e as Record<string, unknown>
  const num = (v: unknown) => typeof v === 'number' && Number.isFinite(v)
  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    num(s.score) && num(s.guess) && num(s.actual) && num(s.gpuCount) && num(s.savings) &&
    typeof s.gpuName === 'string' &&
    typeof s.date === 'string'
  )
}

export function readScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter(isEntry).slice(0, MAX_STORED)
  } catch {
    return []
  }
}

function writeScores(scores: ScoreEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, MAX_STORED)))
  } catch {
    /* storage unavailable (private mode, kiosk lockdown): leaderboard is best-effort */
  }
}

export function rankScores(scores: ScoreEntry[]): ScoreEntry[] {
  return [...scores].sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
}

export function addScore(entry: Omit<ScoreEntry, 'id' | 'date'>): ScoreEntry {
  const full: ScoreEntry = {
    ...entry,
    name: sanitizeName(entry.name),
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: new Date().toISOString(),
  }
  // Append, then stable-sort: equal score + identical timestamp keeps first-come order.
  writeScores(rankScores([...readScores(), full]))
  return full
}

export function clearScores() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function rankOf(id: string, scores: ScoreEntry[]): number {
  return rankScores(scores).findIndex((s) => s.id === id) + 1
}

/** Spreadsheet-safe CSV cell: quoted, quotes doubled, formula prefixes neutralised. */
export function csvCell(value: string | number): string {
  const text = String(value)
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${guarded.replaceAll('"', '""')}"`
}

export function scoresToCsv(scores: ScoreEntry[]): string {
  const header = ['Rank', 'Name', 'Score', 'Guess', 'Answer', 'Cluster GPUs', 'GPU', 'Savings USD', 'Date']
  const rows = rankScores(scores).map((s, i) => [
    i + 1, s.name, s.score, s.guess, s.actual, s.gpuCount, s.gpuName, Math.round(s.savings), s.date,
  ])
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n')
}
