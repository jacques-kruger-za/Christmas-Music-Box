import { useMemo } from 'react'
import { NOTES } from '../data/constants'
import { getNotePosition } from '../utils/notePositions'

export default function Drum({ notes = [], currentTime = 0, tempo = 100, isPlaying = false }) {
  // Calculate visible time window (show ~4 beats ahead)
  const visibleBeats = 8
  const secondsPerBeat = 60 / tempo

  // Calculate pin positions
  const pins = useMemo(() => {
    if (!notes.length) return []

    return notes.map(({ note, time }) => {
      const noteIndex = NOTES.indexOf(note)
      if (noteIndex === -1) return null

      return {
        noteIndex,
        time,
        x: getNotePosition(noteIndex), // Use same positioning as piano/comb
        timeOffset: time, // Time in beats
      }
    }).filter(Boolean)
  }, [notes])

  // Filter pins to show only those within the visible window
  const currentBeat = currentTime / secondsPerBeat
  const visiblePins = pins.filter(pin => {
    const relativeBeat = pin.timeOffset - currentBeat
    return relativeBeat >= -0.5 && relativeBeat <= visibleBeats
  })

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
      {/* Strike zone indicator */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '90%',
          height: '2px',
          background: 'var(--color-accent)',
          opacity: 0.5,
        }}
      />

      {/* Pins - rendered as CSS circles */}
      {visiblePins.map((pin, i) => {
        const yPercent = getYPercent(pin.timeOffset)
        const isAtStrike = yPercent > 85 && yPercent < 95
        const isNearStrike = yPercent > 75 && yPercent < 95

        // Size: normal 8px, near strike 10px, at strike 14px
        const size = isAtStrike ? 14 : isNearStrike ? 10 : 8

        return (
          <div
            key={`${pin.noteIndex}-${pin.timeOffset}-${i}`}
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
      {pins.length === 0 && (
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
