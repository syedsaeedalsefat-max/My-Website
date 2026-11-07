/**
 * Client-side security utilities:
 * - Blocks malformed or malicious URLs (e.g. javascript:, data:, vbscript:)
 * - Inspects & strips SQL injection / XSS payloads from URL query & hash parameters
 */

const SQLI_XSS_PATTERN =
  /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|CAST|DECLARE|NVARCHAR|SLEEP|BENCHMARK|WAITFOR)\b|--|\/\*|\*\/|;\s*(SELECT|DROP|INSERT|UPDATE|DELETE)|['"]\s*(OR|AND)\s*['"\d]|<script\b|javascript:|onerror\s*=|onload\s*=)/i

export function sanitizeExternalUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:') {
      return parsed.href
    }
  } catch {
    /* invalid URL */
  }
  return '#'
}

/**
 * Inspects window.location.search and window.location.hash on load and navigation.
 * If SQL injection or XSS vectors are injected into the URL, strips them immediately
 * using history.replaceState so they are never processed or reflected.
 */
export function enforceUrlInputGuard(): void {
  const cleanLocation = () => {
    try {
      const { pathname, search, hash } = window.location
      const decodedSearch = decodeURIComponent(search || '')
      const decodedHash = decodeURIComponent(hash || '')

      const searchHasPayload = decodedSearch.length > 0 && SQLI_XSS_PATTERN.test(decodedSearch)
      // Allow only strict alphanumeric section hashes like #about, #academics, #gallery, #contact
      const hashIsInvalid =
        decodedHash.length > 0 && (!/^#[a-zA-Z0-9_-]{1,32}$/.test(decodedHash) || SQLI_XSS_PATTERN.test(decodedHash))

      if (searchHasPayload || hashIsInvalid) {
        const safeHash = hashIsInvalid ? '' : hash
        window.history.replaceState(null, '', pathname + safeHash)
      }
    } catch {
      // Malformed URI encoding (e.g. %E0%A4%A fuzzing attack) -> strip query & hash
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  cleanLocation()
  window.addEventListener('hashchange', cleanLocation)
  window.addEventListener('popstate', cleanLocation)
}

