import Drum from './Drum'
import Comb from './Comb'
import Piano from './Piano'
import ThemeSelector from './ThemeSelector'

export default function MusicBox({
  notes = [],
  currentTime = 0,
  tempo = 100,
  isPlaying = false,
  activeNotes = new Set(),
  onNotePlay,
}) {
  return (
    <div
      className="rounded-xl p-4 relative"
      style={{
        background: 'var(--color-panel)',
        border: '1px solid var(--color-panel-border)',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Theme selector in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSelector />
      </div>

      {/* Drum (pin cylinder) */}
      <Drum
        notes={notes}
        currentTime={currentTime}
        tempo={tempo}
        isPlaying={isPlaying}
      />

      {/* Comb */}
      <Comb activeTeeth={activeNotes} />

      {/* Piano */}
      <Piano
        activeNotes={activeNotes}
        onNotePlay={onNotePlay}
      />
    </div>
  )
}
