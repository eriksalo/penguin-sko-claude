import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useGame } from '../../context/GameContext'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'ghost' | 'dark' | 'ice'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  silent?: boolean
}

export function Button({ variant = 'primary', size = 'lg', className, children, silent, onClick, ...props }: ButtonProps) {
  const { play } = useGame()
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        if (!silent) play('click')
        onClick?.(e)
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold uppercase tracking-wider cursor-pointer select-none transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
        size === 'sm' && 'px-4 py-2 text-xs',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        size === 'xl' && 'px-12 py-6 text-xl md:text-2xl',
        variant === 'primary' && 'bg-gradient-to-b from-yellow-light to-yellow text-penguin shadow-glow hover:shadow-glow-lg',
        variant === 'ghost' && 'border-2 border-yellow text-yellow bg-transparent hover:bg-yellow/10',
        variant === 'dark' && 'bg-penguin-light text-snow border border-penguin-lighter hover:bg-penguin-lighter',
        variant === 'ice' && 'bg-ice text-penguin hover:bg-ice-dark',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
