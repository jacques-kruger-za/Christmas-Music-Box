import { useState, useRef, useEffect } from 'react'

export default function SongSelector({
  songs,
  recordings,
  selectedSong,
  onSelectSong,
  onDeleteRecording,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [hoveredDelete, setHoveredDelete] = useState(null)
  const containerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (songName) => {
    onSelectSong(songName)
    setIsOpen(false)
  }

  const handleDelete = (e, songName) => {
    e.stopPropagation()
    onDeleteRecording(songName)
  }

  const selectedLabel = selectedSong || '-- Select --'

  return (
    <div ref={containerRef} className="relative">
      {/* Selected value display / trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 rounded-lg text-white text-left flex items-center justify-between cursor-pointer"
        style={{
          background: 'var(--color-button-bg)',
          border: '1px solid var(--color-button-border)',
        }}
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-20 max-h-64 overflow-y-auto"
          style={{
            background: 'var(--color-panel)',
            border: '1px solid var(--color-panel-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Empty option */}
          <div
            onClick={() => handleSelect('')}
            onMouseEnter={() => setHoveredItem('empty')}
            onMouseLeave={() => setHoveredItem(null)}
            className="px-3 py-2 cursor-pointer transition-colors"
            style={{
              background: hoveredItem === 'empty' ? 'var(--color-button-bg)' : 'transparent',
              color: 'var(--color-text-muted)',
            }}
          >
            -- Select --
          </div>

          {/* Default songs */}
          {songs.map((song) => (
            <div
              key={song.name}
              onClick={() => handleSelect(song.name)}
              onMouseEnter={() => setHoveredItem(song.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className="px-3 py-2 cursor-pointer transition-colors flex items-center justify-between"
              style={{
                background: hoveredItem === song.name ? 'var(--color-button-bg)' : 'transparent',
                color: selectedSong === song.name ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              <span>{song.name}</span>
            </div>
          ))}

          {/* Recordings section */}
          {recordings.length > 0 && (
            <>
              {/* Divider */}
              <div
                className="px-3 py-2 text-xs uppercase tracking-wider"
                style={{
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-button-bg)',
                  borderTop: '1px solid var(--color-button-border)',
                  borderBottom: '1px solid var(--color-button-border)',
                }}
              >
                Your Recordings
              </div>

              {/* Recording items */}
              {recordings.map((song) => (
                <div
                  key={song.name}
                  onClick={() => handleSelect(song.name)}
                  onMouseEnter={() => setHoveredItem(song.name)}
                  onMouseLeave={() => {
                    setHoveredItem(null)
                    setHoveredDelete(null)
                  }}
                  className="px-3 py-2 cursor-pointer transition-colors flex items-center justify-between group"
                  style={{
                    background: hoveredItem === song.name ? 'var(--color-button-bg)' : 'transparent',
                    color: selectedSong === song.name ? 'var(--color-accent)' : 'var(--color-text)',
                  }}
                >
                  <span>{song.name}</span>

                  {/* Delete button - only visible on hover */}
                  {hoveredItem === song.name && (
                    <button
                      onClick={(e) => handleDelete(e, song.name)}
                      onMouseEnter={() => setHoveredDelete(song.name)}
                      onMouseLeave={() => setHoveredDelete(null)}
                      className="p-1 rounded transition-colors"
                      style={{
                        color: hoveredDelete === song.name ? 'var(--color-record)' : 'var(--color-text-muted)',
                      }}
                      title="Delete recording"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
