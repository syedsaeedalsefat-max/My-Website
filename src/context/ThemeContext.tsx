import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'maritime' | 'cyber'

const VALID_THEMES: readonly Theme[] = ['maritime', 'cyber']

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start on Merchant Navy mode by default on every fresh visit / page reload
  const [theme, setThemeState] = useState<Theme>('maritime')

  const setTheme = (next: Theme) => {
    if ((VALID_THEMES as readonly string[]).includes(next)) {
      setThemeState(next)
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
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
