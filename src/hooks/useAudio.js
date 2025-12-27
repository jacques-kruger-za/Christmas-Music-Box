import { useState, useCallback, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { NOTES, DEFAULT_NOTE_DURATION } from '../data/constants'

export function useAudio() {
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMetronomeRunning, setIsMetronomeRunning] = useState(false)
  const synthRef = useRef(null)
  const reverbRef = useRef(null)
  const clickSynthRef = useRef(null)
  const scheduledEventsRef = useRef([])
  const playbackCallbackRef = useRef(null)
  const stopRef = useRef(null)
  const metronomeLoopRef = useRef(null)

  // Clear scheduled events (no dependencies - uses refs only)
  const clearScheduledEvents = useCallback(() => {
    scheduledEventsRef.current.forEach(id => {
      Tone.Transport.clear(id)
    })
    scheduledEventsRef.current = []
  }, [])

  // Stop playback - assigned to ref to avoid circular deps in scheduleNotes
  const stop = useCallback(() => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    Tone.Transport.loop = false
    clearScheduledEvents()
    setIsPlaying(false)
    playbackCallbackRef.current = null
  }, [clearScheduledEvents])

  // Keep stopRef updated for use in scheduled callbacks
  useEffect(() => {
    stopRef.current = stop
  }, [stop])

  // Initialize synth on first user interaction
  const initAudio = useCallback(async () => {
    if (synthRef.current) return true

    try {
      await Tone.start()

      // Create reverb for music box sound
      reverbRef.current = new Tone.Reverb({
        decay: 2,
        wet: 0.3,
      }).toDestination()
      await reverbRef.current.generate()

      // Create polyphonic synth with music box timbre
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'triangle',
        },
        envelope: {
          attack: 0.002,
          decay: 0.3,
          sustain: 0.1,
          release: 1.5,
        },
        volume: -6,
      }).connect(reverbRef.current)

      setIsReady(true)
      return true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      return false
    }
  }, [])

  // Play a single note
  const playNote = useCallback(async (noteIndex, duration = DEFAULT_NOTE_DURATION) => {
    if (!synthRef.current) {
      const initialized = await initAudio()
      if (!initialized) return
    }

    const note = NOTES[noteIndex]
    if (note) {
      synthRef.current.triggerAttackRelease(note, duration)
    }
  }, [initAudio])

  // Schedule notes for playback
  const scheduleNotes = useCallback((notes, tempo, onNotePlay, onComplete, loop = false) => {
    if (!synthRef.current) return

    // Clear any existing scheduled events
    clearScheduledEvents()

    const secondsPerBeat = 60 / tempo
    playbackCallbackRef.current = onNotePlay

    Tone.Transport.bpm.value = tempo
    Tone.Transport.cancel()

    // Find the total duration of the song
    let maxTime = 0
    notes.forEach(({ time }) => {
      if (time > maxTime) maxTime = time
    })
    const songDuration = (maxTime + 1) * secondsPerBeat

    // Schedule each note
    notes.forEach(({ note, time, duration = DEFAULT_NOTE_DURATION }) => {
      const noteIndex = NOTES.indexOf(note)
      if (noteIndex === -1) return

      const eventId = Tone.Transport.schedule((t) => {
        synthRef.current.triggerAttackRelease(note, duration, t)
        // Callback for visual feedback (runs slightly before audio for visual sync)
        Tone.Draw.schedule(() => {
          if (playbackCallbackRef.current) {
            playbackCallbackRef.current(noteIndex)
          }
        }, t)
      }, time * secondsPerBeat)

      scheduledEventsRef.current.push(eventId)
    })

    // Schedule song end or loop
    if (loop) {
      Tone.Transport.loop = true
      Tone.Transport.loopEnd = songDuration
    } else {
      Tone.Transport.loop = false
      const endEventId = Tone.Transport.schedule(() => {
        Tone.Draw.schedule(() => {
          stopRef.current?.()
          if (onComplete) onComplete()
        }, Tone.now())
      }, songDuration)
      scheduledEventsRef.current.push(endEventId)
    }

    Tone.Transport.start()
    setIsPlaying(true)
  }, [clearScheduledEvents])

  // Pause playback
  const pause = useCallback(() => {
    Tone.Transport.pause()
    setIsPlaying(false)
  }, [])

  // Resume playback
  const resume = useCallback(() => {
    Tone.Transport.start()
    setIsPlaying(true)
  }, [])

  // Get current transport time
  const getCurrentTime = useCallback(() => {
    return Tone.Transport.seconds
  }, [])

  // Play metronome click
  const playClick = useCallback(async (accent = false) => {
    if (!clickSynthRef.current) {
      clickSynthRef.current = new Tone.MembraneSynth({
        volume: -10,
        pitchDecay: 0.008,
        octaves: 2,
        envelope: {
          attack: 0.001,
          decay: 0.3,
          sustain: 0,
          release: 0.1,
        },
      }).toDestination()
    }

    clickSynthRef.current.volume.value = accent ? -6 : -12
    clickSynthRef.current.triggerAttackRelease(accent ? 'C3' : 'C4', '32n')
  }, [])

  // Start metronome
  const startMetronome = useCallback(async (tempo, timeSignature = '4/4') => {
    if (!synthRef.current) {
      const initialized = await initAudio()
      if (!initialized) return
    }

    // Stop any existing metronome
    if (metronomeLoopRef.current) {
      metronomeLoopRef.current.dispose()
    }

    // Create click synth if needed
    if (!clickSynthRef.current) {
      clickSynthRef.current = new Tone.MembraneSynth({
        volume: -10,
        pitchDecay: 0.008,
        octaves: 2,
        envelope: {
          attack: 0.001,
          decay: 0.3,
          sustain: 0,
          release: 0.1,
        },
      }).toDestination()
    }

    Tone.Transport.bpm.value = tempo

    // Parse time signature for accent pattern
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0])
    let beatCount = 0

    // Create a loop for the metronome
    metronomeLoopRef.current = new Tone.Loop((time) => {
      const isAccent = beatCount % beatsPerMeasure === 0
      clickSynthRef.current.volume.value = isAccent ? -6 : -12
      clickSynthRef.current.triggerAttackRelease(isAccent ? 'C3' : 'C4', '32n', time)
      beatCount++
    }, '4n')

    metronomeLoopRef.current.start(0)
    Tone.Transport.start()
    setIsMetronomeRunning(true)
  }, [initAudio])

  // Stop metronome
  const stopMetronome = useCallback(() => {
    if (metronomeLoopRef.current) {
      metronomeLoopRef.current.stop()
      metronomeLoopRef.current.dispose()
      metronomeLoopRef.current = null
    }
    Tone.Transport.stop()
    setIsMetronomeRunning(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
      stopMetronome()
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
      }
      if (clickSynthRef.current) {
        clickSynthRef.current.dispose()
      }
    }
  }, [stop, stopMetronome])

  return {
    isReady,
    isPlaying,
    isMetronomeRunning,
    initAudio,
    playNote,
    scheduleNotes,
    stop,
    pause,
    resume,
    getCurrentTime,
    playClick,
    startMetronome,
    stopMetronome,
  }
}
