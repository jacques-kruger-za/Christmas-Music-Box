import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const themeLabels = {
  christmas: 'Christmas',
  winter: 'Winter',
  classic: 'Classic',
}

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105"
        style={{
          background: 'var(--color-button-bg)',
          border: '1px solid var(--color-button-border)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          style={{ fill: 'var(--color-accent)' }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
        <span className="text-sm font-medium">{themeLabels[theme]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {/* Dropdown popup */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 py-1 rounded-lg shadow-lg z-50 min-w-[140px]"
          style={{
            background: 'var(--color-panel)',
            border: '1px solid var(--color-panel-border)',
          }}
        >
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:opacity-80 flex items-center gap-2 ${
                theme === t ? 'font-bold' : ''
              }`}
              style={{
                background: theme === t ? 'var(--color-button-bg)' : 'transparent',
                color: theme === t ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {theme === t && (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
              <span className={theme === t ? '' : 'ml-6'}>{themeLabels[t]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
