import { useState } from 'react'
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
}) {
  const [activeTab, setActiveTab] = useState('select')

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
          onClick={() => setActiveTab('select')}
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
          onClick={() => setActiveTab('record')}
        >
          Record
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1">
        {activeTab === 'select' ? (
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
          />
        ) : (
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
        )}
      </div>
    </div>
  )
}
