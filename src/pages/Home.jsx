import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useProject } from '../context/ProjectContext'
import { useNavigate } from 'react-router-dom'
import { useGsapFadeIn, useGsapSlideIn } from '../hooks/useGsap'
import NewProjectModal from '../components/NewProjectModal'

export default function Home() {
  const { project, setProject } = useProject()
  const nav = useNavigate()

  const recent = [
    { id: 'EXP-001', name: 'Span Optimization', status: 'Running', iter: '43/100' },
    { id: 'EXP-002', name: 'Cable Tensioning Study', status: 'Completed', iter: '100/100' },
    { id: 'EXP-003', name: 'Material Mix Sweep', status: 'Queued', iter: '0/100' },
  ]

  const rootRef = useRef(null)
  useGsapFadeIn(rootRef)

  const [showModal, setShowModal] = useState(false)

  // Provide safe defaults so missing/partial project objects don't crash render
  const defaultProject = {
    objective: '',
    projectType: 'Bridge',
    structure: '-',
    material: '-',
    visualization: 'SVG',
    loadRange: { max: 120 },
  }
  const p = { ...defaultProject, ...(project || {}) }

  const countRefs = { exp: useRef(null), agents: useRef(null), iter: useRef(null) }

  useEffect(() => {
    try {
      gsap.fromTo(
        '.home-card',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      )

      // count up animations
      gsap.to({}, {
        duration: 1.2,
        onUpdate: function () {
          const t = this.progress()
          if (countRefs.exp.current) countRefs.exp.current.innerText = Math.round(3 + t * 7)
          if (countRefs.agents.current) countRefs.agents.current.innerText = Math.round(12 + t * 8)
          if (countRefs.iter.current) countRefs.iter.current.innerText = Math.round(58 + t * 12)
        },
      })
    } catch (e) {
      // ignore if gsap missing
    }
  }, [])

  // After showing the problem statement briefly, navigate to dashboard automatically
  useEffect(() => {
    // If the new-project modal is open, do not navigate away.
    if (showModal) return
    const t = setTimeout(() => {
      try {
        nav('/dashboard')
      } catch (e) {}
    }, 3000)
    return () => clearTimeout(t)
  }, [nav, showModal])

  return (
    <div ref={rootRef} className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="gsap-item text-4xl md:text-5xl font-extrabold">SciPilot</h1>
              <p className="gsap-item text-lg text-gray-300 mt-2 max-w-2xl">We build agents and tooling that design, run, and refine virtual experiments to accelerate structural design and testing.</p>
              <p className="text-sm text-gray-400 mt-2">{p.objective || 'Start by creating a project — bridge, house, tunnel, or dam.'}</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { console.log('Home: New Project clicked'); setShowModal(true) }} className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500">New Project</button>
                <button onClick={() => nav('/dashboard')} className="px-4 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">Explore Dashboard</button>
              </div>
            </div>

            <div className="hidden md:block ml-6">
              <div className="w-72 h-40 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                <div className="text-center text-slate-200">3D / SVG Preview<br /><small className="text-xs text-slate-400">(Open a project to view)</small></div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <div className="rounded-xl bg-gray-800 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Problem Statement</h2>
            </div>
            <div className="mt-3 text-sm text-gray-300 leading-relaxed">
              <strong>Category:</strong> Research &amp; Development
              <br />
              <strong>Problem Statement:</strong> Build an agent that designs and executes experiments in virtual environments.
              <br />
              <strong>Detailed description:</strong> Develop an automated experimentation platform that designs experiments, optimizes parameters, runs simulations in virtual environments, collects results, and iteratively refines experimental approaches using reinforcement learning and Bayesian optimization for accelerated scientific discovery.
            </div>
          </div>
        </section>
          {/* New Project modal */}
          <NewProjectModal isOpen={showModal} onClose={() => setShowModal(false)} />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="home-card rounded-xl bg-gray-800 p-6">
            <div className="text-sm text-gray-300">Active Experiments</div>
            <div className="gsap-item mt-2 text-2xl font-bold text-blue-400" ref={countRefs.exp}>3</div>
            <div className="gsap-item text-xs text-gray-400 mt-2">Currently running optimization pipelines</div>
          </div>

          <div className="home-card rounded-xl bg-gray-800 p-6">
            <div className="text-sm text-gray-300">Active Agents</div>
            <div className="mt-2 text-2xl font-bold text-orange-400" ref={countRefs.agents}>12</div>
            <div className="text-xs text-gray-400 mt-2">Distributed evaluate & propose agents</div>
          </div>

          <div className="home-card rounded-xl bg-gray-800 p-6">
            <div className="text-sm text-gray-300">Iterations (avg)</div>
            <div className="mt-2 text-2xl font-bold text-green-400" ref={countRefs.iter}>58</div>
            <div className="text-xs text-gray-400 mt-2">Average iterations to converge</div>
          </div>
        </section>

        <section className="rounded-xl bg-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Experiments</h2>
            <button className="text-sm text-blue-300">View all</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recent.map((r) => (
              <div key={r.id} className="home-card p-4 rounded-lg bg-gray-700/40 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{r.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{r.id}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${r.status === 'Completed' ? 'text-green-300' : r.status === 'Running' ? 'text-blue-300' : 'text-orange-300'}`}>
                      {r.status}
                    </div>
                    <div className="text-xs text-gray-400">{r.iter}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-300">A short summary of the experiment goals and setup goes here. Click to open full details.</div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-2 py-1 rounded bg-blue-600 text-white">Open</button>
                  <button className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-200">Clone</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="home-card rounded-xl bg-gray-800 p-6">
            <h3 className="gsap-item text-sm font-semibold text-white">Project Summary</h3>
            <div className="mt-3 text-sm text-gray-300">Type: <span className="text-blue-300 font-medium">{p.projectType}</span></div>
            <div className="mt-1 text-sm text-gray-300">Structure: <span className="text-orange-300 font-medium">{p.structure}</span></div>
            <div className="mt-1 text-sm text-gray-300">Material: <span className="text-green-300 font-medium">{p.material}</span></div>
            <div className="mt-3">
              <label className="text-xs text-gray-400">Visualization</label>
              <select value={p.visualization} onChange={(e) => setProject({ visualization: e.target.value })} className="mt-1 w-full bg-gray-800 text-gray-100 px-2 py-2 rounded-md">
                <option>3D</option>
                <option>SVG</option>
              </select>
            </div>
          </div>

            <div className="home-card rounded-xl bg-gray-800 p-6">
            <h3 className="gsap-item text-sm font-semibold text-white">Simulation Settings</h3>
            <div className="mt-3 text-sm text-gray-300">Load Range</div>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min="50" max="300" value={p.loadRange?.max ?? 120} onChange={(e) => setProject({ loadRange: { ...((project && project.loadRange) || {}), max: Number(e.target.value) }})} className="w-full" />
              <div className="text-sm text-gray-200 px-3 py-1 bg-gray-800 rounded">{p.loadRange?.max ?? 120} kN</div>
            </div>

            <div className="mt-4">
              <button onClick={() => nav('/results')} className="px-4 py-2 bg-blue-600 rounded-md text-white">Generate Simulation</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
