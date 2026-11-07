import { motion } from 'framer-motion'
import { Medal } from 'lucide-react'
import Section, { slideIn } from './Section'
import { achievements } from '../data/portfolioData'

export default function Achievements() {
  if (!achievements.length) return null

  return (
    <Section id="achievements" title="Achievements" index="02">
      <div className="grid gap-5 sm:grid-cols-2">
        {achievements.map((a) => (
          <motion.div
            key={a.title + a.year}
            variants={slideIn}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="hud-panel cut flex items-center gap-5 p-6"
          >
            <motion.div
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-yellow-200/80 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.45)]"
            >
              <Medal size={32} strokeWidth={2.2} />
            </motion.div>
            <div>
              <div className="game-title text-sm text-accent2">{a.year}</div>
              <h3 className="game-title text-2xl text-fg">{a.title}</h3>
              <p className="text-sm text-muted">{a.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
