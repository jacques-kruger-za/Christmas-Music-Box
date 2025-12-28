const STORAGE_KEY = 'musicbox-recordings'

export function loadRecordings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load recordings:', error)
    return []
  }
}

export function saveRecording(song) {
  try {
    const recordings = loadRecordings()
    recordings.push(song)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings))
    return true
  } catch (error) {
    console.error('Failed to save recording:', error)
    return false
  }
}

export function deleteRecording(index) {
  try {
    const recordings = loadRecordings()
    recordings.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings))
    return true
  } catch (error) {
    console.error('Failed to delete recording:', error)
    return false
  }
}

export function deleteRecordingByName(name) {
  try {
    const recordings = loadRecordings()
    const filtered = recordings.filter(r => r.name !== name)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to delete recording:', error)
    return false
  }
}

export function exportRecordings() {
  const recordings = loadRecordings()
  const dataStr = JSON.stringify(recordings, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'musicbox-recordings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importRecordings(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        if (!Array.isArray(imported)) {
          throw new Error('Invalid format: expected array')
        }

        // Validate each song
        imported.forEach((song, i) => {
          if (!song.name || !Array.isArray(song.notes)) {
            throw new Error(`Invalid song at index ${i}`)
          }
        })

        // Merge with existing recordings
        const existing = loadRecordings()
        const merged = [...existing, ...imported]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))

        resolve(imported.length)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
