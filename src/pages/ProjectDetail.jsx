import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, project, updateProject, selectProject } = useProject()

  // attempt to find project by id; if not found, navigate back
  const current = projects.find((p) => p.id === id) || project
  if (!current) {
    navigate('/projects')
    return null
  }

  // local edits
  const [name, setName] = useState(current.name || '')
  const [type, setType] = useState(current.projectType || 'Bridge')
  const [running, setRunning] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  function save() {
    updateProject(current.id, { name, projectType: type })
    selectProject(current.id)
    alert('Saved')
  }

  async function runExperiment() {
    setRunning(true)
    setLastResult(null)
    try {
      const res = await fetch(`/api/projects/${current.id}/experiments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: { trafficLoad: 120 } }),
      })
      const json = await res.json()
      setLastResult(json)
    } catch (e) {
      setLastResult({ error: e.message })
    }
    setRunning(false)
  }

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{name || 'Project'}</h1>
            <p className="text-sm text-slate-400 mt-1">Project ID: {current.id}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/projects')} className="px-3 py-2 bg-gray-700 rounded">Back</button>
            <button onClick={save} className="px-3 py-2 bg-indigo-600 rounded text-white">Save</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-slate-300">Name</label>
            <input className="mt-2 w-full rounded bg-slate-900 p-2" value={name} onChange={(e) => setName(e.target.value)} />

            <label className="block text-sm text-slate-300 mt-4">Type</label>
            <select className="mt-2 w-full rounded bg-slate-900 p-2" value={type} onChange={(e) => setType(e.target.value)}>
              <option>Bridge</option>
              <option>House</option>
              <option>Tunnel</option>
              <option>Dam</option>
            </select>

            <div className="mt-6">
              <button onClick={runExperiment} disabled={running} className="px-4 py-2 bg-emerald-600 rounded text-white">
                {running ? 'Running…' : 'Run Experiment'}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-white">Last Result</h3>
            <div className="mt-3 text-sm text-slate-300">
              {running && <div>Experiment running…</div>}
              {!running && !lastResult && <div>No results yet. Click Run Experiment to start a mock run.</div>}
              {lastResult && (
                <pre className="bg-gray-900 p-3 rounded overflow-auto text-xs mt-2">{JSON.stringify(lastResult, null, 2)}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
