import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.42, ease: 'easeOut' } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
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
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        <motion.div variants={slideIn} className="mb-7 flex items-end gap-3 sm:mb-10 sm:gap-4">
          <span className="game-title text-4xl text-accent/30 sm:text-7xl">{index}</span>
          <div>
            <h2 className="game-title text-2xl text-fg sm:text-5xl">{title}</h2>
            <div className="mt-1.5 h-1 w-20 -skew-x-[30deg] bg-gradient-to-r from-accent to-accent2 sm:mt-2 sm:w-24" />
          </div>
        </motion.div>
        {children}
      </motion.div>
    </section>
  )
}
