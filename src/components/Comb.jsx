import { NOTES } from '../data/constants'

export default function Comb({ activeTeeth = new Set() }) {
  const numTeeth = NOTES.length // 21 teeth

  // Comb dimensions (in viewBox units)
  const viewBoxWidth = 100
  const viewBoxHeight = 50

  // Mount plate extends past teeth on both sides
  const plateMargin = 3 // How far plate extends past teeth
  const teethStartX = plateMargin + 1 // Where first tooth starts
  const teethEndX = viewBoxWidth - plateMargin - 1 // Where last tooth ends
  const teethSpan = teethEndX - teethStartX

  // Tooth positioning - evenly distributed within teeth area
  const toothGap = 0.6 // Gap between teeth
  const totalGaps = (numTeeth - 1) * toothGap
  const toothWidth = (teethSpan - totalGaps) / numTeeth

  // Tooth lengths - longer on left (low pitch), shorter on right (high pitch)
  const maxToothLength = 32 // Longest tooth (leftmost, C4)
  const minToothLength = 12 // Shortest tooth (rightmost, G#5)

  // Base bar dimensions
  const baseBottom = viewBoxHeight - 2 // Bottom of base bar

  // Calculate tooth length based on index (0 = longest, 20 = shortest)
  const getToothLength = (index) => {
    const t = index / (numTeeth - 1) // 0 to 1
    return maxToothLength - t * (maxToothLength - minToothLength)
  }

  // Calculate tooth X position (left edge)
  const getToothX = (index) => {
    return teethStartX + index * (toothWidth + toothGap)
  }

  // Export tooth positions for piano alignment (as percentage of total width)
  // First tooth left edge and last tooth right edge
  const firstToothLeftPercent = (teethStartX / viewBoxWidth) * 100
  const lastToothRightPercent = ((teethStartX + (numTeeth - 1) * (toothWidth + toothGap) + toothWidth) / viewBoxWidth) * 100

  // The teeth all start at the top (Y = 2) and extend downward
  const teethTop = 2

  // Calculate the Y position where each tooth ends (bottom of tooth)
  const getToothBottom = (index) => {
    return teethTop + getToothLength(index)
  }

  // Create the trapezoidal base polygon - extends past teeth on both sides
  const createBasePolygon = () => {
    const points = []

    // Bottom-left corner (full width)
    points.push(`0,${baseBottom}`)

    // Up left side to meet the angled top
    const firstToothBottom = getToothBottom(0)
    points.push(`0,${firstToothBottom + 2}`) // Slightly below first tooth

    // Trace along just below the teeth bottoms (creating the angled top edge)
    for (let i = 0; i < numTeeth; i++) {
      const x = getToothX(i)
      const toothBottom = getToothBottom(i)
      // Add a small gap between tooth bottom and base top
      points.push(`${x - 0.2},${toothBottom + 0.5}`)
      points.push(`${x + toothWidth + 0.2},${toothBottom + 0.5}`)
    }

    // Right side - continue to full width
    const lastToothBottom = getToothBottom(numTeeth - 1)
    points.push(`${viewBoxWidth},${lastToothBottom + 2}`) // Slightly below last tooth

    // Bottom-right corner
    points.push(`${viewBoxWidth},${baseBottom}`)

    return points.join(' ')
  }

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        style={{ height: '250px' }} // 2.5x the original 100px
        preserveAspectRatio="none"
      >
        {/* Trapezoidal base/mount plate - extends full width */}
        <polygon
          points={createBasePolygon()}
          style={{ fill: 'var(--color-comb)' }}
        />

        {/* Bottom edge of mount plate */}
        <rect
          x="0"
          y={baseBottom}
          width={viewBoxWidth}
          height="2"
          style={{ fill: 'var(--color-comb)' }}
        />

        {/* Top highlight on mount plate */}
        <line
          x1="0"
          y1={getToothBottom(0) + 2.5}
          x2={viewBoxWidth}
          y2={getToothBottom(numTeeth - 1) + 2.5}
          style={{
            stroke: 'rgba(255,255,255,0.1)',
            strokeWidth: 0.5,
          }}
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
                x={x + 0.15}
                y={teethTop + 0.5}
                width={0.35}
                height={toothLength - 1}
                rx="0.1"
                style={{
                  fill: 'rgba(255,255,255,0.15)',
                }}
              />
              {/* Shadow line on tooth (right edge) */}
              <rect
                x={x + toothWidth - 0.4}
                y={teethTop + 0.5}
                width={0.25}
                height={toothLength - 1}
                rx="0.1"
                style={{
                  fill: 'rgba(0,0,0,0.2)',
                }}
              />
            </g>
          )
        })}

        {/* Mounting screws on the extended plate areas */}
        <circle cx={plateMargin / 2 + 0.5} cy={baseBottom - 2} r="1.5" style={{ fill: '#555' }} />
        <circle cx={plateMargin / 2 + 0.5} cy={baseBottom - 2} r="0.7" style={{ fill: '#333' }} />
        <circle cx={viewBoxWidth - plateMargin / 2 - 0.5} cy={baseBottom - 2} r="1.5" style={{ fill: '#555' }} />
        <circle cx={viewBoxWidth - plateMargin / 2 - 0.5} cy={baseBottom - 2} r="0.7" style={{ fill: '#333' }} />
      </svg>
    </div>
  )
}

// Export alignment values for piano (teeth span from ~4% to ~96% of width)
export const COMB_TEETH_PADDING_PERCENT = 4 // Approximate padding on each side
