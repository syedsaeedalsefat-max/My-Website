import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Section, { slideIn } from './Section'
import { extraCurricular } from '../data/portfolioData'

export default function ExtraCurricular() {
  if (!extraCurricular.length) return null

  return (
    <Section id="extra" title="Activities" index="05">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {extraCurricular.map((e) => (
          <motion.div
            key={e.title}
            variants={slideIn}
            whileHover={{ y: -6, scale: 1.02 }}
            className="hud-panel cut p-6"
          >
            <Sparkles className="mb-3 text-accent" size={22} />
            <h3 className="game-title text-xl text-fg">{e.title}</h3>
            <p className="mt-1 text-sm text-muted">{e.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
