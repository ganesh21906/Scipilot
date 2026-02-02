import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useGsapFadeIn, useGsapSlideIn } from '../hooks/useGsap'
import { gsap } from 'gsap'
import NewProjectModal from '../components/NewProjectModal'
import { useState } from 'react'

export default function Dashboard() {
  const { projects, createProject, selectProject } = useProject()
  const navigate = useNavigate()
  const rootRef = React.useRef(null)
  useGsapFadeIn(rootRef)

  // Find a bridge project if any
  const bridge = (projects || []).find((p) => p.projectType === 'Bridge')

  const [showModal, setShowModal] = useState(false)

  function onCreate() {
    // open the modal to let user pick a template/options
    setShowModal(true)
  }

  function createdCallback(proj) {
    setShowModal(false)
    if (proj && proj.id) {
      selectProject(proj.id)
      navigate('/results')
    }
  }


  return (
    <div ref={rootRef} className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 p-8 rounded-2xl shadow-lg ring-1 ring-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">SciPilot</h1>
          <p className="text-sm text-slate-300 mb-6">Create a new project to begin experiments and visualizations.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onCreate} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-medium">Create New Project</button>
          </div>

          {bridge && (
            <div className="mt-6 text-sm text-slate-300">
              Found bridge project: <span className="text-white font-semibold">{bridge.name}</span>
            </div>
          )}
        </div>
        {/* New Project modal */}
        <NewProjectModal isOpen={showModal} onClose={() => setShowModal(false)} onCreated={createdCallback} />
      </div>
    </div>
  )
}
