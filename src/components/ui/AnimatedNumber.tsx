import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  from?: number
  format?: (n: number) => string
  className?: string
  onDone?: () => void
}

export function AnimatedNumber({ value, duration = 1600, delay = 0, from, format = (n) => Math.round(n).toLocaleString(), className, onDone }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(from ?? value)
  const prev = useRef(from ?? value)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const start = prev.current
    const end = value
    let raf = 0
    let startTime = 0
    const timer = window.setTimeout(() => {
      startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        setDisplay(start + (end - start) * eased)
        if (progress < 1) raf = requestAnimationFrame(tick)
        else {
          prev.current = end
          doneRef.current?.()
        }
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [value, duration, delay])

  return <span className={cn('tabular', className)}>{format(display)}</span>
}
