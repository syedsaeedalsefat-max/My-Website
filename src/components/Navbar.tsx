import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { Anchor, Terminal, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { navLinks, skills, achievements, extraCurricular } from '../data/portfolioData'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const nitro = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  const hasContent: Record<string, boolean> = {
    skills: Object.values(skills).some((s) => s.length),
    achievements: achievements.length > 0,
    extra: extraCurricular.length > 0,
  }
  const links = navLinks.filter((l) => hasContent[l.id] !== false)

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md"
    >
      {/* Nitro bar: fills as you scroll */}
      <motion.div
        style={{ scaleX: nitro, boxShadow: '0 0 12px var(--glow)' }}
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-gradient-to-r from-accent to-accent2"
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <a href="#top" className="game-title whitespace-nowrap text-base text-accent sm:text-lg">
          SEFAT
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="cut-sm game-title block px-4 py-1.5 text-sm text-muted transition hover:bg-accent hover:text-bg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="relative flex rounded-sm border border-line bg-surface p-1 text-xs">
            {(['maritime', 'cyber'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="game-title relative z-10 flex items-center gap-1 px-3 py-1"
                style={{ color: theme === t ? 'var(--bg)' : 'var(--muted)' }}
                aria-label={`Switch to ${t} theme`}
              >
                {theme === t && (
                  <motion.span layoutId="pill" className="absolute inset-0 -z-10 bg-accent" />
                )}
                {t === 'maritime' ? <Anchor size={14} /> : <Terminal size={14} />}
                <span>{t === 'maritime' ? 'Navy' : 'Cyber'}</span>
              </button>
            ))}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="game-title block px-5 py-3 text-muted hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
