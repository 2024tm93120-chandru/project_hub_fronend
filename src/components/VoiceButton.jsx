// src/components/VoiceButton.jsx
import React, { useEffect, useRef } from 'react'

export default function VoiceButton({ lang, onResult, onError, listening, setListening }) {
  const recRef = useRef(null)

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      onError({ error: 'unsupported', message: 'Web Speech API not supported. Use Chrome.' })
    }
  }, [])

  function start() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    if (recRef.current) {
      try { recRef.current.abort() } catch (e) { }
      recRef.current = null
    }
    const rec = new SpeechRecognition()
    rec.lang = (lang === 'ta') ? 'ta-IN' : 'en-US'
    rec.interimResults = false
    rec.continuous = false
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      onResult(text)
    }
    rec.onerror = (e) => {
      onError(e)
    }
    rec.onend = () => setListening(false)
    rec.start()
    recRef.current = rec
    setListening(true)
  }

  return (
    <button
      onClick={start}
      className={`flex items-center gap-2 px-4 py-2 rounded-md ${listening ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 00-1 1v6a1 1 0 002 0V3a1 1 0 00-1-1z" />
        <path d="M5 8a4 4 0 008 0V7a1 1 0 012 0v1a6 6 0 01-5 5.91V17h3a1 1 0 110 2H6a1 1 0 110-2h3v-3.09A6 6 0 015 8V7a1 1 0 012 0v1z" />
      </svg>
      {listening ? 'Listening...' : 'Start Listening'}
    </button>
  )
}
