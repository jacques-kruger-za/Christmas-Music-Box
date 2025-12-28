import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Header from './components/Header'
import ControlPanel from './components/ControlPanel'
import MusicBox from './components/MusicBox'
import { useAudio } from './hooks/useAudio'
import { useKeyboardInput } from './hooks/useKeyboardInput'
import { useRecording } from './hooks/useRecording'
import { songs as defaultSongs } from './data/songs'
import { loadRecordings, saveRecording, exportRecordings, importRecordings } from './utils/storage'
import { DEFAULT_TEMPO, TEMPO_PRESETS } from './data/constants'

export default function App() {
  // Audio
  const {
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
    startMetronome,
    stopMetronome,
  } = useAudio()

  // Track if playback is paused (vs stopped)
  const [isPaused, setIsPaused] = useState(false)

  // State
  const [recordings, setRecordings] = useState([])
  const [selectedSong, setSelectedSong] = useState('')
  const [tempo, setTempo] = useState(DEFAULT_TEMPO)
  const [repeat, setRepeat] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())
  const [currentTime, setCurrentTime] = useState(0)

  // Recording state
  const [recordingTempo, setRecordingTempo] = useState(TEMPO_PRESETS.moderato.bpm)
  const [timeSignature, setTimeSignature] = useState('4/4')
  const [metronome, setMetronome] = useState(false)

  const { isRecording, startRecording, stopRecording, recordNote, createSong } = useRecording(recordingTempo)

  // Time update interval
  const timeIntervalRef = useRef(null)

  // Load recordings on mount
  useEffect(() => {
    setRecordings(loadRecordings())
  }, [])

  // Handle note play (from keyboard or click)
  const handleNotePlay = useCallback(async (noteIndex) => {
    await initAudio()
    playNote(noteIndex)

    // Visual feedback
    setActiveNotes(prev => new Set([...prev, noteIndex]))
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev)
        next.delete(noteIndex)
        return next
      })
    }, 200)

    // Record if recording
    if (isRecording) {
      recordNote(noteIndex)
    }
  }, [initAudio, playNote, isRecording, recordNote])

  // Keyboard input
  const { pressedNoteIndices } = useKeyboardInput(handleNotePlay, false)

  // Combine pressed keys with playback active notes
  const combinedActiveNotes = new Set([...activeNotes, ...pressedNoteIndices])

  // Get current song - memoized to avoid dependency issues
  const allSongs = useMemo(() => [...defaultSongs, ...recordings], [recordings])
  const currentSong = useMemo(() => allSongs.find(s => s.name === selectedSong), [allSongs, selectedSong])

  // Handle song selection
  const handleSelectSong = useCallback((songName) => {
    setSelectedSong(songName)
    const song = allSongs.find(s => s.name === songName)
    if (song) {
      setTempo(song.tempo)
    }
  }, [allSongs])

  // Handle playback
  const handlePlay = useCallback(async () => {
    if (!currentSong) return

    // If paused, resume instead of starting fresh
    if (isPaused) {
      resume()
      setIsPaused(false)
      timeIntervalRef.current = setInterval(() => {
        setCurrentTime(getCurrentTime())
      }, 50)
      return
    }

    await initAudio()
    setCurrentTime(0)

    // Start time tracking
    timeIntervalRef.current = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 50)

    scheduleNotes(
      currentSong.notes,
      tempo,
      (noteIndex) => {
        setActiveNotes(prev => new Set([...prev, noteIndex]))
        setTimeout(() => {
          setActiveNotes(prev => {
            const next = new Set(prev)
            next.delete(noteIndex)
            return next
          })
        }, 200)
      },
      () => {
        // On complete
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current)
        }
        setCurrentTime(0)
        setActiveNotes(new Set())
        setIsPaused(false)
      },
      repeat
    )
  }, [currentSong, tempo, repeat, isPaused, initAudio, scheduleNotes, getCurrentTime, resume])

  // Handle pause
  const handlePause = useCallback(() => {
    pause()
    setIsPaused(true)
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
    }
  }, [pause])

  // Handle stop
  const handleStop = useCallback(() => {
    stop()
    setIsPaused(false)
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current)
    }
    setCurrentTime(0)
    setActiveNotes(new Set())
  }, [stop])

  // Handle recording start
  const handleStartRecording = useCallback(async () => {
    await initAudio()

    // Start metronome if enabled
    if (metronome) {
      startMetronome(recordingTempo, timeSignature)
    }

    startRecording()
  }, [initAudio, startRecording, metronome, startMetronome, recordingTempo, timeSignature])

  // Handle recording stop
  const handleStopRecording = useCallback(() => {
    // Stop metronome if running
    if (isMetronomeRunning) {
      stopMetronome()
    }

    const notes = stopRecording()

    if (notes.length > 0) {
      const name = prompt('Enter a name for your recording:')
      if (name) {
        const song = createSong(name, timeSignature)
        saveRecording(song)
        setRecordings(loadRecordings())
      }
    }
  }, [stopRecording, createSong, timeSignature, isMetronomeRunning, stopMetronome])

  // Handle export
  const handleExport = useCallback(() => {
    exportRecordings()
  }, [])

  // Handle import
  const handleImport = useCallback(async (file) => {
    try {
      const count = await importRecordings(file)
      setRecordings(loadRecordings())
      alert(`Successfully imported ${count} recording(s)`)
    } catch (error) {
      alert(`Import failed: ${error.message}`)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 pb-8 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-[380px_1fr] gap-6 items-stretch">
          {/* Control Panel */}
          <ControlPanel
            songs={defaultSongs}
            recordings={recordings}
            selectedSong={selectedSong}
            onSelectSong={handleSelectSong}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            isPlaying={isPlaying}
            isPaused={isPaused}
            tempo={tempo}
            onTempoChange={setTempo}
            repeat={repeat}
            onRepeatChange={setRepeat}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            recordingTempo={recordingTempo}
            onRecordingTempoChange={setRecordingTempo}
            timeSignature={timeSignature}
            onTimeSignatureChange={setTimeSignature}
            metronome={metronome}
            onMetronomeChange={setMetronome}
            onExport={handleExport}
            onImport={handleImport}
          />

          {/* Music Box */}
          <MusicBox
            notes={currentSong?.notes || []}
            currentTime={currentTime}
            tempo={tempo}
            isPlaying={isPlaying}
            activeNotes={combinedActiveNotes}
            onNotePlay={handleNotePlay}
          />
        </div>
      </main>

      {/* Audio init prompt */}
      {!isReady && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="p-8 rounded-2xl text-center max-w-sm mx-4"
            style={{
              background: 'var(--color-panel)',
              border: '1px solid var(--color-panel-border)',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-5xl mb-4">🎵</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              Music Box Simulator
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Click below to enable audio and start playing
            </p>
            <button
              onClick={initAudio}
              className="w-full py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-3"
              style={{
                background: 'var(--color-accent)',
                color: '#000',
              }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              Start Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
