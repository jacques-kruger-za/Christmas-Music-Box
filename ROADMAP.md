# Music Box App - Development Roadmap

## Overview
Build a music box simulator from scratch with React 19, Vite, Tone.js, and Tailwind CSS. The app simulates a physical music box with interactive piano, visual feedback, and recording capabilities.

## Tech Stack
- **Framework**: React 19
- **Build**: Vite (with HMR)
- **Audio**: Tone.js
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Persistence**: localStorage

## Key Decisions
- **Note range**: C4 to G#5 (21 chromatic notes) with configurable base octave
- **Recording**: Fixed note duration (music-box style)
- **Theming**: Include theme selector UI from the start
- **Input**: Desktop only (mouse + keyboard), no touch for now

## Design Principles
1. **Skinnable from day one** - CSS variables/theme context for all colors
2. **Tempo-aware** - Components accept tempo prop even before tempo UI exists
3. **Separation of concerns** - Songs in separate data file, audio logic isolated
4. **Incremental complexity** - Build working features before adding polish
5. **Configurable range** - Base octave can be shifted up/down

---

## Phase 1: Project Foundation

### 1.1 Project Setup
- Initialize Vite + React project
- Configure Tailwind CSS
- Configure ESLint
- Set up folder structure:
  ```
  src/
  ├── components/
  ├── hooks/
  ├── context/
  ├── data/
  ├── utils/
  └── styles/
  ```

### 1.2 Theme System
- Create ThemeContext with CSS custom properties
- Define theme shape (colors for: background, panels, text, accents, piano keys, comb, highlights)
- Create default "Christmas" theme + at least one alternate theme
- Wire theme variables to root CSS
- Include ThemeSelector component (globe icon in header)

**Files**: `context/ThemeContext.jsx`, `styles/themes.css`, `components/ThemeSelector.jsx`

---

## Phase 2: Core Audio Engine

### 2.1 Audio Service
- Initialize Tone.js PolySynth (music box timbre: triangle wave + reverb)
- Create `useAudio` hook exposing:
  - `playNote(note, duration)` - trigger single note
  - `scheduleNotes(notes, tempo)` - schedule song playback
  - `stop()` - halt playback
  - `isReady` - audio context state
- Handle Web Audio autoplay restrictions (user gesture requirement)

**Files**: `hooks/useAudio.js`

### 2.2 Musical Constants
- Define note range (C4 to G#5 = 21 chromatic notes)
- Keyboard-to-note mapping (q-] row, 2-0/=/Backspace row)
- Note display names

**Files**: `data/constants.js`

---

## Phase 3: Piano Component

### 3.1 Piano Keyboard UI
- Render white keys (12) and black keys (9) with proper positioning
- Accept `activeNotes` prop for highlight state
- Accept `onNotePlay` callback for click/touch input
- Theme-aware colors via CSS variables

### 3.2 Keyboard Input
- Create `useKeyboardInput` hook
- Map keyboard keys to notes
- Prevent key repeat, handle keyup for duration
- Track pressed keys for visual feedback

### 3.3 Note Labels
- Display note names below piano (C, C#, D, etc.)
- Highlight active notes

**Files**: `components/Piano.jsx`, `components/NoteLabels.jsx`, `hooks/useKeyboardInput.js`

---

## Phase 4: Music Box Comb

### 4.1 Comb Visualization
- SVG-based comb with 21 tines
- Accept `activeTeeth` prop for glow animation
- Theme-aware colors
- Subtle glow/vibration effect when tooth is struck

**Files**: `components/Comb.jsx`

---

## Phase 5: Song Data & Playback

### 5.1 Song Data Structure
- Define song format: `{ name, tempo, timeSignature, notes: [{ note, time, duration }] }`
- Create separate songs file with 2-3 Christmas songs
- Export as array

**Files**: `data/songs.js`

### 5.2 Song Playback
- Connect song data to audio scheduler
- Sync visual feedback (activeNotes, activeTeeth) with playback
- Play/Pause/Stop controls
- Fixed tempo (100% of song's native tempo) - prep for tempo adjustment

**Files**: `components/PlaybackControls.jsx`

---

## Phase 6: Drum/Cylinder Visualization

### 6.1 Pin Drum Display
- SVG cylinder showing upcoming notes as pins
- Rotation synced to playback time
- Pins positioned by note (vertical) and time (angular)
- Visual trigger zone where pins strike comb

**Files**: `components/Drum.jsx`

---

## Phase 7: Control Panel & Tabs

### 7.1 Layout Structure
- Two-panel responsive layout
- Left: Control panel
- Right: Music box (drum + comb + piano)

### 7.2 Select Tab
- Song dropdown selector
- Play/Pause/Stop buttons
- (Tempo slider placeholder - disabled, shows 100%)

### 7.3 Record Tab
- Record button with visual state
- Time signature selector (visual only initially)
- Tempo preset buttons (visual only initially)
- Metronome toggle (visual only initially)
- Instructions text

**Files**: `components/ControlPanel.jsx`, `components/SelectTab.jsx`, `components/RecordTab.jsx`, `components/SongSelector.jsx`

---

## Phase 8: Recording System

### 8.1 Recording Logic
- Capture notes with timestamps during recording (fixed duration per note)
- Convert to song format on stop
- Prompt for song name
- All notes use consistent duration (music-box style plucks)

### 8.2 Recording Storage
- Save recordings to localStorage
- Load on app start
- Export/Import as JSON

**Files**: `hooks/useRecording.js`, `utils/storage.js`

---

## Phase 9: Polish & Integration

### 9.1 Main App Assembly
- Wire all components together in App.jsx
- State management for activeNotes, playback, recording
- Error boundaries

### 9.2 Visual Polish
- Smooth animations for note highlights
- Proper fade durations
- Loading states

---

## Phase 10: Tempo System (LAST)

### 10.1 Tempo Controls
- Enable tempo slider (25% - 200%)
- Add preset buttons (Adagio/Moderato/Allegro)
- Wire to playback scheduler
- Adjust drum rotation speed

---

## Implementation Order Summary

1. **Project setup** - Vite, Tailwind, ESLint, folder structure
2. **Theme system** - CSS variables, context, Christmas theme
3. **Audio engine** - Tone.js setup, useAudio hook
4. **Constants** - Note definitions, keyboard mapping
5. **Piano** - Visual keyboard, click input
6. **Keyboard input** - Physical keyboard support
7. **Comb** - Visual tines with glow
8. **Songs data** - Separate file with sample songs
9. **Playback** - Schedule and play songs
10. **Drum** - Pin visualization synced to playback
11. **Layout** - Two-panel structure
12. **Select tab** - Song selection UI
13. **Record tab** - Recording UI (visual)
14. **Recording logic** - Capture and save
15. **Storage** - localStorage persistence
16. **Polish** - Animations, error handling
17. **Tempo** - Full tempo control (last)

---

## Key Files to Create

```
src/
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point
├── index.css                  # Global styles + theme variables
├── components/
│   ├── MusicBox.jsx           # Main container (drum + comb + piano)
│   ├── Piano.jsx              # Interactive keyboard
│   ├── NoteLabels.jsx         # Note names display
│   ├── Comb.jsx               # Music box comb visualization
│   ├── Drum.jsx               # Rotating pin cylinder
│   ├── ControlPanel.jsx       # Left panel container
│   ├── SelectTab.jsx          # Song selection mode
│   ├── RecordTab.jsx          # Recording mode
│   ├── SongSelector.jsx       # Dropdown for songs
│   ├── PlaybackControls.jsx   # Play/Pause/Stop
│   ├── Header.jsx             # App title
│   └── ThemeSelector.jsx      # Theme switcher (globe icon)
├── hooks/
│   ├── useAudio.js            # Tone.js integration
│   ├── useKeyboardInput.js    # Keyboard events
│   └── useRecording.js        # Recording state
├── context/
│   └── ThemeContext.jsx       # Theme provider
├── data/
│   ├── constants.js           # Notes, keyboard mapping
│   └── songs.js               # Pre-loaded songs (SEPARATE FILE)
└── utils/
    └── storage.js             # localStorage helpers
```

---

## Notes

- Tempo UI is deferred to Phase 10, but all components will accept tempo as a prop from the start
- Songs file (`data/songs.js`) is deliberately separate for easy expansion
- Theme system is built first to avoid retrofitting skinnable colors later
- Base octave (default C4) can be configured to shift entire range up/down
