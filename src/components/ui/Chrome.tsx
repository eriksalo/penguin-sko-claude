import { useEffect, useState } from 'react'
import { Home, Maximize, Minimize, Trophy, Volume2, VolumeX } from 'lucide-react'
import { useGame } from '../../context/GameContext'
import { cn } from '../../lib/utils'

function IconButton({ label, onClick, children, active }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border border-penguin-lighter bg-penguin/80 text-muted backdrop-blur transition-colors hover:border-yellow hover:text-yellow cursor-pointer',
        active && 'text-yellow',
      )}
    >
      {children}
    </button>
  )
}

/** Persistent kiosk controls: home, leaderboard, sound, fullscreen. */
export function Chrome() {
  const { state, dispatch, play } = useGame()
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      /* not permitted (iframe / iOS) */
    }
  }

  return (
    <div className="fixed right-4 top-4 z-40 flex gap-2">
      {state.step !== 'welcome' && (
        <IconButton label="Start over" onClick={() => { play('click'); dispatch({ type: 'RESET' }) }}>
          <Home className="h-5 w-5" />
        </IconButton>
      )}
      {state.step !== 'leaderboard' && (
        <IconButton label="Leaderboard" onClick={() => { play('click'); dispatch({ type: 'OPEN_LEADERBOARD' }) }}>
          <Trophy className="h-5 w-5" />
        </IconButton>
      )}
      <IconButton label={state.soundOn ? 'Mute sound' : 'Unmute sound'} active={state.soundOn} onClick={() => { dispatch({ type: 'TOGGLE_SOUND' }); if (!state.soundOn) play('click') }}>
        {state.soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </IconButton>
      <IconButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen (kiosk)'} onClick={toggleFullscreen}>
        {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </IconButton>
    </div>
  )
}
