import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const SQLI_XSS_GUARD =
  /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|SLEEP|BENCHMARK|WAITFOR)\b|--|\/\*|\*\/|%27|%22|<script\b|%3Cscript)/i

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://i.ytimg.com https://yt3.ggpht.com",
    "media-src 'self' blob: data:",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
    "connect-src 'self' ws: wss: https://www.youtube.com https://*.googlevideo.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function securityHardeningPlugin(): Plugin {
  const applyMiddleware = (middlewares: any) => {
    middlewares.use((req: any, res: any, next: () => void) => {
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        res.setHeader(key, value)
      }
      const rawUrl = req.url || ''
      let decoded = rawUrl
      try {
        decoded = decodeURIComponent(rawUrl)
      } catch {
        res.statusCode = 400
        res.end('Bad Request')
        return
      }
      // Block non-read HTTP methods or SQLi/XSS attack probes in query strings
      if (
        (req.method && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) ||
        (rawUrl.includes('?') && SQLI_XSS_GUARD.test(decoded))
      ) {
        res.statusCode = 403
        res.end('Forbidden: Request blocked by security policy')
        return
      }
      next()
    })
  }

  return {
    name: 'security-hardening',
    configureServer(server) {
      applyMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      applyMiddleware(server.middlewares)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), securityHardeningPlugin()],
})
