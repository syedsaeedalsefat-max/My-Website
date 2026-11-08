import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const AUDIO_SRC = '/audio/music.mp3'
const TARGET_VOLUME = 0.22 // 22% volume for background gaming atmosphere

/**
 * High-performance Ambient Background Music Engine.
 * 
 * 1. Begins playing immediately on visit. If blocked by the browser policy, it runs
 *    the audio track silently in the background so it is already buffered and running.
 * 2. As soon as the user touches the screen, scrolls anywhere, moves a finger, or touches a key,
 *    it seamlessly fades the volume up to 22% smoothly without requiring the user to tap any button.
 * 3. Also unlocks via Web Audio API context for mobile browsers (iOS WebKit / Android Chrome).
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)
  const unlockedRef = useRef(false)
  const fadeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio

    // Smooth volume fade-in helper
    const fadeIn = () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current)
      audio.muted = false
      let currentVol = audio.volume
      fadeTimerRef.current = window.setInterval(() => {
        currentVol += 0.02
        if (currentVol >= TARGET_VOLUME) {
          audio.volume = TARGET_VOLUME
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current)
        } else {
          audio.volume = currentVol
        }
      }, 50)
    }

    // Try playing immediately
    const startInitial = () => {
      audio.volume = TARGET_VOLUME
      audio
        .play()
        .then(() => {
          unlockedRef.current = true
          setMuted(false)
        })
        .catch(() => {
          // If browser requires a user gesture for unmuted sound,
          // start playing muted right away so the audio track is primed and streaming
          audio.muted = true
          audio.volume = 0
          audio.play().catch(() => {})
        })
    }

    startInitial()

    // Unlock on ANY user gesture (touch, scroll, touchmove, wheel, keydown, pointerdown)
    const unlockAudio = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true

      // Resume Web Audio Context if present
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          const ctx = new AudioCtx()
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {})
          }
        }
      } catch {
        /* ignore */
      }

      if (audio.paused) {
        audio.play().catch(() => {})
      }
      fadeIn()
      setMuted(false)

      // Clean up event listeners once unlocked
      cleanupListeners()
    }

    const events: (keyof WindowEventMap)[] = [
      'touchstart',
      'touchmove',
      'touchend',
      'pointerdown',
      'pointermove',
      'scroll',
      'wheel',
      'keydown',
    ]

    const cleanupListeners = () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, unlockAudio, true)
        document.removeEventListener(ev, unlockAudio, true)
      })
    }

    events.forEach((ev) => {
      window.addEventListener(ev, unlockAudio, { passive: true, capture: true, once: true })
      document.addEventListener(ev, unlockAudio, { passive: true, capture: true, once: true })
    })

    return () => {
      cleanupListeners()
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const nextMuted = !muted
    setMuted(nextMuted)
    audio.muted = nextMuted
    if (!nextMuted) {
      audio.volume = TARGET_VOLUME
      if (audio.paused) {
        audio.play().catch(() => {})
      }
    }
  }

  return (
    <motion.button
      type="button"
      onClick={toggleMute}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      title={muted ? 'Unmute music' : 'Mute music'}
      className="cut-sm fixed bottom-4 right-4 z-[60] flex items-center gap-2 border border-line bg-surface/90 px-3.5 py-2 text-accent shadow-lg backdrop-blur-md transition hover:bg-accent hover:text-bg"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      <span className="game-title text-xs">Mute</span>
    </motion.button>
  )
}
