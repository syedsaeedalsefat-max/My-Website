import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import Section, { slideIn } from './Section'
import { gallery as allPhotos } from '../data/portfolioData'
import { useTheme } from '../context/ThemeContext'
import { useDevice } from '../utils/useDevice'

const SLIDE_INTERVAL_MS = 4500

export default function Gallery() {
  const { theme } = useTheme()
  const { isMobile } = useDevice()
  // Merchant Navy photos are hidden in Cyber Security mode
  const gallery = allPhotos.filter((g) => !(theme === 'cyber' && g.maritimeOnly))
  const [slideIdx, setSlideIdx] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  // changes on every open/navigate so the "impact" animation replays
  const [hit, setHit] = useState(0)

  // Reset slide index and close viewer when switching modes
  useEffect(() => {
    setSlideIdx(0)
    setActive(null)
  }, [theme])

  // Auto-advance the single showcase photo every 4.5 seconds while lightbox is closed
  useEffect(() => {
    if (active !== null || gallery.length <= 1) return
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % gallery.length)
    }, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [active, gallery.length])

  const go = (i: number) => {
    setActive((i + gallery.length) % gallery.length)
    setHit((h) => h + 1)
  }

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') go(active + 1)
      if (e.key === 'ArrowLeft') go(active - 1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!gallery.length) return null
  const safeSlideIdx = slideIdx % gallery.length
  const showcase = gallery[safeSlideIdx]
  const current = active !== null ? gallery[active] : null

  return (
    <Section id="gallery" title="Gallery" index="04">
      {/* Single dynamic gaming showcase that resizes smoothly to each photo's aspect ratio */}
      <motion.div variants={slideIn} className="mx-auto flex flex-col items-center">
        <motion.button
          layout
          type="button"
          onClick={() => go(safeSlideIdx)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="hud-panel cut group relative inline-block max-w-full cursor-pointer overflow-hidden bg-black text-left"
          style={{ boxShadow: '0 0 32px -10px var(--glow)' }}
        >
          {/* Top 4.5s countdown bar */}
          <motion.div
            key={`bar-${safeSlideIdx}-${active === null}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: active === null ? 1 : 0 }}
            transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
            className="absolute inset-x-0 top-0 z-20 h-1 origin-left bg-gradient-to-r from-accent to-accent2"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={showcase.src}
              layout={!isMobile}
              initial={
                isMobile
                  ? { opacity: 0, x: 28 }
                  : { opacity: 0, x: 70, skewX: -6, filter: 'brightness(1.6)' }
              }
              animate={
                isMobile
                  ? { opacity: 1, x: 0 }
                  : { opacity: 1, x: 0, skewX: 0, filter: 'brightness(1)' }
              }
              exit={isMobile ? { opacity: 0, x: -28 } : { opacity: 0, x: -70, skewX: 6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <img
                src={showcase.src}
                alt={showcase.title}
                className="block max-h-[54vh] w-auto max-w-full object-contain transition duration-500 group-hover:scale-[1.02] sm:max-h-[68vh]"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 pt-12 sm:p-6 sm:pt-16">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="game-title text-xs text-accent2">
                      0{safeSlideIdx + 1} / 0{gallery.length} · Click to view all photos
                    </div>
                    <h3 className="game-title mt-1 text-xl text-white sm:text-3xl">
                      {showcase.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-xs text-white/80 sm:text-sm">
                      {showcase.caption}
                    </p>
                  </div>
                  <span className="cut-sm game-title flex shrink-0 items-center gap-1.5 bg-accent px-3.5 py-1.5 text-xs text-bg transition group-hover:brightness-110 sm:text-sm">
                    <Expand size={15} /> View All
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Slanted HUD indicator bars */}
        <div className="mt-4 flex justify-center gap-2">
          {gallery.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setSlideIdx(i)}
              aria-label={`Show ${g.title}`}
              className={`h-2 -skew-x-[25deg] transition-all ${
                i === safeSlideIdx ? 'w-10 bg-accent' : 'w-4 bg-muted/35 hover:bg-muted/70'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {current && active !== null && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6"
            >
              {/* impact flash */}
              <motion.div
                key={`flash-${hit}`}
                initial={{ opacity: 0.75 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.38 }}
                className="pointer-events-none absolute inset-0 bg-accent"
              />

              {/* the bump: overshoot-in + shake, like a game UI hit, resizing to photo ratio */}
              <motion.div
                layout
                key={`card-${hit}`}
                initial={{ scale: 0.4, rotate: -6, opacity: 0 }}
                animate={{
                  scale: [0.4, 1.1, 0.97, 1.02, 1],
                  rotate: [-6, 2, -1, 0.5, 0],
                  x: [0, -10, 8, -4, 0],
                  opacity: 1,
                }}
                exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="hud-panel cut relative inline-flex max-h-[92vh] max-w-4xl flex-col overflow-hidden bg-surface"
                style={{ boxShadow: '0 0 40px var(--glow)' }}
              >
                <div className="flex items-center justify-center bg-black">
                  <img
                    src={current.src}
                    alt={current.title}
                    className="block max-h-[60vh] w-auto max-w-full object-contain"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="game-title text-xl text-fg sm:text-3xl">{current.title}</h3>
                    <span className="game-title text-sm text-accent2">
                      0{active + 1} / 0{gallery.length}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{current.caption}</p>

                  {/* Remaining photos thumbnail strip inside the modal */}
                  <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
                    {gallery.map((item, idx) => (
                      <motion.button
                        key={item.src}
                        type="button"
                        onClick={() => go(idx)}
                        whileHover={{ y: -3, scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        className={`cut-sm relative h-14 w-24 shrink-0 overflow-hidden border-2 bg-black transition sm:h-16 sm:w-28 ${
                          idx === active
                            ? 'border-accent ring-1 ring-accent'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item.src}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 bg-black/60 p-2 text-white hover:bg-accent hover:text-bg"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={() => go(active - 1)}
                  aria-label="Previous"
                  className="absolute left-2 top-[28%] bg-black/60 p-2 text-white hover:bg-accent hover:text-bg"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => go(active + 1)}
                  aria-label="Next"
                  className="absolute right-2 top-[28%] bg-black/60 p-2 text-white hover:bg-accent hover:text-bg"
                >
                  <ChevronRight size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Section>
  )
}
