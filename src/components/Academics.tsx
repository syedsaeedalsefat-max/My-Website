import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Globe, ExternalLink, X } from 'lucide-react'
import Section, { slideIn } from './Section'
import { academics } from '../data/portfolioData'

export default function Academics() {
  const [openDegrees, setOpenDegrees] = useState<Record<string, boolean>>({})

  if (!academics.length) return null

  const toggleBox = (degree: string) => {
    setOpenDegrees((prev) => ({ ...prev, [degree]: !prev[degree] }))
  }

  return (
    <Section id="academics" title="Academics" index="03">
      <div className="grid items-start gap-5 md:grid-cols-2">
        {academics.map((a) => {
          const isOpen = !!openDegrees[a.degree]
          return (
            <div key={a.degree} className="flex flex-col">
              <motion.button
                type="button"
                onClick={() => toggleBox(a.degree)}
                variants={slideIn}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`hud-panel cut w-full cursor-pointer p-6 text-left transition ${
                  isOpen ? 'ring-1 ring-accent' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className="text-accent" size={26} />
                  <span className="game-title text-lg text-accent2">{a.years}</span>
                </div>
                <h3 className="game-title mt-3 text-2xl text-fg">{a.degree}</h3>
                <p className="text-sm text-muted">{a.institution}</p>
                {a.result && (
                  <span className="cut-sm game-title mt-4 inline-block bg-accent px-4 py-1 text-bg">
                    {a.result}
                  </span>
                )}
              </motion.button>

              {/* Pop-out small screen under the box */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden pt-2.5"
                  >
                    <div
                      className="hud-panel cut overflow-hidden border border-line bg-surface/95"
                      style={{ boxShadow: '0 8px 28px -8px var(--glow)' }}
                    >
                      {/* Mini screen header bar */}
                      <div className="flex items-center justify-between border-b border-line bg-black/50 px-3.5 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Globe size={14} className="shrink-0 text-accent" />
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate font-mono text-xs text-accent hover:underline"
                          >
                            {a.displayUrl}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cut-sm game-title flex items-center gap-1 bg-accent px-2.5 py-0.5 text-xs text-bg hover:brightness-110"
                          >
                            Visit <ExternalLink size={11} />
                          </a>
                          <button
                            type="button"
                            onClick={() => toggleBox(a.degree)}
                            aria-label="Close preview"
                            className="p-1 text-muted hover:text-fg"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Scrollable full-page website preview screen */}
                      <div className="relative h-48 w-full overflow-y-auto overscroll-contain bg-black sm:h-56">
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block w-full"
                          title={`Open ${a.displayUrl}`}
                        >
                          <img
                            src={a.previewImage}
                            alt={`${a.institution} website preview`}
                            loading="lazy"
                            className="w-full object-top"
                          />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
