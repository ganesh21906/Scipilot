import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'scipilot.projects'

const defaultProject = {
  id: 'project-1',
  name: 'Project Orion',
  projectType: 'Bridge',
  objective: '',
  structure: 'Cable-stayed',
  material: 'Steel',
  loadRange: { min: 50, max: 300 },
  visualization: '3D',
  createdAt: new Date().toISOString(),
  experiments: [],
}

const ProjectContext = createContext(null)

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
}

export function ProjectProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return { projects: [defaultProject], selectedId: defaultProject.id }
      const parsed = JSON.parse(raw)

      // Migration: old single-project shape -> migrate to projects array
      if (!parsed.projects && typeof parsed === 'object') {
        const migrated = { projects: [{ ...parsed, id: makeId(), createdAt: new Date().toISOString(), experiments: [] }], selectedId: null }
        migrated.selectedId = migrated.projects[0].id
        return migrated
      }

      return parsed
    } catch (e) {
      return { projects: [defaultProject], selectedId: defaultProject.id }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      // ignore
    }
  }, [state])

  function createProject(patch = {}) {
    const proj = { id: makeId(), createdAt: new Date().toISOString(), experiments: [], ...patch }
    setState((s) => ({ ...s, projects: [proj, ...(s.projects || [])], selectedId: proj.id }))
    return proj
  }

  // Replace entire projects list (useful when syncing from server)
  function setProjects(list = []) {
    setState((s) => ({ ...s, projects: list, selectedId: list[0] ? list[0].id : null }))
  }

  function updateProject(id, patch) {
    setState((s) => ({
      ...s,
      projects: (s.projects || []).map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    }))
  }

  function deleteProject(id) {
    setState((s) => {
      const projects = (s.projects || []).filter((p) => p.id !== id)
      const selectedId = s.selectedId === id ? (projects[0] && projects[0].id) || null : s.selectedId
      return { ...s, projects, selectedId }
    })
  }

  function selectProject(id) {
    setState((s) => ({ ...s, selectedId: id }))
  }

  // Backwards-compatible setter used by existing forms: patches selected project
  function setProject(patch) {
    setState((s) => {
      const selectedId = s.selectedId || (s.projects && s.projects[0] && s.projects[0].id)
      if (!selectedId) return s
      return {
        ...s,
        projects: (s.projects || []).map((p) => (p.id === selectedId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
      }
    })
  }

  function getSelectedProject() {
    const id = state.selectedId
    return (state.projects || []).find((p) => p.id === id) || null
  }

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects || [],
        selectedId: state.selectedId,
        project: getSelectedProject(),
        createProject,
        setProjects,
        updateProject,
        deleteProject,
        selectProject,
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used inside ProjectProvider')
  return ctx
}

export default ProjectContext
