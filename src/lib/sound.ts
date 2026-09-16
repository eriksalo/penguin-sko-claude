// Tiny WebAudio synth for game-show cues. No audio assets and no autoplay:
// the AudioContext is created lazily after a user gesture, only when sound is on.

let ctx: AudioContext | null = null

function context(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.12) {
  const ac = context()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  const t0 = ac.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export const sfx = {
  click: () => tone(880, 0, 0.06, 'square', 0.05),
  tick: () => tone(520, 0, 0.09, 'triangle', 0.1),
  drumroll: (seconds: number) => {
    const rate = 14
    const steps = Math.floor(seconds * rate)
    for (let i = 0; i < steps; i++) tone(140 + (i % 2) * 20, i / rate, 0.05, 'triangle', 0.08)
  },
  reveal: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.35, 'triangle', 0.14))
  },
  fanfare: () => {
    ;[523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.5, 'sawtooth', 0.06))
    ;[784, 1047, 1319].forEach((f, i) => tone(f, 0.55 + i * 0.12, 0.7, 'triangle', 0.12))
  },
  womp: () => {
    tone(300, 0, 0.25, 'sawtooth', 0.08)
    tone(220, 0.22, 0.4, 'sawtooth', 0.08)
  },
}
