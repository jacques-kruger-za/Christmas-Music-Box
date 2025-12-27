import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Music Box Error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-8"
          style={{
            background: 'linear-gradient(135deg, var(--color-bg-gradient-start) 0%, var(--color-bg-gradient-end) 100%)',
          }}
        >
          <div
            className="max-w-md w-full p-8 rounded-xl text-center"
            style={{
              background: 'var(--color-panel)',
              border: '1px solid var(--color-panel-border)',
            }}
          >
            <div className="text-6xl mb-4">🎵</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              Oops! Something went wrong
            </h1>
            <p
              className="mb-6"
              style={{ color: 'var(--color-text-muted)' }}
            >
              The music box hit a wrong note. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                background: 'var(--color-accent)',
                color: '#000',
              }}
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary
                  className="cursor-pointer text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Technical details
                </summary>
                <pre
                  className="mt-2 p-2 rounded text-xs overflow-auto"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
