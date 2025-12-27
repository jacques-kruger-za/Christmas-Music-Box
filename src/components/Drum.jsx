import { useMemo } from 'react'
import { NOTES } from '../data/constants'
import { getNotePosition } from '../utils/notePositions'

export default function Drum({ notes = [], currentTime = 0, tempo = 100, isPlaying = false }) {
  // Calculate visible time window (show ~8 beats ahead)
  const visibleBeats = 8
  const secondsPerBeat = 60 / tempo

  // Calculate song duration
  const songDuration = useMemo(() => {
    if (!notes.length) return 0
    let maxTime = 0
    notes.forEach(({ time }) => {
      if (time > maxTime) maxTime = time
    })
    return maxTime + 1 // Add 1 beat buffer after last note
  }, [notes])

  // Create base pins
  const basePins = useMemo(() => {
    if (!notes.length) return []

    return notes.map(({ note, time }) => {
      const noteIndex = NOTES.indexOf(note)
      if (noteIndex === -1) return null

      return {
        noteIndex,
        baseTime: time,
        x: getNotePosition(noteIndex),
      }
    }).filter(Boolean)
  }, [notes])

  // Calculate current beat position
  const currentBeat = currentTime / secondsPerBeat

  // Generate visible pins including lookahead copies for seamless looping
  // This simulates a cylindrical drum that wraps around
  const visiblePins = useMemo(() => {
    if (!basePins.length || !songDuration) return []

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
  }, [basePins, songDuration, currentBeat, visibleBeats])

  // Calculate Y position based on time (pins scroll down)
  const getYPercent = (pinTime) => {
    const relativeBeat = pinTime - currentBeat
    // Map to percentage: 0% = top (future), ~90% = bottom (strike zone)
    return ((visibleBeats - relativeBeat) / visibleBeats) * 85 + 5
  }

  return (
    <div
      className="w-full rounded-lg relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
        height: '160px',
      }}
    >
      {/* Pins - rendered as CSS circles */}
      {visiblePins.map((pin) => {
        const yPercent = getYPercent(pin.timeOffset)
        const isAtStrike = yPercent > 85 && yPercent < 95
        const isNearStrike = yPercent > 75 && yPercent < 95

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
              background: 'var(--color-pin)',
              boxShadow: isAtStrike
                ? '0 0 12px var(--color-pin), 0 0 20px var(--color-pin)'
                : isNearStrike
                  ? '0 0 8px var(--color-pin)'
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
          style={{ color: 'var(--color-text-muted)' }}
        >
          Select a song to see pins
        </div>
      )}
    </div>
  )
}
