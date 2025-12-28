import SelectTab from './SelectTab'
import RecordTab from './RecordTab'

export default function ControlPanel({
  songs,
  recordings,
  selectedSong,
  onSelectSong,
  onPlay,
  onPause,
  onStop,
  isPlaying,
  isPaused,
  tempo,
  onTempoChange,
  repeat,
  onRepeatChange,
  isRecording,
  onStartRecording,
  onStopRecording,
  recordingTempo,
  onRecordingTempoChange,
  timeSignature,
  onTimeSignatureChange,
  metronome,
  onMetronomeChange,
  onExport,
  onImport,
  activeTab,
  onTabChange,
  onDeleteRecording,
}) {

  return (
    <div
      className="rounded-xl p-1 h-full flex flex-col"
      style={{
        background: 'var(--color-panel)',
        border: '1px solid var(--color-panel-border)',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Tabs */}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium transition-all rounded-t-lg ${
            activeTab === 'select' ? '' : 'opacity-70 hover:opacity-90'
          }`}
          style={{
            background: activeTab === 'select' ? 'var(--color-tab-active)' : 'var(--color-tab-inactive)',
            color: activeTab === 'select' ? '#000' : 'var(--color-text)',
          }}
          onClick={() => onTabChange('select')}
        >
          Select
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium transition-all rounded-t-lg ${
            activeTab === 'record' ? '' : 'opacity-70 hover:opacity-90'
          }`}
          style={{
            background: activeTab === 'record' ? 'var(--color-tab-active)' : 'var(--color-tab-inactive)',
            color: activeTab === 'record' ? '#000' : 'var(--color-text)',
          }}
          onClick={() => onTabChange('record')}
        >
          Record
        </button>
      </div>

      {/* Tab Content - Both tabs rendered, inactive one hidden but still contributes to height */}
      <div className="p-4 flex-1 overflow-y-auto relative">
        {/* Select tab - always rendered to maintain consistent height */}
        <div className={activeTab === 'select' ? '' : 'invisible'}>
          <SelectTab
            songs={songs}
            recordings={recordings}
            selectedSong={selectedSong}
            onSelectSong={onSelectSong}
            onPlay={onPlay}
            onPause={onPause}
            onStop={onStop}
            isPlaying={isPlaying}
            isPaused={isPaused}
            tempo={tempo}
            onTempoChange={onTempoChange}
            repeat={repeat}
            onRepeatChange={onRepeatChange}
            onExport={onExport}
            onImport={onImport}
            onDeleteRecording={onDeleteRecording}
          />
        </div>

        {/* Record tab - absolutely positioned over Select tab area */}
        <div
          className={`absolute inset-0 p-4 ${activeTab === 'record' ? '' : 'invisible pointer-events-none'}`}
        >
          <RecordTab
            isRecording={isRecording}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            tempo={recordingTempo}
            onTempoChange={onRecordingTempoChange}
            timeSignature={timeSignature}
            onTimeSignatureChange={onTimeSignatureChange}
            metronome={metronome}
            onMetronomeChange={onMetronomeChange}
          />
        </div>
      </div>
    </div>
  )
}
