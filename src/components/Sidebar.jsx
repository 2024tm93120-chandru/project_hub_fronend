// src/components/Sidebar.jsx
import React from 'react'

export default function Sidebar({ onSelect, selected, lang, setLang }) {
  const items = [
    { id: 'requirements', title: 'Requirements', subtitle: 'Create & view' },
    { id: 'bugs', title: 'Bugs', subtitle: 'Report & track' },
    { id: 'queries', title: 'Queries', subtitle: 'Raise & assign' },
  ]

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project Hub</h1>
        <p className="text-sm text-gray-500">Voice Assistant (EN / TA)</p>
      </div>

      <nav className="space-y-2">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={`w-full text-left p-3 rounded-lg flex flex-col ${
              selected === it.id ? 'bg-sky-50 ring-1 ring-sky-200' : 'hover:bg-gray-50'
            }`}
          >
            <span className="font-medium text-gray-800">{it.title}</span>
            <span className="text-xs text-gray-500">{it.subtitle}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="text-xs text-gray-500">Language</div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded text-sm ${
              lang === 'en'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            English
          </button>

          <button
            onClick={() => setLang('ta')}
            className={`px-3 py-1 rounded text-sm ${
              lang === 'ta'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Tamil
          </button>
        </div>
      </div>
    </aside>
  )
}
