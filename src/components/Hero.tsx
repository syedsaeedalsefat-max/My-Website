import { motion, useScroll, useTransform } from 'framer-motion'
import { Anchor, Terminal, Trophy, GraduationCap, Mail, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { profile, identities, achievements } from '../data/portfolioData'
import { slideIn, stagger } from './Section'

export default function Hero() {
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  // parallax: photo drifts slower than the page, backdrop faster
  const photoY = useTransform(scrollY, [0, 600], [0, 90])
  const backdropX = useTransform(scrollY, [0, 600], [0, -80])
  const textY = useTransform(scrollY, [0, 600], [0, -40])

  type Tile = {
    key: string
    label: string
    sub: string
    icon: typeof Anchor
    onClick?: () => void
    href?: string
    active?: boolean
  }

  const tiles: Tile[] = [
    {
      key: 'maritime',
      label: identities.maritime.label,
      sub: identities.maritime.headline,
      icon: Anchor,
      onClick: () => setTheme('maritime'),
      active: theme === 'maritime',
    },
    {
      key: 'cyber',
      label: identities.cyber.label,
      sub: identities.cyber.headline,
      icon: Terminal,
      onClick: () => setTheme('cyber'),
      active: theme === 'cyber',
    },
    ...(achievements.length
      ? [{ key: 'ach', label: 'Achievements', sub: 'Medals & milestones', icon: Trophy, href: '#achievements' }]
      : []),
    { key: 'acad', label: 'Academics', sub: 'SSC · HSC · Diploma', icon: GraduationCap, href: '#academics' },
    { key: 'contact', label: 'Contact', sub: 'Get in touch', icon: Mail, href: '#contact' },
  ]

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-24 sm:px-5 sm:pb-16"
    >
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT: info + menu */}
        <motion.div style={{ y: textY }} variants={stagger} initial="hidden" animate="show" className="order-2 lg:order-1">
          <motion.p variants={slideIn} className="game-title text-sm text-accent">
            ▸ {theme === 'cyber' ? 'Cyber mode engaged' : 'Ready to sail'}
          </motion.p>

          <motion.h1 variants={slideIn} className="game-title mt-2 text-4xl leading-none text-fg sm:text-6xl lg:text-7xl">
            Syed Saeed
            <span className="block bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              Al Sefat
            </span>
          </motion.h1>

          <motion.div variants={slideIn} className="mt-4 flex flex-wrap items-center gap-3">
            <span className="cut-sm badge-shine game-title bg-accent px-5 py-1.5 text-lg font-extrabold text-bg">
              {profile.taglines[theme]}
            </span>
            <img
              src={profile.logos[theme].src}
              alt={profile.logos[theme].alt}
              className="h-9 w-auto object-contain"
            />
          </motion.div>

          {/* Asphalt-style menu tiles */}
          <motion.div variants={stagger} className="mt-8 flex max-w-md flex-col gap-2">
            {tiles.map((t) => {
              const Icon = t.icon
              const Comp = t.href ? motion.a : motion.button
              return (
                <Comp
                  key={t.key}
                  href={t.href}
                  onClick={t.onClick}
                  variants={slideIn}
                  whileHover={{ x: 14, scale: 1.02 }}
                  whileTap={{ scale: 0.96, filter: 'brightness(1.6)' }}
                  className={`hud-panel cut group flex items-center gap-4 px-5 py-3 text-left ${
                    t.active ? 'ring-1 ring-accent' : ''
                  }`}
                >
                  <Icon className="text-accent transition group-hover:scale-125" size={24} />
                  <div className="flex-1">
                    <div className="game-title text-lg leading-tight text-fg">{t.label}</div>
                  </div>
                  {t.active ? (
                    <span className="game-title bg-accent px-2 text-xs text-bg">Active</span>
                  ) : (
                    <ChevronRight className="text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                  )}
                </Comp>
              )
            })}
          </motion.div>
        </motion.div>

        {/* RIGHT: player showcase */}
        <div className="relative order-1 mx-auto w-full max-w-[18rem] sm:max-w-sm lg:order-2 lg:max-w-none">
          <motion.div
            style={{ x: backdropX, background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-[24%] bottom-0 top-10 [clip-path:polygon(12%_0,100%_0,88%_100%,0_100%)]"
          />
          <motion.img
            src={profile.profileImages[theme]}
            alt={profile.name}
            style={{
              y: photoY,
              WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
            }}
            initial={{ opacity: 0, scale: 0.9, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            className="relative mx-auto w-full max-w-md object-contain"
          />
        </div>
      </div>
    </section>
  )
}
