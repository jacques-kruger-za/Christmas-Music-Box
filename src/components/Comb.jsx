import { NOTES } from '../data/constants'

// Export these for piano alignment
export const COMB_PADDING_LEFT_PERCENT = 4 // Where first tooth starts
export const COMB_PADDING_RIGHT_PERCENT = 4 // Space after last tooth

export default function Comb({ activeTeeth = new Set() }) {
  const numTeeth = NOTES.length // 21 teeth

  // Comb dimensions (in viewBox units)
  const viewBoxWidth = 100
  const viewBoxHeight = 50

  // Mount plate extends past teeth on both sides
  const plateMargin = 4 // How far plate extends past teeth (matches padding export)
  const teethStartX = plateMargin // Where first tooth starts
  const teethEndX = viewBoxWidth - plateMargin // Where last tooth ends
  const teethSpan = teethEndX - teethStartX

  // Tooth positioning - evenly distributed within teeth area
  const toothGap = 0.5 // Gap between teeth
  const totalGaps = (numTeeth - 1) * toothGap
  const toothWidth = (teethSpan - totalGaps) / numTeeth

  // Tooth lengths - longer on left (low pitch), shorter on right (high pitch)
  const maxToothLength = 32 // Longest tooth (leftmost, C4)
  const minToothLength = 12 // Shortest tooth (rightmost, G#5)

  // Base bar dimensions
  const baseBottom = viewBoxHeight - 2

  // Calculate tooth length based on index (0 = longest, 20 = shortest)
  const getToothLength = (index) => {
    const t = index / (numTeeth - 1) // 0 to 1
    return maxToothLength - t * (maxToothLength - minToothLength)
  }

  // Calculate tooth X position (left edge)
  const getToothX = (index) => {
    return teethStartX + index * (toothWidth + toothGap)
  }

  // The teeth all start at the top (Y = 2) and extend downward
  const teethTop = 2

  // Calculate the Y position where each tooth ends (bottom of tooth)
  const getToothBottom = (index) => {
    return teethTop + getToothLength(index)
  }

  // Simple 4-point trapezoid for mount base
  // Top-left, top-right, bottom-right, bottom-left
  const firstToothBottom = getToothBottom(0)
  const lastToothBottom = getToothBottom(numTeeth - 1)
  const baseTopLeft = firstToothBottom + 1
  const baseTopRight = lastToothBottom + 1

  const trapezoidPoints = `0,${baseTopLeft} ${viewBoxWidth},${baseTopRight} ${viewBoxWidth},${baseBottom} 0,${baseBottom}`

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        style={{ height: '250px' }}
        preserveAspectRatio="none"
      >
        {/* Teeth - drawn first so base appears in front */}
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

        {/* Simple flat trapezoid mount base - drawn after teeth (in front) */}
        <polygon
          points={trapezoidPoints}
          style={{ fill: 'var(--color-comb)' }}
        />

        {/* Top edge highlight on mount base */}
        <line
          x1="0"
          y1={baseTopLeft}
          x2={viewBoxWidth}
          y2={baseTopRight}
          style={{
            stroke: 'rgba(255,255,255,0.15)',
            strokeWidth: 0.3,
          }}
        />

        {/* Bottom edge shadow on mount base */}
        <line
          x1="0"
          y1={baseBottom}
          x2={viewBoxWidth}
          y2={baseBottom}
          style={{
            stroke: 'rgba(0,0,0,0.3)',
            strokeWidth: 0.3,
          }}
        />
      </svg>

      {/* Mounting screws - rendered as CSS elements to maintain circular shape */}
      <div
        className="absolute rounded-full"
        style={{
          width: '12px',
          height: '12px',
          left: '1.5%',
          bottom: '12%',
          background: 'radial-gradient(circle at 30% 30%, #666, #333)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.3)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '12px',
          height: '12px',
          right: '1.5%',
          bottom: '12%',
          background: 'radial-gradient(circle at 30% 30%, #666, #333)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  )
}
