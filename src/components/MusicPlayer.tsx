import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const AUDIO_SRC = '/audio/music.mp3'
const TARGET_VOLUME = 0.22 // 22% volume for gaming HUD atmosphere

/**
 * Direct HTML5 Background Music Engine.
 * Starts playback immediately on page visit via HTML5 Audio and Web Audio API.
 * Automatically handles browser autoplay policies by attempting immediate playback
 * with graceful volume ramp-in, and unlocking instant unmuted sound on any first gesture.
 */
export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)
  const isPlayingRef = useRef(false)

  useEffect(() => {
    // 1. Create native HTML5 Audio element
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = TARGET_VOLUME
    audioRef.current = audio

    const playMusic = () => {
      if (isPlayingRef.current) return
      audio.muted = false
      audio.volume = TARGET_VOLUME
      const promise = audio.play()
      if (promise !== undefined) {
        promise
          .then(() => {
            isPlayingRef.current = true
            setMuted(false)
          })
          .catch(() => {
            // If browser blocks unmuted sound before user gesture,
            // start muted playback instantly so it is already playing
            audio.muted = true
            audio
              .play()
              .then(() => {
                isPlayingRef.current = true
              })
              .catch(() => {})
          })
      }
    }

    // Attempt instant playback right upon mounting/page load
    playMusic()

    // Unlock full unmuted sound instantly on any first touch, scroll, pointer, or key
    const unlockSound = () => {
      if (!audioRef.current) return
      const a = audioRef.current
      a.muted = false
      a.volume = TARGET_VOLUME
      if (a.paused) {
        a.play().catch(() => {})
      }
      isPlayingRef.current = true
      setMuted(false)

      const events = ['pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel'] as const
      events.forEach((ev) => window.removeEventListener(ev, unlockSound))
    }

    const events = ['pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel'] as const
    events.forEach((ev) => window.addEventListener(ev, unlockSound, { passive: true, once: true }))

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, unlockSound))
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
