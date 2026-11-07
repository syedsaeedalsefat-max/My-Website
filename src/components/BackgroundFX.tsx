import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme, type Theme } from '../context/ThemeContext'
import CyberCodeBg from './CyberCodeBg'

// Background video for each mode. `start` = second to start/restart from.
const VIDEOS: Record<Theme, { id: string; start: number }> = {
  maritime: { id: 'v9tenUbid98', start: 22 },
  cyber: { id: 'RR2EI8EEOOw', start: 0 },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
let apiPromise: Promise<any> | null = null
function loadYouTubeAPI(): Promise<any> {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    const w = window as any
    if (w.YT?.Player) return resolve(w.YT)
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(w.YT)
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}

/** Force YouTube captions off (also clears any caption preference saved in the browser). */
function killCaptions(p: any) {
  try {
    p.setOption('captions', 'track', {})
    p.unloadModule('captions')
    p.unloadModule('cc')
  } catch {
    /* ignore */
  }
}

/** Muted, caption-free, endlessly looping YouTube background (loops back to `start`). */
function VideoBg({ id, start }: { id: string; start: number }) {
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let player: any
    let cancelled = false

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !holder.current) return
      const target = document.createElement('div')
      holder.current.appendChild(target)

      player = new YT.Player(target, {
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          start,
          loop: 1,
          playlist: id,
          cc_load_policy: 0, // captions off
          cc_lang_pref: 'xx',
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          disablekb: 1,
          fs: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute()
            killCaptions(e.target)
            e.target.seekTo(start, true)
            e.target.playVideo()
          },
          onStateChange: (e: any) => {
            killCaptions(e.target)
            // ended -> jump back to start and keep playing forever
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(start, true)
              e.target.playVideo()
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      try {
        player?.destroy()
      } catch {
        /* ignore */
      }
    }
  }, [id, start])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* scaled up from the top inside overflow-hidden so any text burned into the bottom of the video is cropped off-screen */}
      {/* oversized 16:9 box so the video always covers the screen (desktop & mobile) */}
      <div
        ref={holder}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full origin-top -translate-x-1/2 -translate-y-1/2 scale-[1.25] [&_iframe]:h-full [&_iframe]:w-full"
      />
    </div>
  )
}

export default function BackgroundFX() {
  const { theme } = useTheme()
  const v = VIDEOS[theme]

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg" aria-hidden>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {theme === 'cyber' ? <CyberCodeBg /> : <VideoBg id={v.id} start={v.start} />}
        </motion.div>
      </AnimatePresence>
      {/* dark overlay keeps text readable */}
      <div
        className="absolute inset-0"
        style={{ background: theme === 'cyber' ? 'rgba(4,6,14,0.32)' : 'rgba(3,12,31,0.6)' }}
      />
    </div>
  )
}
