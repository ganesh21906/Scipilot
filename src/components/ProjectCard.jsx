import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const { selectProject, deleteProject } = useProject()

  function open() {
    selectProject(project.id)
    navigate(`/projects/${project.id}`)
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-300">{project.projectType}</div>
          <div className="text-lg font-semibold text-white mt-1">{project.name || 'Untitled Project'}</div>
          <div className="text-xs text-gray-400 mt-1">Created: {new Date(project.createdAt).toLocaleString()}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button className="text-sm px-3 py-1 bg-indigo-600 rounded text-white" onClick={open}>
            Open
          </button>
          <button
            className="text-xs px-3 py-1 bg-gray-700 rounded text-gray-200 hover:bg-red-600"
            onClick={() => {
              if (confirm('Delete project?')) deleteProject(project.id)
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
