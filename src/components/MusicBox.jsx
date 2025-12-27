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
        {/* Drum (pin cylinder) - shrunk to accommodate larger comb */}
        <div className="flex-1 min-h-[100px]">
          <Drum
            notes={notes}
            currentTime={currentTime}
            tempo={tempo}
            isPlaying={isPlaying}
          />
        </div>

        {/* Comb - now 2.5x height */}
        <Comb activeTeeth={activeNotes} />

        {/* Stylish divider between comb and piano */}
        <div className="py-4 px-4">
          <div
            className="relative h-[2px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
            }}
          >
            {/* Center decorative element */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{
                background: 'var(--color-accent)',
                boxShadow: '0 0 8px var(--color-accent)',
              }}
            />
          </div>
        </div>

        {/* Piano */}
        <Piano
          activeNotes={activeNotes}
          onNotePlay={onNotePlay}
        />
      </div>
    </div>
  )
}
