import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import VoiceButton from './components/VoiceButton'

const API_URL = import.meta.env.VITE_API_URL || 'https://project-hub-backend-assignment.onrender.com'

export default function App() {
  const [selected, setSelected] = useState('requirements')  // Default selected section: Requirements
  const [lang, setLang] = useState('en')  // Default language is English
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Welcome to Project Hub Assistant. Speak or type to create requirements, report bugs, or raise queries.' }
  ])
  const [listening, setListening] = useState(false)
  const [requirements, setRequirements] = useState([])
  const [bugs, setBugs] = useState([])
  const [queries, setQueries] = useState([])

  // Fetch items from DB on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  // Fetch data based on the selected section
  useEffect(() => {
    if (selected === 'requirements') {
      fetchRequirements()
    } else if (selected === 'bugs') {
      fetchBugs()
    } else if (selected === 'queries') {
      fetchQueries()
    }
  }, [selected])

  // Fetch all items: requirements, bugs, queries
  const fetchItems = async () => {
    await fetchRequirements()
    await fetchBugs()
    await fetchQueries()
  }

  const fetchRequirements = async () => {
    try {
      const response = await fetch(`${API_URL}/requirement/list`)
      const data = await response.json()
      setRequirements(
  data.items.map(r => ({
    id: r[0],
    title: r[1],
    description: r[2],
    priority: r[3],
    created_at: r[4]
  }))
)
    } catch (e) {
      console.error('Error fetching requirements:', e)
    }
  }

  const fetchBugs = async () => {
    try {
      const response = await fetch(`${API_URL}/bug/list`)
      const data = await response.json()
      setBugs(
  data.items.map(b => ({
    id: b[0],
    title: b[1],
    description: b[2],
    severity: b[3],
    created_at: b[4]
  }))
)
    } catch (e) {
      console.error('Error fetching bugs:', e)
    }
  }

  const fetchQueries = async () => {
    try {
      const response = await fetch(`${API_URL}/query/list`)
      const data = await response.json()
      setQueries(
  data.items.map(q => ({
    id: q[0],
    question: q[1],
    description: q[2],
    assigned_to: q[3],
    created_at: q[4]
  }))
)
    } catch (e) {
      console.error('Error fetching queries:', e)
    }
  }

  // Push a new message to the chat panel
  function pushMessage(from, text) {
    setMessages((m) => [...m, { from, text }])
  }

  // Send text and get bot reply
  async function sendText(text) {
    pushMessage('user', text)
    try {
      const resp = await fetch(API_URL + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang })
      })
      const j = await resp.json()
      const reply = j.reply || 'Sorry, no response.'
      pushMessage('bot', reply)
      speak(reply)

      // Handle response actions for creating items
        if (j.action?.type === 'create_requirement') {
            const newRequirement = j.action.params; // New requirement object
            setRequirements(prev => [...prev, newRequirement]); // Add new requirement immediately
            fetchRequirements(); // Re-fetch the requirements list after creation
        }
        if (j.action?.type === 'report_bug') {
            const newBug = j.action.params; // New bug object
            setBugs(prev => [...prev, newBug]); // Add new bug immediately
            fetchBugs(); // Re-fetch the bugs list after creation
        }
        if (j.action?.type === 'raise_query') {
            const newQuery = j.action.params; // New query object
            setQueries(prev => [...prev, newQuery]); // Add new query immediately
            fetchQueries(); // Re-fetch the queries list after creation
        }

    } catch (e) {
      pushMessage('bot', 'Error contacting server: ' + String(e))
    }
  }

  // Speech synthesis function
  function speak(text) {
    try {
      const utt = new SpeechSynthesisUtterance(text)
      utt.lang = lang === 'ta' ? 'ta-IN' : 'en-US'
      window.speechSynthesis.speak(utt)
    } catch (e) {
      console.warn(e)
    }
  }

  // Handle voice input
  function handleVoiceResult(recText) {
    sendText(recText)
  }

  // Handle voice error
  function handleVoiceError(e) {
    pushMessage('bot', 'Speech error: ' + (e?.error || e?.message || JSON.stringify(e)))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onSelect={setSelected} selected={selected} lang={lang} setLang={setLang} />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{selected.charAt(0).toUpperCase() + selected.slice(1)}</h2>
            <p className="text-sm text-gray-500">Manage requirements, bugs, and queries using voice or text.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Language: <strong>{lang === 'ta' ? 'Tamil' : 'English'}</strong></div>
            <VoiceButton lang={lang} onResult={handleVoiceResult} onError={handleVoiceError} listening={listening} setListening={setListening} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow h-[72vh] overflow-hidden flex">
          <div className="w-2/3 border-r border-gray-100">
            <ChatPanel messages={messages} onSend={sendText} lang={lang} />
          </div>
          <div className="w-1/3 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">{selected.charAt(0).toUpperCase() + selected.slice(1)} List</h3>
              <p className="text-sm text-gray-500">Your {selected} list is shown below.</p>
            </div>
            <div className="space-y-3">
              {selected === 'requirements' && requirements.map(req => (
                <div key={req.id} className="p-3 border rounded hover:bg-gray-50">
                  <strong>{req.title}</strong>
                  <p className="text-sm">{req.description}</p>
                </div>
              ))}
              {selected === 'bugs' && bugs.map(bug => (
                <div key={bug.id} className="p-3 border rounded hover:bg-gray-50">
                  <strong>{bug.title}</strong>
                  <p className="text-sm">{bug.description} - Severity: {bug.severity}</p>
                </div>
              ))}
              {selected === 'queries' && queries.map(query => (
                <div key={query.id} className="p-3 border rounded hover:bg-gray-50">
                  <strong>{query.question}</strong>
                  <p className="text-sm">Assigned to: {query.assigned_to}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
