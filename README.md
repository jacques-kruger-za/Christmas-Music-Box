# Christmas Music Box

A browser-based music box simulator built with React 19, Vite, Tone.js, and Tailwind CSS. Features an interactive piano keyboard, rotating pin drum visualization, and recording capabilities.

## Features

- **Interactive Piano** - 21 chromatic notes (C4 to G#5) playable via mouse clicks or keyboard
- **Pin Drum Visualization** - Rotating cylinder showing upcoming notes as pins
- **Comb Animation** - Glowing tines that animate when struck
- **3 Christmas Songs** - Jingle Bells, Silent Night, Deck the Halls
- **Recording System** - Record your own melodies with metronome support
- **Tempo Control** - Adjustable 40-200 BPM with preset buttons (Adagio, Moderato, Allegro)
- **Pause/Resume** - Pause playback mid-song and resume from the same position
- **Theme Switching** - Christmas (default), Winter, and Classic themes
- **Export/Import** - Save and share recordings as JSON files

## Keyboard Shortcuts

| Keys | Notes |
|------|-------|
| `q w e r t y u i o p [ ]` | White keys (C D E F G A B C D E F G) |
| `2 3 5 6 7 9 0 = Backspace` | Black keys (C# D# F# G# A# C# D# F# G#) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/jacques-kruger-za/Christmas-Music-Box.git
cd Christmas-Music-Box

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool with HMR
- **Tone.js** - Web Audio synthesis
- **Tailwind CSS** - Utility-first styling

## Project Structure

```
src/
├── components/     # UI components (Piano, Comb, Drum, ControlPanel)
├── hooks/          # Custom hooks (useAudio, useKeyboardInput, useRecording)
├── context/        # React context (ThemeContext)
├── data/           # Song data and constants
└── utils/          # Helper functions (storage, note positions)
```

## How It Works

The app simulates a physical music box:

1. **Piano** - Click keys or use keyboard shortcuts to play notes
2. **Pin Drum** - Shows scheduled notes as pins that rotate toward the strike zone
3. **Comb** - Visualizes which notes are currently playing with glow effects
4. **Recording** - Press record, play notes, and save your composition

## Adding Songs

Add new songs to `src/data/songs.js`:

```js
{
  name: "My Song",
  tempo: 100,
  timeSignature: "4/4",
  notes: [
    { note: "C4", time: 0 },
    { note: "E4", time: 0.5 },
    { note: "G4", time: 1 },
    // ... more notes
  ]
}
```

## License

MIT
