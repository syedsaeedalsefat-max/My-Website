import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'maritime' | 'cyber'

const VALID_THEMES: readonly Theme[] = ['maritime', 'cyber']

function readSafeTheme(): Theme {
  try {
    const raw = localStorage.getItem('theme')
    if (raw && (VALID_THEMES as readonly string[]).includes(raw)) {
      return raw as Theme
    }
  } catch {
    /* ignore storage access errors */
  }
  return 'cyber'
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readSafeTheme)

  const setTheme = (next: Theme) => {
    if ((VALID_THEMES as readonly string[]).includes(next)) {
      setThemeState(next)
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore storage errors */
    }
  }, [theme])

  const toggleTheme = () => setThemeState((t) => (t === 'cyber' ? 'maritime' : 'cyber'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
