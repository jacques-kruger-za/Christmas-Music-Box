import { BLACK_KEY_INDICES, WHITE_KEY_INDICES } from '../data/constants'

// Maps note index to its horizontal position (0-100%) matching piano layout
// White keys are centered in their slots, black keys are at the boundaries
export function getNotePosition(noteIndex) {
  const whiteKeyWidth = 100 / 12 // 12 white keys

  if (BLACK_KEY_INDICES.includes(noteIndex)) {
    // Black key positions - at the boundary between white keys
    const blackKeyPositions = {
      1: 0,   // C#4 - after C (white key 0)
      3: 1,   // D#4 - after D (white key 1)
      6: 3,   // F#4 - after F (white key 3)
      8: 4,   // G#4 - after G (white key 4)
      10: 5,  // A#4 - after A (white key 5)
      13: 7,  // C#5 - after C (white key 7)
      15: 8,  // D#5 - after D (white key 8)
      18: 10, // F#5 - after F (white key 10)
      20: 11, // G#5 - after G (white key 11)
    }
    const whiteKeyBefore = blackKeyPositions[noteIndex]
    // Position at the right edge of the white key before
    return (whiteKeyBefore + 1) * whiteKeyWidth
  } else {
    // White key positions - centered in their slot
    const whiteKeyIndex = WHITE_KEY_INDICES.indexOf(noteIndex)
    return (whiteKeyIndex + 0.5) * whiteKeyWidth
  }
}

// Get all note positions as an array
export function getAllNotePositions() {
  return Array.from({ length: 21 }, (_, i) => getNotePosition(i))
}
