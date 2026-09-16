import type { CSSProperties } from 'react'
import { cn } from '../../lib/utils'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
  hint?: string
  className?: string
}

export function Slider({ label, value, min, max, step, onChange, format = (v) => v.toLocaleString(), hint, className }: SliderProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-end justify-between gap-4">
        <label className="text-sm font-semibold uppercase tracking-wider text-muted">{label}</label>
        <span className="text-3xl md:text-4xl font-black text-yellow tabular leading-none">{format(value)}</span>
      </div>
      <input
        type="range"
        className="pc-range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${pct}%` } as CSSProperties}
      />
      <div className="flex justify-between text-xs font-medium text-muted">
        <span>{format(min)}</span>
        {hint && <span className="text-center">{hint}</span>}
        <span>{format(max)}</span>
      </div>
    </div>
  )
}
