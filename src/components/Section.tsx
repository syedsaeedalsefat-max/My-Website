import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -80, skewX: 12 },
  show: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export default function Section({
  id,
  title,
  index,
  children,
}: {
  id: string
  title: string
  index: string
  children: ReactNode
}) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div variants={slideIn} className="mb-10 flex items-end gap-4">
          <span className="game-title text-5xl text-accent/30 sm:text-7xl">{index}</span>
          <div>
            <h2 className="game-title text-3xl text-fg sm:text-5xl">{title}</h2>
            <div className="mt-2 h-1 w-24 -skew-x-[30deg] bg-gradient-to-r from-accent to-accent2" />
          </div>
        </motion.div>
        {children}
      </motion.div>
    </section>
  )
}
