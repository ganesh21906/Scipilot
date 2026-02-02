import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useGsapFadeIn, useGsapSlideIn } from '../hooks/useGsap'

export default function ProjectIntent() {
  const { project, setProject } = useProject()
  // guard against null project from context
  const proj = project || {}
  const [type, setType] = useState(proj.projectType || 'Bridge')
  const [objective, setObjective] = useState(proj.objective || '')
  const nav = useNavigate()
  const rootRef = useRef(null)
  useGsapFadeIn(rootRef)

  function handleSubmit(e) {
    e.preventDefault()
    // prefer merging in context; if setProject replaces, ProjectContext should handle merges
    setProject({ projectType: type, objective })
    nav('/home')
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl bg-gray-800 p-6">
          <h2 className="gsap-item text-xl font-semibold mb-2">Project Intent</h2>
          <p className="gsap-item text-sm text-gray-400 mb-4">Tell SciPilot what you want to achieve — we'll tailor simulations and optimization to your goal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Project Type</label>
              <select className="gsap-item w-full bg-gray-800 text-gray-100 px-3 py-2 rounded-md" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Bridge</option>
                <option>Building</option>
                <option>Tunnel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Objective</label>
              <input
                className="gsap-item w-full bg-gray-800 text-gray-100 px-3 py-2 rounded-md"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="E.g., maximize span while minimizing cost"
              />
            </div>

            <div className="flex gap-3">
              <button className="gsap-item px-4 py-2 bg-blue-600 rounded-md text-white" type="submit">Continue</button>
              <button className="gsap-item px-4 py-2 bg-gray-700 rounded-md text-gray-200" type="button" onClick={() => nav('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
