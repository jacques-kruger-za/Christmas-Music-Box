import { NOTE_DISPLAY_NAMES, BLACK_KEY_INDICES, WHITE_KEY_INDICES } from '../data/constants'
import { COMB_PADDING_LEFT_PERCENT, COMB_PADDING_RIGHT_PERCENT } from './Comb'

// Calculate note label position to align with piano keys
// Uses same logic as Piano.jsx for key positioning
function getNoteCenterPosition(noteIndex) {
  const whiteKeyWidth = 100 / 12 // 12 white keys
  const isBlackKey = BLACK_KEY_INDICES.includes(noteIndex)

  if (isBlackKey) {
    // Black key positions: which white key they sit after
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
    const position = blackKeyPositions[noteIndex]
    // Black key center is at the right edge of the white key it follows
    return (position + 1) * whiteKeyWidth
  } else {
    // White key: find which white key index this note is
    const whiteKeyIndex = WHITE_KEY_INDICES.indexOf(noteIndex)
    // White key center is in the middle of the key
    return (whiteKeyIndex + 0.5) * whiteKeyWidth
  }
}

export default function NoteLabels({ activeNotes = new Set() }) {
  return (
    <div
      className="w-full h-8"
      style={{
        paddingLeft: `${COMB_PADDING_LEFT_PERCENT}%`,
        paddingRight: `${COMB_PADDING_RIGHT_PERCENT}%`,
      }}
    >
      {/* Inner container matches Piano's positioning context */}
      <div className="relative w-full h-full">
        {NOTE_DISPLAY_NAMES.map((name, i) => {
          const isBlackKey = BLACK_KEY_INDICES.includes(i)
          const isActive = activeNotes.has(i)
          const notePosition = getNoteCenterPosition(i)

          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 transition-all duration-100"
              style={{
                left: `${notePosition}%`,
                top: '50%',
                transform: `translateX(-50%) translateY(-50%) scale(${isActive ? 1.2 : 1})`,
                fontSize: isBlackKey ? '11px' : '13px',
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-gold)',
                opacity: isActive ? 1 : 0.7,
                textShadow: isActive ? '0 0 10px var(--color-accent)' : 'none',
              }}
            >
              {name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
