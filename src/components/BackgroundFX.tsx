import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useDevice } from '../utils/useDevice'
import CyberCodeBg from './CyberCodeBg'

// Both files are pre-trimmed to begin at the 23s mark of the original brand video, with no audio track.
// Landscape screens get the 16:9 HD file; portrait phones get a lighter 9:16 file cropped for tall screens.
const VIDEO_LANDSCAPE = '/videos/misc-maritime.mp4'
const VIDEO_PORTRAIT = '/videos/misc-maritime-mobile.mp4'
const POSTER_LANDSCAPE = '/videos/poster-desktop.jpg'
const POSTER_PORTRAIT = '/videos/poster-mobile.jpg'

/** Muted, endlessly looping MP4 background for Merchant Navy mode, matched to the screen's aspect ratio. */
function MaritimeVideoBg() {
  const { isPortrait } = useDevice()
  const src = isPortrait ? VIDEO_PORTRAIT : VIDEO_LANDSCAPE
  const poster = isPortrait ? POSTER_PORTRAIT : POSTER_LANDSCAPE
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
    // Safety net: restart if it ever ends
    const onEnded = () => {
      v.currentTime = 0
      tryPlay()
    }
    v.addEventListener('ended', onEnded)
    // Save battery/GPU: pause when the tab is hidden, resume when back
    const onVisible = () => {
      if (document.hidden) v.pause()
      else tryPlay()
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
  }, [src])

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="pointer-events-none h-full w-full transform-gpu object-cover will-change-transform"
        style={{ objectPosition: isPortrait ? '55% center' : 'center' }}
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
