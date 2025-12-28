import { NOTES, BLACK_KEY_INDICES, WHITE_KEY_LABELS, BLACK_KEY_LABELS } from '../data/constants'
import { COMB_PADDING_LEFT_PERCENT, COMB_PADDING_RIGHT_PERCENT } from './Comb'

export default function Piano({ activeNotes = new Set(), onNotePlay }) {
  // Calculate white key positions for black keys
  const getBlackKeyPosition = (noteIndex) => {
    // Map black key indices to their position relative to white keys
    const blackKeyPositions = {
      1: 0,   // C#4 - after C
      3: 1,   // D#4 - after D
      6: 3,   // F#4 - after F
      8: 4,   // G#4 - after G
      10: 5,  // A#4 - after A
      13: 7,  // C#5 - after C
      15: 8,  // D#5 - after D
      18: 10, // F#5 - after F
      20: 11, // G#5 - after G
    }
    return blackKeyPositions[noteIndex]
  }

  const whiteKeyWidth = 100 / 12 // 12 white keys
  const blackKeyWidth = whiteKeyWidth * 0.65

  return (
    <div
      className="w-full"
      style={{
        paddingLeft: `${COMB_PADDING_LEFT_PERCENT}%`,
        paddingRight: `${COMB_PADDING_RIGHT_PERCENT}%`
      }}
    >
      {/* Piano keyboard */}
      <div className="relative h-36 mb-1">
        {/* White keys */}
        <div className="absolute inset-0 flex">
          {WHITE_KEY_LABELS.map((label, i) => {
            // Find the note index for this white key
            const whiteKeyIndices = NOTES.map((_, idx) => idx).filter(idx => !BLACK_KEY_INDICES.includes(idx))
            const noteIndex = whiteKeyIndices[i]
            const isActive = activeNotes.has(noteIndex)

            return (
              <button
                key={`white-${i}`}
                className="relative flex-1 rounded-b-md border border-gray-300 transition-all duration-100"
                style={{
                  background: isActive
                    ? `linear-gradient(to bottom, var(--color-accent-hover), var(--color-accent))`
                    : 'linear-gradient(to bottom, #ffffff, #e8e8e8)',
                  boxShadow: isActive
                    ? 'inset 0 3px 8px rgba(0,0,0,0.3), 0 0 15px var(--color-comb-glow)'
                    : '0 2px 4px rgba(0,0,0,0.3)',
                  transform: isActive ? 'translateY(2px)' : 'translateY(0)',
                }}
                onClick={() => onNotePlay && onNotePlay(noteIndex)}
              >
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-mono font-medium transition-colors duration-100"
                  style={{ color: isActive ? '#000' : '#555' }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Black keys */}
        <div className="absolute inset-0 pointer-events-none">
          {BLACK_KEY_INDICES.map((noteIndex, i) => {
            const position = getBlackKeyPosition(noteIndex)
            const isActive = activeNotes.has(noteIndex)
            const leftPercent = (position + 1) * whiteKeyWidth - blackKeyWidth / 2

            return (
              <button
                key={`black-${noteIndex}`}
                className="absolute h-[60%] rounded-b-md pointer-events-auto transition-all duration-100"
                style={{
                  left: `${leftPercent}%`,
                  width: `${blackKeyWidth}%`,
                  background: isActive
                    ? `linear-gradient(to bottom, var(--color-accent), var(--color-accent-dark))`
                    : 'linear-gradient(to bottom, #2a2a2a, #000)',
                  boxShadow: isActive
                    ? 'inset 0 2px 6px rgba(0,0,0,0.4), 0 0 12px var(--color-comb-glow)'
                    : '0 3px 6px rgba(0,0,0,0.5)',
                  transform: isActive ? 'translateY(2px)' : 'translateY(0)',
                }}
                onClick={() => onNotePlay && onNotePlay(noteIndex)}
              >
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-mono font-medium transition-colors duration-100"
                  style={{ color: isActive ? '#000' : '#999' }}
                >
                  {BLACK_KEY_LABELS[i]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
