import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ProjectIntent from './pages/ProjectIntent'
import ProjectInfo from './pages/ProjectInfo'
import Home from './pages/Home'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import CreateProject from './pages/CreateProject'
import { ProjectProvider } from './context/ProjectContext'

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/project-intent" element={<ProjectIntent />} />
          <Route path="/project-info" element={<ProjectInfo />} />
          <Route path="/create-project" element={<CreateProject />} />
            <Route path="/home" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  )
}
