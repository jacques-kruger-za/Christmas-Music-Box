import { TEMPO_PRESETS, TIME_SIGNATURES } from '../data/constants'

export default function RecordTab({
  isRecording,
  onStartRecording,
  onStopRecording,
  tempo,
  onTempoChange,
  timeSignature,
  onTimeSignatureChange,
  metronome,
  onMetronomeChange,
}) {
  return (
    <div className="space-y-5">
      {/* Tempo Presets */}
      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: 'var(--color-text-gold)' }}
        >
          Tempo
        </label>
        <div className="flex gap-2">
          {Object.entries(TEMPO_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onTempoChange(preset.bpm)}
              className={`flex-1 py-3 px-2 rounded-lg transition-all ${
                tempo === preset.bpm ? 'ring-2' : ''
              }`}
              style={{
                background: tempo === preset.bpm
                  ? 'var(--color-button-bg)'
                  : 'var(--color-button-bg)',
                border: `1px solid ${tempo === preset.bpm ? 'var(--color-accent)' : 'var(--color-button-border)'}`,
                ringColor: 'var(--color-accent)',
              }}
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {preset.bpm} BPM
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Signature */}
      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: 'var(--color-text-gold)' }}
        >
          Time Signature
        </label>
        <div className="flex gap-2">
          {TIME_SIGNATURES.map(sig => (
            <button
              key={sig}
              onClick={() => onTimeSignatureChange(sig)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-lg transition-all ${
                timeSignature === sig ? 'ring-2' : ''
              }`}
              style={{
                background: 'var(--color-button-bg)',
                border: `1px solid ${timeSignature === sig ? 'var(--color-accent)' : 'var(--color-button-border)'}`,
                ringColor: 'var(--color-accent)',
              }}
            >
              {sig}
            </button>
          ))}
        </div>
      </div>

      {/* Metronome Toggle */}
      <div
        className="flex items-center justify-between p-3 rounded-lg"
        style={{ background: 'var(--color-button-bg)' }}
      >
        <div>
          <p className="font-medium" style={{ color: 'var(--color-text-gold)' }}>
            Metronome During Recording
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Keep metronome clicks playing while recording
          </p>
        </div>
        <button
          onClick={() => onMetronomeChange(!metronome)}
          className={`toggle-switch ${metronome ? 'active' : ''}`}
        />
      </div>

      {/* Record Button */}
      <div className="flex flex-col items-center py-4">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'recording-active' : ''
          }`}
          style={{
            background: 'var(--color-record)',
            boxShadow: isRecording
              ? '0 0 0 4px var(--color-record-glow)'
              : '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {isRecording ? (
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white" />
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        <p>Press keys q-] and 2-Backspace to play notes</p>
        <p>Notes will be recorded with timing</p>
      </div>

      {/* Song selector link styled like screenshot */}
      <button
        className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{
          background: 'linear-gradient(to bottom, rgba(50,30,30,0.8), rgba(30,15,15,0.9))',
          borderTop: '1px solid var(--color-accent)',
        }}
        onClick={() => {/* Would switch to Select tab */}}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-text)' }}>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
        <span>Select a Song</span>
      </button>
    </div>
  )
}
