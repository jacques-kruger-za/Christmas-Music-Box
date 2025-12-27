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
    <div className="relative h-full">
      {/* Theme selector positioned outside top-right */}
      <div className="absolute -top-12 right-0 z-10">
        <ThemeSelector />
      </div>

      {/* Music Box container */}
      <div
        className="rounded-xl p-4 h-full flex flex-col"
        style={{
          background: 'var(--color-panel)',
          border: '1px solid var(--color-panel-border)',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Drum (pin cylinder) - expands to fill available space */}
        <div className="flex-1 min-h-[160px]">
          <Drum
            notes={notes}
            currentTime={currentTime}
            tempo={tempo}
            isPlaying={isPlaying}
          />
        </div>

        {/* Comb */}
        <Comb activeTeeth={activeNotes} />

        {/* Piano */}
        <Piano
          activeNotes={activeNotes}
          onNotePlay={onNotePlay}
        />
      </div>
    </div>
  )
}
