import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, MessageCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Section, { slideIn } from './Section'
import { profile } from '../data/portfolioData'
import { sanitizeExternalUrl } from '../utils/security'

export default function Footer() {
  const emailUrl = sanitizeExternalUrl(`mailto:${profile.email}`)
  const whatsappUrl = sanitizeExternalUrl(`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`)

  const socials = [
    { href: profile.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: profile.socials.github, icon: Github, label: 'GitHub' },
  ].filter((l) => l.href)

  return (
    <>
      <Section id="contact" title="Contact" index="06">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Email + QR Code */}
          <motion.a
            variants={slideIn}
            href={emailUrl}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.96, filter: 'brightness(1.4)' }}
            className="hud-panel cut flex items-center justify-between gap-4 p-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <Mail className="shrink-0 text-accent" size={28} />
              <div className="min-w-0">
                <div className="game-title text-xs text-accent2">Scan or click to email</div>
                <div className="game-title break-all text-lg text-fg sm:text-xl">
                  {profile.email}
                </div>
              </div>
            </div>
            <div className="cut-sm shrink-0 bg-white p-2 shadow-md">
              <QRCodeSVG value={emailUrl} size={76} level="M" />
            </div>
          </motion.a>

          {/* WhatsApp + QR Code */}
          <motion.a
            variants={slideIn}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.96, filter: 'brightness(1.4)' }}
            className="hud-panel cut flex items-center justify-between gap-4 p-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <MessageCircle className="shrink-0 text-accent" size={28} />
              <div className="min-w-0">
                <div className="game-title text-xs text-accent2">Scan or click to message</div>
                <div className="game-title text-lg text-fg sm:text-2xl">
                  WhatsApp {profile.whatsapp}
                </div>
              </div>
            </div>
            <div className="cut-sm shrink-0 bg-white p-2 shadow-md">
              <QRCodeSVG value={whatsappUrl} size={76} level="M" />
            </div>
          </motion.a>

          {socials.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              variants={slideIn}
              href={href}
              aria-label={label}
              whileHover={{ y: -4 }}
              className="hud-panel cut p-4 text-accent"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </div>
      </Section>
      <footer className="border-t border-line px-5 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  )
}
