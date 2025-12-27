# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Christmas Music Box simulator built with React 19, Vite, Tone.js, and Tailwind CSS. Simulates a physical music box with interactive piano, rotating pin drum, comb visualization, and recording capabilities.

## Commands

```bash
# Development
npm run dev          # Start dev server with HMR

# Build & Production
npm run build        # Production build
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Architecture

### Core Concepts
- **Note range**: C4 to G#5 (21 chromatic notes)
- **Recording**: Fixed note duration (music-box style plucks)
- **Input**: Desktop only (mouse + keyboard)
- **Theming**: CSS custom properties via ThemeContext (Christmas, Winter, Classic themes)
- **Tempo**: 40-200 BPM with presets (Adagio, Moderato, Allegro)

### Project Structure
```
src/
├── components/
│   ├── App.jsx              # Main app with state management
│   ├── MusicBox.jsx         # Container for drum + comb + piano
│   ├── Piano.jsx            # Interactive 21-key keyboard
│   ├── Comb.jsx             # SVG comb with 21 glowing tines
│   ├── Drum.jsx             # Pin cylinder visualization
│   ├── ControlPanel.jsx     # Tab container (Select/Record)
│   ├── SelectTab.jsx        # Song selection and playback controls
│   ├── RecordTab.jsx        # Recording controls with metronome
│   ├── Header.jsx           # App title
│   ├── ThemeSelector.jsx    # Theme switcher dropdown
│   └── ErrorBoundary.jsx    # Error handling wrapper
├── hooks/
│   ├── useAudio.js          # Tone.js integration, playback, metronome
│   ├── useKeyboardInput.js  # Physical keyboard to note mapping
│   └── useRecording.js      # Recording state and note capture
├── context/
│   └── ThemeContext.jsx     # Theme provider with CSS variables
├── data/
│   ├── constants.js         # Notes, keyboard mapping, tempo presets
│   └── songs.js             # 3 Christmas songs (Jingle Bells, Silent Night, Deck the Halls)
├── utils/
│   ├── storage.js           # localStorage for recordings (save/load/export/import)
│   └── notePositions.js     # Shared positioning for piano/comb/drum alignment
├── index.css                # Global styles and CSS custom properties
└── main.jsx                 # Entry point with ThemeProvider
```

### Audio System (useAudio.js)
- Tone.js PolySynth with music box timbre (triangle wave + reverb)
- Methods: `playNote()`, `scheduleNotes()`, `stop()`, `pause()`, `resume()`
- Metronome with accent on first beat of measure
- Handles Web Audio autoplay restrictions

### Visual Components
- **Piano**: White keys (12) + black keys (9), gold glow on press, keyboard shortcuts
- **Comb**: SVG tines with glow animation when struck
- **Drum**: CSS circles (not SVG) to avoid stretch distortion, animated on strike

### Keyboard Mapping
```
White keys: q w e r t y u i o p [ ]
Black keys: 2 3 5 6 7 0 = Backspace
```

### Data Formats
**Song format:**
```js
{
  name: "Song Name",
  tempo: 100,
  timeSignature: "4/4",
  notes: [{ note: "C4", time: 0, duration: 0.5 }]
}
```

**Recordings:** Stored in localStorage as JSON array

## Key Implementation Details

### Note Alignment
All visualizations (drum pins, comb teeth, note labels) use shared `getNotePosition()` utility from `utils/notePositions.js` to align with piano keys.

### Theme System
CSS custom properties defined in `index.css`:
- `--color-background`, `--color-panel`, `--color-accent`
- `--color-text`, `--color-text-gold`, `--color-text-muted`
- `--color-pin`, `--color-comb-tooth`, `--color-record`

### Playback State
- `isPlaying`: Currently playing (transport running)
- `isPaused`: Paused mid-playback (can resume)
- Pause preserves position; Stop resets to beginning

## Adding New Songs

Add to `src/data/songs.js`:
```js
{
  name: "New Song",
  tempo: 100,
  timeSignature: "4/4",
  notes: [
    { note: "C4", time: 0 },
    { note: "E4", time: 0.5 },
    // ... more notes
  ]
}
```

## Adding New Themes

1. Add theme object to `THEMES` in `context/ThemeContext.jsx`
2. Define all required CSS custom properties
3. Theme will auto-appear in dropdown
