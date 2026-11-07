import { motion, AnimatePresence } from 'framer-motion'
import { Anchor, Shield } from 'lucide-react'
import Section, { fadeUp, slideIn } from './Section'
import { useTheme } from '../context/ThemeContext'
import { profile, profileEducation } from '../data/portfolioData'

export default function About() {
  const { theme } = useTheme()
  const Icon = theme === 'cyber' ? Shield : Anchor
  const logo = profile.logos[theme]

  return (
    <Section id="about" title="Profile" index="01">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={theme}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="text-lg leading-relaxed text-muted"
            >
              {profile.bios[theme]}
            </motion.p>
          </AnimatePresence>

          <motion.div variants={fadeUp} className="mt-6 inline-flex items-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={theme}
                src={logo.src}
                alt={logo.alt}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="h-14 w-auto object-contain"
              />
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {profileEducation[theme].map((c) => (
              <motion.div
                key={theme + c.degree}
                variants={slideIn}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                whileHover={{ x: 10 }}
                className="hud-panel cut flex items-start gap-3 p-5"
              >
                <Icon className="mt-1 shrink-0 text-accent" size={22} />
                <div>
                  <h3 className="game-title text-lg text-fg">{c.degree}</h3>
                  <p className="text-sm text-muted">{c.institution}</p>
                  <p className="game-title mt-1 text-accent2">{c.years}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
