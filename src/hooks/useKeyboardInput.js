import { useState, useEffect, useCallback, useRef } from 'react'
import { KEYBOARD_MAP } from '../data/constants'

export function useKeyboardInput(onNotePlay, disabled = false) {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const pressedKeysRef = useRef(new Set())

  const handleKeyDown = useCallback((e) => {
    if (disabled) return

    // Ignore if typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return
    }

    const key = e.key
    const noteIndex = KEYBOARD_MAP[key]

    if (noteIndex !== undefined && !pressedKeysRef.current.has(key)) {
      e.preventDefault()
      pressedKeysRef.current.add(key)
      setPressedKeys(new Set(pressedKeysRef.current))

      if (onNotePlay) {
        onNotePlay(noteIndex)
      }
    }
  }, [onNotePlay, disabled])

  const handleKeyUp = useCallback((e) => {
    const key = e.key

    if (pressedKeysRef.current.has(key)) {
      pressedKeysRef.current.delete(key)
      setPressedKeys(new Set(pressedKeysRef.current))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Convert pressed keys to pressed note indices
  const pressedNoteIndices = new Set(
    Array.from(pressedKeys)
      .map(key => KEYBOARD_MAP[key])
      .filter(index => index !== undefined)
  )

  return { pressedKeys, pressedNoteIndices }
}
