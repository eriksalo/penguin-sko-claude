import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export type Mood = 'idle' | 'happy' | 'shocked' | 'cool' | 'thinking' | 'sad'

interface PenguinProps {
  mood?: Mood
  className?: string
  /** waves the right wing on a loop */
  wave?: boolean
}

/**
 * Original Penguin Computing-flavoured mascot. Black body, snow belly,
 * Penguin Yellow beak, feet and scarf. Mood swaps eyes, beak and wings.
 */
export function Penguin({ mood = 'idle', className, wave = false }: PenguinProps) {
  const eyeScale = mood === 'shocked' ? 1.35 : mood === 'happy' ? 1.05 : 1
  const pupilY = mood === 'thinking' ? -3 : mood === 'sad' ? 2 : 0
  const pupilX = mood === 'thinking' ? 3 : 0

  return (
    <svg viewBox="0 0 200 250" className={cn('select-none', className)} aria-hidden="true">
      {/* feet */}
      <ellipse cx="72" cy="238" rx="26" ry="9" fill="#ffcd30" />
      <ellipse cx="128" cy="238" rx="26" ry="9" fill="#ffcd30" />
      <path d="M52 238h40M108 238h40" stroke="#e0b11c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* body */}
      <ellipse cx="100" cy="150" rx="74" ry="88" fill="#1a1f22" />
      <ellipse cx="100" cy="162" rx="50" ry="68" fill="#f5f6f8" />

      {/* left wing */}
      <motion.path
        d="M32 128c-16 22-16 56-2 78 10-16 16-42 18-72z"
        fill="#1a1f22"
        style={{ originX: '34px', originY: '128px' }}
        animate={mood === 'shocked' ? { rotate: [-20, -25, -20] } : mood === 'sad' ? { rotate: 8 } : { rotate: 0 }}
        transition={{ duration: 0.6, repeat: mood === 'shocked' ? Infinity : 0 }}
      />
      {/* right wing */}
      <motion.path
        d="M168 128c16 22 16 56 2 78-10-16-16-42-18-72z"
        fill="#1a1f22"
        style={{ originX: '166px', originY: '128px' }}
        animate={
          wave || mood === 'happy' || mood === 'thinking'
            ? { rotate: mood === 'thinking' ? -110 : [0, -70, -40, -70, 0] }
            : mood === 'shocked'
              ? { rotate: [20, 25, 20] }
              : { rotate: 0 }
        }
        transition={
          mood === 'thinking'
            ? { duration: 0.5 }
            : { duration: 1.6, repeat: wave || mood === 'happy' || mood === 'shocked' ? Infinity : 0, repeatDelay: wave ? 1.8 : 0.4 }
        }
      />

      {/* head */}
      <circle cx="100" cy="72" r="56" fill="#1a1f22" />
      <path d="M62 84c8-22 24-34 38-34s30 12 38 34c-6 20-20 32-38 32S68 104 62 84z" fill="#f5f6f8" />

      {/* scarf */}
      <path d="M52 116c14 10 30 15 48 15s34-5 48-15c-2 12-10 22-20 26H72c-10-4-18-14-20-26z" fill="#ffcd30" />
      <path d="M128 136l14 40c2 6-2 10-8 8l-16-8z" fill="#e0b11c" />
      <path d="M126 136l10 28" stroke="#ffcd30" strokeWidth="6" strokeLinecap="round" />

      {/* eyes */}
      <g transform={`translate(80 74) scale(${eyeScale})`}>
        <circle r="11" fill="#f5f6f8" stroke="#1a1f22" strokeWidth="2" />
        <motion.circle
          r="5"
          fill="#1a1f22"
          initial={{ cx: 0, cy: 0 }}
          animate={{ cx: pupilX, cy: pupilY, scaleY: mood === 'happy' ? [1, 0.1, 1] : 1 }}
          transition={{ duration: 0.4, repeat: mood === 'happy' ? Infinity : 0, repeatDelay: 2.4 }}
        />
      </g>
      <g transform={`translate(120 74) scale(${eyeScale})`}>
        <circle r="11" fill="#f5f6f8" stroke="#1a1f22" strokeWidth="2" />
        <motion.circle
          r="5"
          fill="#1a1f22"
          initial={{ cx: 0, cy: 0 }}
          animate={{ cx: pupilX, cy: pupilY, scaleY: mood === 'happy' ? [1, 0.1, 1] : 1 }}
          transition={{ duration: 0.4, repeat: mood === 'happy' ? Infinity : 0, repeatDelay: 2.4 }}
        />
      </g>

      {/* sunglasses */}
      {mood === 'cool' && (
        <g>
          <rect x="62" y="62" width="34" height="22" rx="8" fill="#0d1113" />
          <rect x="104" y="62" width="34" height="22" rx="8" fill="#0d1113" />
          <path d="M96 70h8M44 68l18-2M156 68l-18-2" stroke="#0d1113" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 68c6-3 14-3 20 0" stroke="#ffcd30" strokeWidth="2" opacity="0.6" />
          <path d="M110 68c6-3 14-3 20 0" stroke="#ffcd30" strokeWidth="2" opacity="0.6" />
        </g>
      )}

      {/* eyebrows for sad / thinking */}
      {mood === 'sad' && <path d="M68 58l22 6M132 58l-22 6" stroke="#1a1f22" strokeWidth="4" strokeLinecap="round" />}
      {mood === 'thinking' && <path d="M66 60l24 2M110 56l24-4" stroke="#1a1f22" strokeWidth="4" strokeLinecap="round" />}

      {/* beak */}
      {mood === 'shocked' ? (
        <ellipse cx="100" cy="98" rx="10" ry="12" fill="#ffcd30" stroke="#e0b11c" strokeWidth="2" />
      ) : mood === 'happy' || mood === 'cool' ? (
        <g>
          <path d="M84 92l16 14 16-14z" fill="#ffcd30" />
          <path d="M84 92h32" stroke="#e0b11c" strokeWidth="2" />
        </g>
      ) : mood === 'sad' ? (
        <path d="M86 100l14-8 14 8z" fill="#ffcd30" />
      ) : (
        <path d="M86 92l14 12 14-12z" fill="#ffcd30" />
      )}

      {/* blush */}
      {(mood === 'happy' || mood === 'cool') && (
        <g opacity="0.55">
          <ellipse cx="70" cy="96" rx="7" ry="4" fill="#ff8f8f" />
          <ellipse cx="130" cy="96" rx="7" ry="4" fill="#ff8f8f" />
        </g>
      )}
    </svg>
  )
}
