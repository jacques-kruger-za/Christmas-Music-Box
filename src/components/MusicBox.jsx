import Drum from './Drum'
import Comb from './Comb'
import NoteLabels from './NoteLabels'
import Piano from './Piano'
import ThemeSelector from './ThemeSelector'

export default function MusicBox({
  notes = [],
  currentTime = 0,
  tempo = 100,
  isPlaying = false,
  activeNotes = new Set(),
  onNotePlay,
  isRecording = false,
  recordedNotes = [],
  recordingTime = 0,
  recordingTempo = 100,
  isRecordTab = false,
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
            notes={isRecordTab ? recordedNotes : notes}
            currentTime={isRecordTab ? recordingTime : currentTime}
            tempo={isRecordTab ? recordingTempo : tempo}
            isPlaying={isPlaying}
            isRecording={isRecording}
            isRecordTab={isRecordTab}
          />
        </div>

        {/* Comb - flush with drum above */}
        <Comb activeTeeth={activeNotes} />

        {/* Note labels bridge between comb and piano */}
        <div className="mt-4 mb-2">
          <NoteLabels activeNotes={activeNotes} />
        </div>

        {/* Piano */}
        <div className="mt-2">
          <Piano
            activeNotes={activeNotes}
            onNotePlay={onNotePlay}
          />
        </div>
      </div>
    </div>
  )
}
