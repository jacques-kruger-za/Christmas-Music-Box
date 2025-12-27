import { createContext, useContext, useState, useEffect } from 'react'

const themes = ['christmas', 'winter', 'classic']

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('musicbox-theme')
    return saved && themes.includes(saved) ? saved : 'christmas'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'christmas') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    localStorage.setItem('musicbox-theme', theme)
  }, [theme])

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
