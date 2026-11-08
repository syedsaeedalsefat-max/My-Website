import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const MUSIC_ID = 'u6-QluUmbjs'
const VOLUME = 20 // percent

/* eslint-disable @typescript-eslint/no-explicit-any */
function ensureYouTubeAPI(): Promise<any> {
  return new Promise((resolve) => {
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
}

export default function MusicPlayer() {
  const holderRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const readyRef = useRef(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    let cancelled = false

    const applySoundState = (isMuted: boolean) => {
      const p = playerRef.current
      if (!p || !readyRef.current) return
      try {
        p.setVolume(VOLUME)
        if (isMuted) {
          p.mute()
        } else {
          p.unMute()
          p.setVolume(VOLUME)
          p.playVideo()
        }
      } catch {
        /* ignore */
      }
    }

    ensureYouTubeAPI().then((YT) => {
      if (cancelled || !holderRef.current) return
      const target = document.createElement('div')
      holderRef.current.appendChild(target)

      playerRef.current = new YT.Player(target, {
        height: '64',
        width: '64',
        videoId: MUSIC_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: MUSIC_ID,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          rel: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: any) => {
            readyRef.current = true
            try {
              e.target.setVolume(VOLUME)
              e.target.unMute()
              e.target.playVideo()
            } catch {
              /* ignore */
            }
          },
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0, true)
              e.target.playVideo()
            }
          },
        },
      })
    })

    // Unlock audio on first user interaction if browser blocked initial unmuted autoplay
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const unlock = () => {
      applySoundState(false)
      events.forEach((ev) => window.removeEventListener(ev, unlock))
    }
    events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }))

    return () => {
      cancelled = true
      readyRef.current = false
      events.forEach((ev) => window.removeEventListener(ev, unlock))
      try {
        playerRef.current?.destroy()
      } catch {
        /* ignore */
      }
    }
  }, [])

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    const p = playerRef.current
    if (!p || !readyRef.current) return
    try {
      if (nextMuted) {
        p.mute()
      } else {
        p.unMute()
        p.setVolume(VOLUME)
        p.playVideo()
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div
        ref={holderRef}
        aria-hidden
        className="pointer-events-none fixed -bottom-24 -left-24 h-16 w-16 opacity-0"
      />
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
    </>
  )
}
