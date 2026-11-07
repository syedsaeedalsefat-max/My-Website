import { motion, useScroll, useTransform } from 'framer-motion'
import { Anchor, Terminal, Trophy, GraduationCap, Mail, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { profile, identities, achievements } from '../data/portfolioData'
import { slideIn, stagger } from './Section'
import { useDevice } from '../utils/useDevice'

export default function Hero() {
  const { theme, setTheme } = useTheme()
  const { isMobile } = useDevice()
  const { scrollY } = useScroll()
  // Desktop parallax only; on mobile we keep transforms static for 60fps touch scrolling
  const photoY = useTransform(scrollY, [0, 600], [0, isMobile ? 0 : 90])
  const backdropX = useTransform(scrollY, [0, 600], [0, isMobile ? 0 : -80])
  const textY = useTransform(scrollY, [0, 600], [0, isMobile ? 0 : -40])

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
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-10 pt-20 sm:px-5 sm:pb-16 sm:pt-24"
    >
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 sm:gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT: info + menu */}
        <motion.div
          style={isMobile ? undefined : { y: textY }}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="order-2 text-center sm:text-left lg:order-1"
        >
          <motion.p variants={slideIn} className="game-title text-xs text-accent sm:text-sm">
            ▸ {theme === 'cyber' ? 'Cyber mode engaged' : 'Ready to sail'}
          </motion.p>

          <motion.h1
            variants={slideIn}
            className="game-title mt-1.5 text-4xl leading-none text-fg sm:mt-2 sm:text-6xl lg:text-7xl"
          >
            Syed Saeed
            <span className="block bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              Al Sefat
            </span>
          </motion.h1>

          <motion.div
            variants={slideIn}
            className="mt-3.5 flex flex-wrap items-center justify-center gap-3 sm:mt-4 sm:justify-start"
          >
            <span className="cut-sm badge-shine game-title bg-accent px-4 py-1 text-base font-extrabold text-bg sm:px-5 sm:py-1.5 sm:text-lg">
              {profile.taglines[theme]}
            </span>
            <img
              src={profile.logos[theme].src}
              alt={profile.logos[theme].alt}
              className="h-8 w-auto object-contain sm:h-9"
            />
          </motion.div>

          {/* Asphalt-style menu tiles */}
          <motion.div
            variants={stagger}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:mx-0 sm:mt-8"
          >
            {tiles.map((t) => {
              const Icon = t.icon
              const Comp = t.href ? motion.a : motion.button
              return (
                <Comp
                  key={t.key}
                  href={t.href}
                  onClick={t.onClick}
                  variants={slideIn}
                  whileHover={isMobile ? undefined : { x: 14, scale: 1.02 }}
                  whileTap={{ scale: 0.97, filter: 'brightness(1.4)' }}
                  className={`hud-panel cut group flex items-center gap-3.5 px-4 py-2.5 text-left sm:gap-4 sm:px-5 sm:py-3 ${
                    t.active ? 'ring-1 ring-accent' : ''
                  }`}
                >
                  <Icon className="shrink-0 text-accent transition group-hover:scale-125" size={22} />
                  <div className="flex-1">
                    <div className="game-title text-base leading-tight text-fg sm:text-lg">
                      {t.label}
                    </div>
                  </div>
                  {t.active ? (
                    <span className="game-title bg-accent px-2 py-0.5 text-[11px] text-bg sm:text-xs">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                  )}
                </Comp>
              )
            })}
          </motion.div>
        </motion.div>

        {/* RIGHT: player showcase */}
        <div className="relative order-1 mx-auto w-full max-w-[13.5rem] sm:max-w-sm lg:order-2 lg:max-w-none">
          <motion.div
            style={
              isMobile
                ? { background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }
                : { x: backdropX, background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-x-[22%] bottom-0 top-6 sm:inset-x-[24%] sm:top-10 [clip-path:polygon(12%_0,100%_0,88%_100%,0_100%)]"
          />
          <motion.img
            src={profile.profileImages[theme]}
            alt={profile.name}
            style={{
              y: isMobile ? 0 : photoY,
              WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
            }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={isMobile ? undefined : { scale: 1.03 }}
            className="relative mx-auto max-h-[34vh] w-full max-w-md object-contain sm:max-h-none"
          />
        </div>
      </div>
    </section>
  )
}
