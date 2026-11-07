import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import CyberCodeBg from './CyberCodeBg'

// Pre-trimmed so it already begins at the 23s mark of the original brand video, muted (no audio track).
const MARITIME_VIDEO_SRC = '/videos/misc-maritime.mp4'

/** Muted, endlessly looping MP4 background for Merchant Navy mode (native loop, no seeking needed). */
function MaritimeVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    v.volume = 0

    const tryPlay = () => {
      v.muted = true
      if (v.paused) v.play().catch(() => {})
    }
    tryPlay()
    v.addEventListener('canplay', tryPlay)
    // Safety net: restart if it ever ends or stalls on pause
    const onEnded = () => {
      v.currentTime = 0
      tryPlay()
    }
    v.addEventListener('ended', onEnded)
    const onVisible = () => {
      if (!document.hidden) tryPlay()
    }
    document.addEventListener('visibilitychange', onVisible)

    window.addEventListener('touchstart', tryPlay, { once: true, passive: true })
    window.addEventListener('pointerdown', tryPlay, { once: true, passive: true })
    return () => {
      v.removeEventListener('canplay', tryPlay)
      v.removeEventListener('ended', onEnded)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('touchstart', tryPlay)
      window.removeEventListener('pointerdown', tryPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <video
        ref={videoRef}
        src={MARITIME_VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        className="pointer-events-none h-full w-full object-cover"
      />
    </div>
  )
}

export default function BackgroundFX() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {theme === 'cyber' ? <CyberCodeBg /> : <MaritimeVideoBg />}
        </motion.div>
      </AnimatePresence>
      {/* Balanced cinema vignette keeps text readable while letting vivid video colors shine */}
      <div
        className="absolute inset-0"
        style={{
          background:
            theme === 'cyber'
              ? 'rgba(4, 6, 14, 0.32)'
              : 'linear-gradient(180deg, rgba(3, 12, 31, 0.44) 0%, rgba(3, 12, 31, 0.28) 50%, rgba(3, 12, 31, 0.48) 100%)',
        }}
      />
    </div>
  )
}
