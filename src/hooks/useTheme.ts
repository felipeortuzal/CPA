import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { const stored = localStorage.getItem('cpa-theme'); if (stored === 'light' || stored === 'dark') return stored } catch { /* Theme is optional; storage errors must not prevent study. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('cpa-theme', theme) } catch { /* Keep theme in memory. */ }
  }, [theme])

  return { theme, toggleTheme: () => setTheme((value) => value === 'dark' ? 'light' : 'dark') }
}
