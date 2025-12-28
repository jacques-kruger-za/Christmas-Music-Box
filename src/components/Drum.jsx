import { useMemo } from 'react'
import { NOTES } from '../data/constants'
import { COMB_PADDING_LEFT_PERCENT, COMB_PADDING_RIGHT_PERCENT } from './Comb'

// Calculate tooth center position matching the comb exactly
function getToothCenterPosition(noteIndex) {
  const numTeeth = NOTES.length // 21
  const teethStartX = COMB_PADDING_LEFT_PERCENT // 4
  const teethEndX = 100 - COMB_PADDING_RIGHT_PERCENT // 96
  const teethSpan = teethEndX - teethStartX // 92

  const toothGap = 0.5
  const totalGaps = (numTeeth - 1) * toothGap
  const toothWidth = (teethSpan - totalGaps) / numTeeth

  // Calculate left edge of tooth, then add half width for center
  const toothX = teethStartX + noteIndex * (toothWidth + toothGap)
  return toothX + toothWidth / 2
}

export default function Drum({ notes = [], currentTime = 0, tempo = 100, isPlaying = false, isRecording = false, isRecordTab = false }) {
  // Calculate visible time window (show ~4 beats ahead for spacious pin layout)
  const visibleBeats = 4
  const secondsPerBeat = 60 / tempo

  // Calculate song duration (not used in recording mode)
  const songDuration = useMemo(() => {
    if (!notes.length || isRecording) return 0
    let maxTime = 0
    notes.forEach(({ time }) => {
      if (time > maxTime) maxTime = time
    })
    return maxTime + 1 // Add 1 beat buffer after last note
  }, [notes, isRecording])

  // Create base pins
  const basePins = useMemo(() => {
    if (!notes.length) return []

    return notes.map(({ note, time }) => {
      const noteIndex = NOTES.indexOf(note)
      if (noteIndex === -1) return null

      return {
        noteIndex,
        baseTime: time,
        x: getToothCenterPosition(noteIndex),
      }
    }).filter(Boolean)
  }, [notes])

  // Calculate current beat position
  const currentBeat = currentTime / secondsPerBeat

  // Generate visible pins including lookahead copies for seamless looping
  // This simulates a cylindrical drum that wraps around
  // In recording mode, pins scroll upward (no looping)
  const visiblePins = useMemo(() => {
    if (!basePins.length) return []

    // Recording mode: show all recorded notes scrolling upward
    if (isRecording) {
      const visible = []
      basePins.forEach((pin, pinIndex) => {
        const relativeBeat = pin.baseTime - currentBeat
        // Show notes from current time back to visibleBeats ago
        if (relativeBeat <= 0.5 && relativeBeat >= -visibleBeats) {
          visible.push({
            ...pin,
            timeOffset: pin.baseTime,
            key: `${pinIndex}`,
          })
        }
      })
      return visible
    }

    // Playback mode: normal looping behavior
    if (!songDuration) return []

    const visible = []

    basePins.forEach((pin, pinIndex) => {
      // Check the pin at multiple "virtual" positions (cycles)
      // This handles wrapping when the song loops
      for (let cycle = -1; cycle <= 2; cycle++) {
        const adjustedTime = pin.baseTime + (cycle * songDuration)
        const relativeBeat = adjustedTime - currentBeat

        // Only include if within visible window
        if (relativeBeat >= -0.5 && relativeBeat <= visibleBeats) {
          visible.push({
            ...pin,
            timeOffset: adjustedTime,
            key: `${pinIndex}-${cycle}`,
          })
        }
      }
    })

    return visible
  }, [basePins, songDuration, currentBeat, visibleBeats, isRecording])

  // Calculate Y position based on time
  // Playback: pins scroll down (future at top, strike zone at bottom)
  // Recording: pins scroll up (just played at bottom, past scrolls to top)
  const getYPercent = (pinTime) => {
    const relativeBeat = pinTime - currentBeat

    if (isRecording) {
      // Recording mode: relativeBeat 0 = bottom (90%), -visibleBeats = top (5%)
      // Notes appear at bottom when played and scroll upward
      return (1 + relativeBeat / visibleBeats) * 85 + 5
    }

    // Playback mode: Map to percentage: 0% = top (future), ~90% = bottom (strike zone)
    return ((visibleBeats - relativeBeat) / visibleBeats) * 85 + 5
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        minHeight: '100px',
      }}
    >
      {/* Pins - rendered as CSS circles */}
      {visiblePins.map((pin) => {
        const yPercent = getYPercent(pin.timeOffset)

        // Strike zone logic depends on mode
        // Playback: strike zone is at bottom (high y%)
        // Recording: newly played notes appear at bottom with glow, then fade as they scroll up
        const isAtStrike = isRecording
          ? yPercent > 85 && yPercent <= 92
          : yPercent > 88 && yPercent < 95
        const isNearStrike = isRecording
          ? yPercent > 75 && yPercent <= 92
          : yPercent > 82 && yPercent < 95

        // Size: normal 8px, near strike 10px, at strike 14px
        const size = isAtStrike ? 14 : isNearStrike ? 10 : 8

        return (
          <div
            key={pin.key}
            className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${pin.x}%`,
              top: `${yPercent}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: isRecording ? 'var(--color-record, var(--color-pin))' : 'var(--color-pin)',
              boxShadow: isAtStrike
                ? `0 0 12px ${isRecording ? 'var(--color-record, var(--color-pin))' : 'var(--color-pin)'}, 0 0 20px ${isRecording ? 'var(--color-record, var(--color-pin))' : 'var(--color-pin)'}`
                : isNearStrike
                  ? `0 0 8px ${isRecording ? 'var(--color-record, var(--color-pin))' : 'var(--color-pin)'}`
                  : 'none',
              transition: 'width 0.1s, height 0.1s, box-shadow 0.1s',
            }}
          />
        )
      })}

      {/* Empty state message */}
      {notes.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm"
          style={{ color: isRecordTab ? 'var(--color-record, var(--color-text-muted))' : 'var(--color-text-muted)' }}
        >
          {isRecordTab
            ? (isRecording ? 'Play notes to record...' : 'Press Record to begin')
            : 'Select a song to see pins'}
        </div>
      )}
    </div>
  )
}
