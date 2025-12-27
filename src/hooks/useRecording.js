import { useState, useCallback, useRef } from 'react'
import { NOTES, DEFAULT_NOTE_DURATION } from '../data/constants'

export function useRecording(tempo = 100) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState([])
  const startTimeRef = useRef(null)
  const notesRef = useRef([])

  const startRecording = useCallback(() => {
    notesRef.current = []
    setRecordedNotes([])
    startTimeRef.current = Date.now()
    setIsRecording(true)
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    setRecordedNotes([...notesRef.current])
    return notesRef.current
  }, [])

  const recordNote = useCallback((noteIndex) => {
    if (!isRecording || startTimeRef.current === null) return

    const elapsedMs = Date.now() - startTimeRef.current
    const secondsPerBeat = 60 / tempo
    const timeInBeats = elapsedMs / 1000 / secondsPerBeat

    const noteData = {
      note: NOTES[noteIndex],
      time: timeInBeats,
      duration: DEFAULT_NOTE_DURATION,
    }

    notesRef.current.push(noteData)
    setRecordedNotes([...notesRef.current])
  }, [isRecording, tempo])

  const clearRecording = useCallback(() => {
    notesRef.current = []
    setRecordedNotes([])
    startTimeRef.current = null
  }, [])

  const createSong = useCallback((name, timeSignature = '4/4') => {
    return {
      name,
      tempo,
      timeSignature,
      notes: [...notesRef.current],
      createdAt: new Date().toISOString(),
      isUserRecording: true,
    }
  }, [tempo])

  return {
    isRecording,
    recordedNotes,
    startRecording,
    stopRecording,
    recordNote,
    clearRecording,
    createSong,
  }
}
