import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import ProjectCard from '../components/ProjectCard'
import NewProjectModal from '../components/NewProjectModal'

export default function Projects() {
  const { projects, createProject, setProjects, selectProject } = useProject()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function loadFromServer() {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      if (json && Array.isArray(json.projects)) {
        setProjects(json.projects)
      }
    } catch (e) {
      // fallback: keep local projects
      console.warn('Could not load projects from server', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [showModal, setShowModal] = useState(false)

  async function onNew() {
    // Open the new-project modal so user can choose a template and fill options
    setShowModal(true)
  }

  function handleCreated(proj) {
    // When modal finishes creation, close modal and navigate to project detail
    setShowModal(false)
    if (proj && proj.id) {
      try { selectProject(proj.id) } catch (e) {}
      navigate('/results')
    }
    else loadFromServer()
  }

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-slate-400 mt-1">Create, manage, and run experiments for your projects.</p>
          </div>

          <div>
            <button onClick={onNew} className="px-4 py-2 bg-indigo-600 rounded text-white">New Project</button>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">Loading projects…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
        <NewProjectModal isOpen={showModal} onClose={() => setShowModal(false)} onCreated={handleCreated} />
      </div>
    </div>
  )
}
