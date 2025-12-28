import { useRef } from 'react'
import { MIN_TEMPO, MAX_TEMPO, TEMPO_PRESETS } from '../data/constants'
import SongSelector from './SongSelector'

export default function SelectTab({
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
  onExport,
  onImport,
  onDeleteRecording,
}) {
  const fileInputRef = useRef(null)
  const allSongs = [...songs, ...recordings]
  const currentSong = allSongs.find(s => s.name === selectedSong)
  const baseTempo = currentSong?.tempo || 100
  const speedPercent = Math.round((tempo / baseTempo) * 100)
  const tempoLocked = isPlaying || isPaused

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-5">
      {/* Song Selector */}
      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: 'var(--color-text-gold)' }}
        >
          Choose a Song
        </label>
        <SongSelector
          songs={songs}
          recordings={recordings}
          selectedSong={selectedSong}
          onSelectSong={onSelectSong}
          onDeleteRecording={onDeleteRecording}
        />
      </div>

      {/* Export/Import Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex-1 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
        >
          Export JSON
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Recording count */}
      <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        You have {recordings.length} recording{recordings.length !== 1 ? 's' : ''}
      </p>

      {/* Tempo Presets */}
      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: 'var(--color-text-gold)' }}
        >
          Tempo Preset
        </label>
        <div className="flex gap-2">
          {Object.entries(TEMPO_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onTempoChange(preset.bpm)}
              disabled={tempoLocked}
              className={`flex-1 py-2 px-2 rounded-lg transition-all ${
                tempo === preset.bpm ? 'ring-2' : ''
              } ${tempoLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                background: 'var(--color-button-bg)',
                border: `1px solid ${tempo === preset.bpm ? 'var(--color-accent)' : 'var(--color-button-border)'}`,
                ringColor: 'var(--color-accent)',
              }}
            >
              <div className="font-medium text-sm">{preset.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {preset.bpm} BPM
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tempo Display */}
      <div className="text-center">
        <p
          className="text-xs uppercase tracking-wider mb-1"
          style={{ color: 'var(--color-text-gold)' }}
        >
          Tempo
        </p>
        <p className="text-3xl font-bold">{tempo} BPM</p>
        <p className="text-sm" style={{ color: 'var(--color-text-gold)' }}>
          {speedPercent}% speed
        </p>
      </div>

      {/* Tempo Slider */}
      <div className={`flex items-center gap-3 ${tempoLocked ? 'opacity-50' : ''}`}>
        <button
          onClick={() => onTempoChange(Math.max(MIN_TEMPO, tempo - 5))}
          disabled={tempoLocked}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${tempoLocked ? 'cursor-not-allowed' : ''}`}
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
        >
          −
        </button>
        <input
          type="range"
          min={MIN_TEMPO}
          max={MAX_TEMPO}
          value={tempo}
          onChange={(e) => onTempoChange(Number(e.target.value))}
          disabled={tempoLocked}
          className={`flex-1 h-2 rounded-full appearance-none ${tempoLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${((tempo - MIN_TEMPO) / (MAX_TEMPO - MIN_TEMPO)) * 100}%, var(--color-slider-track) 0%)`,
          }}
        />
        <button
          onClick={() => onTempoChange(Math.min(MAX_TEMPO, tempo + 5))}
          disabled={tempoLocked}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${tempoLocked ? 'cursor-not-allowed' : ''}`}
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
        >
          +
        </button>
      </div>

      {/* Repeat Toggle */}
      <div
        className="flex items-center justify-between p-3 rounded-lg"
        style={{ background: 'var(--color-button-bg)' }}
      >
        <div>
          <p className="font-medium" style={{ color: 'var(--color-text-gold)' }}>
            Repeat Song
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Loop continuously until stopped
          </p>
        </div>
        <button
          onClick={() => onRepeatChange(!repeat)}
          className={`toggle-switch ${repeat ? 'active' : ''}`}
        />
      </div>

      {/* Playback Controls */}
      <div className="flex gap-3">
        {/* Play/Resume Button */}
        <button
          onClick={onPlay}
          disabled={!selectedSong || isPlaying}
          className="flex-1 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'var(--color-accent)',
            color: '#000',
          }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {isPaused ? 'Resume' : 'Play'}
        </button>

        {/* Pause Button - only show when playing */}
        {isPlaying && (
          <button
            onClick={onPause}
            className="py-4 px-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all"
            style={{
              background: 'var(--color-button-bg)',
              border: '1px solid var(--color-button-border)',
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </button>
        )}

        {/* Stop Button - show when playing or paused */}
        {(isPlaying || isPaused) && (
          <button
            onClick={onStop}
            className="py-4 px-4 rounded-lg font-bold text-lg flex items-center justify-center transition-all"
            style={{
              background: 'var(--color-record)',
              color: '#fff',
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
