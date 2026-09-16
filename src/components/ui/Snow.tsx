import { useMemo, type CSSProperties } from 'react'

interface Flake {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
}

export function Snow({ count = 36 }: { count?: number }) {
  const flakes = useMemo<Flake[]>(() => {
    let seed = 20260916
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }
    return Array.from({ length: count }, () => ({
      left: rnd() * 100,
      size: 2 + rnd() * 5,
      duration: 12 + rnd() * 18,
      delay: -rnd() * 30,
      drift: (rnd() - 0.5) * 160,
      opacity: 0.25 + rnd() * 0.55,
    }))
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--drift': `${f.drift}px`,
            } as CSSProperties
          }
        />
      ))}
      <div className="absolute -top-1/3 -right-1/4 h-[70vmax] w-[70vmax] rounded-full bg-yellow/10 blur-[140px]" />
      <div className="absolute -bottom-1/3 -left-1/4 h-[50vmax] w-[50vmax] rounded-full bg-ice/10 blur-[120px]" />
    </div>
  )
}
