import { cn } from '../../lib/utils'
import { Penguin } from './Penguin'

/**
 * Penguin Computing lockup. Drop the official logo at /public/penguin-computing.svg
 * and swap the wordmark below for an <img> if brand wants the real thing.
 */
export function Wordmark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('shrink-0 rounded-2xl bg-yellow p-1.5', size === 'sm' && 'rounded-xl p-1', size === 'lg' && 'rounded-3xl p-2')}>
        <Penguin className={cn(size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-16 w-16' : 'h-10 w-10')} />
      </div>
      <div className="leading-none">
        <div className={cn('font-black uppercase tracking-[0.18em] text-snow', size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl md:text-4xl' : 'text-lg')}>
          Penguin
        </div>
        <div className={cn('font-bold uppercase tracking-[0.32em] text-yellow', size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-base md:text-lg' : 'text-xs')}>
          Computing
        </div>
      </div>
    </div>
  )
}

export function PoweredBy({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs font-medium uppercase tracking-widest text-muted', className)}>
      Storage math powered by <span className="text-snow font-bold">VDURA</span>
    </p>
  )
}
