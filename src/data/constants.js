// Note range: C4 to G#5 (21 chromatic notes)
export const NOTES = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'
]

// Display names without octave number
export const NOTE_DISPLAY_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'
]

// Keyboard mapping: key -> note index
export const KEYBOARD_MAP = {
  // Bottom row (white keys + some black keys interspersed)
  'q': 0,   // C4
  '2': 1,   // C#4
  'w': 2,   // D4
  '3': 3,   // D#4
  'e': 4,   // E4
  'r': 5,   // F4
  '5': 6,   // F#4
  't': 7,   // G4
  '6': 8,   // G#4
  'y': 9,   // A4
  '7': 10,  // A#4
  'u': 11,  // B4
  'i': 12,  // C5
  '9': 13,  // C#5
  'o': 14,  // D5
  '0': 15,  // D#5
  'p': 16,  // E5
  '[': 17,  // F5
  '=': 18,  // F#5
  ']': 19,  // G5
  'Backspace': 20, // G#5
}

// Which notes are "black keys" (sharps/flats)
export const BLACK_KEY_INDICES = [1, 3, 6, 8, 10, 13, 15, 18, 20]

// Which notes are "white keys"
export const WHITE_KEY_INDICES = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19]

// Keyboard keys display for white keys (bottom row)
export const WHITE_KEY_LABELS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']']

// Keyboard keys display for black keys (top row)
export const BLACK_KEY_LABELS = ['2', '3', '5', '6', '7', '9', '0', '=', '⌫']

// Default note duration in seconds (music box pluck style)
export const DEFAULT_NOTE_DURATION = 0.5

// Tempo presets
export const TEMPO_PRESETS = {
  adagio: { bpm: 70, label: 'Adagio', description: 'Slow' },
  moderato: { bpm: 100, label: 'Moderato', description: 'Medium' },
  allegro: { bpm: 140, label: 'Allegro', description: 'Fast' },
}

// Time signatures
export const TIME_SIGNATURES = ['4/4', '3/4', '2/4']

// Tempo range
export const MIN_TEMPO = 40
export const MAX_TEMPO = 200
export const DEFAULT_TEMPO = 100
