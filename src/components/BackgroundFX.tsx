import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useDevice } from '../utils/useDevice'
import CyberCodeBg from './CyberCodeBg'

const MARITIME_VIDEO_SRC = '/videos/misc-maritime.mp4'

/**
 * Native, fast-loading, muted HTML5 video background for Merchant Navy mode
 * with vivid color-grading & clarity enhancement.
 */
function MaritimeVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isMobile } = useDevice()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    v.volume = 0

    const tryPlay = () => {
      v.muted = true
      v.play().catch(() => {
        /* autoplay will unlock on first touch if restricted */
      })
    }
    tryPlay()

    window.addEventListener('touchstart', tryPlay, { once: true, passive: true })
    window.addEventListener('pointerdown', tryPlay, { once: true, passive: true })
    return () => {
      window.removeEventListener('touchstart', tryPlay)
      window.removeEventListener('pointerdown', tryPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {/* Subtle SVG clarity/sharpening kernel for desktop */}
      {!isMobile && (
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
          <defs>
            <filter id="vivid-clarity">
              <feConvolveMatrix
                order="3"
                kernelMatrix="0 -0.18 0 -0.18 1.72 -0.18 0 -0.18 0"
                preserveAlpha="true"
              />
            </filter>
          </defs>
        </svg>
      )}
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
        style={{
          filter: isMobile
            ? 'contrast(1.14) saturate(1.26) brightness(1.05)'
            : 'url(#vivid-clarity) contrast(1.15) saturate(1.28) brightness(1.06)',
        }}
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
