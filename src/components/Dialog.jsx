import { useState, useEffect, useRef } from 'react'

export default function Dialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'confirm', // 'confirm' | 'input'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  inputPlaceholder = '',
  inputDefaultValue = '',
  danger = false,
}) {
  const [inputValue, setInputValue] = useState(inputDefaultValue)
  const inputRef = useRef(null)

  // Reset input value when dialog opens
  useEffect(() => {
    if (isOpen) {
      setInputValue(inputDefaultValue)
      // Focus input after a short delay to ensure it's rendered
      if (type === 'input') {
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
  }, [isOpen, inputDefaultValue, type])

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter' && type === 'input' && inputValue.trim()) {
        onConfirm(inputValue.trim())
      } else if (e.key === 'Enter' && type === 'confirm') {
        onConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm, type, inputValue])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (type === 'input') {
      if (inputValue.trim()) {
        onConfirm(inputValue.trim())
      }
    } else {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="p-8 rounded-2xl text-center max-w-sm mx-4 w-full"
        style={{
          background: 'var(--color-panel)',
          border: '1px solid var(--color-panel-border)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: danger ? 'var(--color-record)' : 'var(--color-accent)' }}
        >
          {title}
        </h2>

        {/* Message */}
        {message && (
          <p
            className="mb-6 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {message}
          </p>
        )}

        {/* Input field for input type */}
        {type === 'input' && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full p-3 rounded-lg mb-6 text-white"
            style={{
              background: 'var(--color-button-bg)',
              border: '1px solid var(--color-button-border)',
            }}
          />
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-80"
            style={{
              background: 'var(--color-button-bg)',
              border: '1px solid var(--color-button-border)',
              color: 'var(--color-text)',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={type === 'input' && !inputValue.trim()}
            className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: danger ? 'var(--color-record)' : 'var(--color-accent)',
              color: danger ? '#fff' : '#000',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
