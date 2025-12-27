import { NOTES } from '../data/constants'

export default function Comb({ activeTeeth = new Set() }) {
  const numTeeth = NOTES.length // 21 teeth

  // Comb dimensions (in viewBox units)
  const viewBoxWidth = 100
  const viewBoxHeight = 50

  // Tooth positioning - evenly distributed across full width
  const toothGap = 0.8 // Gap between teeth
  const totalGaps = (numTeeth - 1) * toothGap
  const availableWidth = viewBoxWidth - 2 // 1 unit margin on each side
  const toothWidth = (availableWidth - totalGaps) / numTeeth

  // Tooth lengths - longer on left (low pitch), shorter on right (high pitch)
  const maxToothLength = 32 // Longest tooth (leftmost, C4)
  const minToothLength = 12 // Shortest tooth (rightmost, G#5)

  // Base bar dimensions
  const baseBottom = viewBoxHeight - 2 // Bottom of base bar
  const baseHeight = 8 // Fixed height of base bar at bottom

  // Calculate tooth length based on index (0 = longest, 20 = shortest)
  const getToothLength = (index) => {
    const t = index / (numTeeth - 1) // 0 to 1
    return maxToothLength - t * (maxToothLength - minToothLength)
  }

  // Calculate tooth X position (left edge)
  const getToothX = (index) => {
    return 1 + index * (toothWidth + toothGap)
  }

  // The teeth all start at the top (Y = 2) and extend downward
  const teethTop = 2

  // Calculate the Y position where each tooth ends (bottom of tooth)
  const getToothBottom = (index) => {
    return teethTop + getToothLength(index)
  }

  // The trapezoidal base connects the tooth bottoms to the base bar
  // Create the polygon points for the trapezoidal shape
  const createBasePolygon = () => {
    const points = []

    // Start at bottom-left corner of base bar
    points.push(`1,${baseBottom}`)

    // Go to top-left (bottom of first tooth)
    const firstToothBottom = getToothBottom(0)
    points.push(`1,${firstToothBottom}`)

    // Trace along the bottom of all teeth (creating the angled top edge)
    for (let i = 0; i < numTeeth; i++) {
      const x = getToothX(i)
      const toothBottom = getToothBottom(i)
      points.push(`${x},${toothBottom}`)
      points.push(`${x + toothWidth},${toothBottom}`)
    }

    // Go to top-right (bottom of last tooth)
    const lastToothX = getToothX(numTeeth - 1)
    const lastToothBottom = getToothBottom(numTeeth - 1)
    points.push(`${lastToothX + toothWidth},${lastToothBottom}`)

    // Go to bottom-right corner
    points.push(`${viewBoxWidth - 1},${lastToothBottom}`)
    points.push(`${viewBoxWidth - 1},${baseBottom}`)

    // Close the polygon
    points.push(`1,${baseBottom}`)

    return points.join(' ')
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        style={{ height: '100px' }}
        preserveAspectRatio="none"
      >
        {/* Trapezoidal base bar - drawn first so teeth appear on top */}
        <polygon
          points={createBasePolygon()}
          style={{ fill: 'var(--color-comb)' }}
        />

        {/* Bottom edge highlight */}
        <rect
          x="1"
          y={baseBottom - 1}
          width={viewBoxWidth - 2}
          height="1"
          style={{ fill: 'rgba(255,255,255,0.1)' }}
        />

        {/* Teeth - all aligned at top, varying lengths */}
        {NOTES.map((_, i) => {
          const isActive = activeTeeth.has(i)
          const x = getToothX(i)
          const toothLength = getToothLength(i)

          return (
            <g key={i}>
              {/* Main tooth */}
              <rect
                x={x}
                y={teethTop}
                width={toothWidth}
                height={toothLength}
                rx="0.3"
                className={isActive ? 'tooth-active' : ''}
                style={{
                  fill: isActive ? 'var(--color-comb-light)' : 'var(--color-comb-tooth)',
                  filter: isActive ? 'drop-shadow(0 0 3px var(--color-accent))' : 'none',
                  transition: 'fill 0.1s, filter 0.1s',
                }}
              />
              {/* Highlight line on tooth (left edge) */}
              <rect
                x={x + 0.2}
                y={teethTop + 0.5}
                width={0.4}
                height={toothLength - 1}
                rx="0.1"
                style={{
                  fill: 'rgba(255,255,255,0.15)',
                }}
              />
              {/* Shadow line on tooth (right edge) */}
              <rect
                x={x + toothWidth - 0.5}
                y={teethTop + 0.5}
                width={0.3}
                height={toothLength - 1}
                rx="0.1"
                style={{
                  fill: 'rgba(0,0,0,0.2)',
                }}
              />
            </g>
          )
        })}

        {/* Mounting screws */}
        <circle cx="4" cy={baseBottom - 3} r="1.8" style={{ fill: '#555' }} />
        <circle cx="4" cy={baseBottom - 3} r="0.9" style={{ fill: '#333' }} />
        <circle cx={viewBoxWidth - 4} cy={baseBottom - 3} r="1.8" style={{ fill: '#555' }} />
        <circle cx={viewBoxWidth - 4} cy={baseBottom - 3} r="0.9" style={{ fill: '#333' }} />
      </svg>
    </div>
  )
}
