import ThemeSelector from './ThemeSelector'

export default function Header() {
  return (
    <header className="text-center py-6">
      <h1
        className="text-4xl md:text-5xl font-display italic"
        style={{ color: 'var(--color-accent)' }}
      >
        Christmas Music Box
      </h1>
    </header>
  )
}
