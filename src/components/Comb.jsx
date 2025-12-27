import { NOTES, BLACK_KEY_INDICES } from '../data/constants'
import { getNotePosition } from '../utils/notePositions'

export default function Comb({ activeTeeth = new Set() }) {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 100 28"
        className="w-full"
        style={{ height: '80px' }}
        preserveAspectRatio="none"
      >
        {/* Base bar - full width */}
        <rect
          x="0"
          y="22"
          width="100"
          height="6"
          rx="0.5"
          style={{ fill: 'var(--color-comb)' }}
        />

        {/* Teeth - positioned to match piano keys */}
        {NOTES.map((_, i) => {
          const isActive = activeTeeth.has(i)
          const isBlackKey = BLACK_KEY_INDICES.includes(i)

          // Get position matching piano key
          const centerX = getNotePosition(i)

          // Tooth dimensions - black keys slightly shorter
          const toothWidth = 2
          const toothHeight = isBlackKey ? 14 : 18
          const x = centerX - toothWidth / 2

          return (
            <g key={i}>
              {/* Tooth */}
              <rect
                x={x}
                y={22 - toothHeight}
                width={toothWidth}
                height={toothHeight}
                rx="0.3"
                className={isActive ? 'tooth-active' : ''}
                style={{
                  fill: isActive ? 'var(--color-comb-light)' : 'var(--color-comb)',
                  transition: 'fill 0.1s',
                }}
              />
              {/* Highlight line on tooth */}
              <rect
                x={x + 0.3}
                y={22 - toothHeight + 0.5}
                width={0.5}
                height={toothHeight - 1}
                rx="0.15"
                style={{
                  fill: 'rgba(255,255,255,0.2)',
                }}
              />
            </g>
          )
        })}

        {/* Decorative screws */}
        <circle cx="2" cy="25" r="1.5" style={{ fill: '#555' }} />
        <circle cx="2" cy="25" r="0.7" style={{ fill: '#333' }} />
        <circle cx="98" cy="25" r="1.5" style={{ fill: '#555' }} />
        <circle cx="98" cy="25" r="0.7" style={{ fill: '#333' }} />
      </svg>
    </div>
  )
}
