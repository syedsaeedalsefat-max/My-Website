import { motion } from 'framer-motion'
import Section, { slideIn } from './Section'
import { skills } from '../data/portfolioData'

const groups = [
  { key: 'maritime', label: 'Maritime Skills' },
  { key: 'cyber', label: 'Cyber & Tech Skills' },
  { key: 'soft', label: 'Soft Skills' },
] as const

export default function Skills() {
  const visible = groups.filter((g) => skills[g.key].length)
  if (!visible.length) return null

  return (
    <Section id="skills" title="Skills" index="02">
      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((g) => (
          <motion.div key={g.key} variants={slideIn} className="hud-panel cut p-6">
            <h3 className="game-title mb-4 text-xl text-accent">{g.label}</h3>
            <div className="flex flex-wrap gap-2">
              {skills[g.key].map((s) => (
                <motion.span
                  key={s}
                  whileHover={{ scale: 1.1 }}
                  className="cut-sm game-title bg-accent/15 px-3 py-1 text-sm text-fg"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
