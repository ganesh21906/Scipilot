import React, { useEffect, useState, Suspense, useRef } from 'react'
import { useProject } from '../context/ProjectContext'
// Visuals mapped by template type
import BridgeSVG from '../components/visuals/bridge/BridgeSVG'
import Bridge3D from '../components/visuals/bridge/Bridge3D'
import BuildingSVG from '../components/visuals/building/BuildingSVG'
import Building3D from '../components/visuals/building/Building3D'
import TunnelSVG from '../components/visuals/tunnel/TunnelSVG'
import Tunnel3D from '../components/visuals/tunnel/Tunnel3D'
import DamSVG from '../components/visuals/dam/DamSVG'
import Dam3D from '../components/visuals/dam/Dam3D'
import RoadSVG from '../components/visuals/road/RoadSVG'
import Road3D from '../components/visuals/road/Road3D'
import FoundationSVG from '../components/visuals/foundation/FoundationSVG'
import Foundation3D from '../components/visuals/foundation/Foundation3D'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { useGsapFadeIn } from '../hooks/useGsap'
import { computeMetrics } from '../utils/metrics'

export default function Results() {
  const { project } = useProject()
  // guard project in case it's null
  const proj = project || {}
  const [vis, setVis] = useState(proj?.visualization === 'SVG' || proj?.projectType === 'Bridge' ? 'SVG' : (proj?.visualization || '3D'))
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const rootRef = useRef(null)
  const metricsRef = useRef(null)
  useGsapFadeIn(metricsRef)
  const nav = useNavigate()

  // If no project is selected, show a friendly fallback instead of rendering an empty/broken results page
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">No project selected</h2>
          <p className="text-gray-400 mb-6">Please create a new project or select one from the Projects page to view results.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => nav('/projects')} className="px-4 py-2 rounded bg-blue-600 text-white">Open Projects</button>
            <button onClick={() => nav('/home')} className="px-4 py-2 rounded bg-gray-700 text-gray-100">Create New Project</button>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)

    // If it's a bridge project and has meta, synthesize results locally so user sees immediate visualization
    if (proj?.projectType === 'Bridge' && proj?.meta) {
      const span = Number(proj.meta.spanLength) || 0
      const load = Number(proj.meta.trafficLoad) || (proj.loadRange && proj.loadRange.max) || 0
      if (span > 0 && load > 0) {
        // simple deterministic metrics
        const capacity = `${Math.round((load * span) / 1.2)} kN`
        const cost = `$${((span * load) / 1000 + 0.5).toFixed(2)}M`
        const safety = (1.0 + (load / (span * 10))).toFixed(2)
        const data = { metrics: { capacity, cost, safety }, logs: [{ time: new Date().toISOString(), title: 'Local sim', color: 'blue', rationale: 'Synthesized from inputs' }] }
        setTimeout(() => {
          if (!mounted) return
          setResults(data)
          setLoading(false)
        }, 400)
        return
      }
    }

    async function callApi() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(proj),
        })

        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
        if (!mounted) return
        setResults(data)
      } catch (e) {
        console.warn('API call failed, using demo fallback', e)
        if (!mounted) return
        setError(e)
        // provide a small fallback so UI renders
        setResults({ metrics: { capacity: 'N/A', cost: 'N/A', safety: 'N/A' }, logs: [] })
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

  callApi()

    return () => {
      mounted = false
    }
  }, [project])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <div>
            <button onClick={() => nav('/home')} className="px-3 py-1 rounded bg-gray-800 text-gray-200">Refine Requirements</button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="h-[520px]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400">Running simulation...</div>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {/* Generic per-template viewer binding using visuals/* folders */}
                    <div className="mb-3">
                      <div className="inline-flex rounded bg-slate-800/40">
                        <button className={`px-3 py-2 ${vis === 'SVG' ? 'bg-slate-700 text-white' : 'text-slate-300'}`} onClick={() => setVis('SVG')}>SVG Viewer</button>
                        <button className={`px-3 py-2 ${vis === '3D' ? 'bg-slate-700 text-white' : 'text-slate-300'}`} onClick={() => setVis('3D')}>3D Viewer</button>
                      </div>
                    </div>

                    {vis === 'SVG' && (
                      <div className="w-full h-[520px] rounded-md overflow-hidden border border-gray-700">
                        {proj.projectType === 'Bridge' && <BridgeSVG className="w-full h-full" />}
                        {proj.projectType === 'Building' && <BuildingSVG />}
                        {proj.projectType === 'Tunnel' && <TunnelSVG />}
                        {proj.projectType === 'Dam' && <DamSVG />}
                        {proj.projectType === 'Road' && <RoadSVG />}
                        {proj.projectType === 'Foundation' && <FoundationSVG />}
                      </div>
                    )}

                    {vis === '3D' && (
                      <div className="w-full h-[520px] relative">
                        {(proj.projectType === 'Bridge' && progress > 0 && progress < 100) && (
                          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50 text-white">
                            <div className="w-16 h-16 border-4 border-t-transparent border-blue-400 rounded-full animate-spin mb-4" />
                            <div className="text-sm">Loading model... {progress}%</div>
                          </div>
                        )}
                        <Canvas className="w-full h-full" shadows camera={{ position: [0, 5, 30], fov: 50 }}>
                          {/* Daylight sky */}
                          <Sky distance={450000} turbidity={8} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.7} sunPosition={[50, 100, 20]} inclination={0} azimuth={0.25} />
                          {/* subtle base lights */}
                          <hemisphereLight args={["#cfe8ff", "#9ac6ff", 0.5]} position={[0, 50, 0]} />
                          <ambientLight intensity={0.6} />
                          <directionalLight color="#fff7e6" castShadow position={[50, 100, 20]} intensity={1.15} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
                          {/* atmospheric depth */}
                          <fog attach="fog" args={["#cfe8ff", 80, 1200]} />
                          <Suspense fallback={null}>
                            {proj.projectType === 'Bridge' && (
                              <Bridge3D />
                            )}
                            {proj.projectType === 'Building' && (
                              <Building3D />
                            )}
                            {proj.projectType === 'Tunnel' && <Tunnel3D />}
                            {proj.projectType === 'Dam' && <Dam3D />}
                            {proj.projectType === 'Road' && <Road3D />}
                            {proj.projectType === 'Foundation' && <Foundation3D />}
                          </Suspense>
                          {/* ground reference grid (light) */}
                          <gridHelper args={[800, 160, '#93a3b8', '#e5e7eb']} position={[0, -3.5, 0]} />
                          <OrbitControls enablePan enableZoom enableRotate />
                        </Canvas>
                        
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="rounded-xl bg-gray-800 p-4">
              <h4 className="text-sm text-gray-300">Key Metrics</h4>
              <ul className="mt-3 space-y-2">
                {computeMetrics(proj, results).map((m, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{m.label}</span>
                    <span className={`font-semibold ${m.accent || 'text-gray-100'}`}>{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gray-800 p-4 h-[300px] overflow-auto">
              <h4 className="text-sm text-gray-300">Agent Log</h4>
              <div className="mt-3 space-y-3">
                {(results?.logs?.length ? results.logs : [
                  { time: '10:12:05', title: 'Agent A dispatched evaluation', color: 'blue', rationale: 'Exploring local stiffness matrix' },
                  { time: '10:12:18', title: 'Agent B refined material mix', color: 'orange', rationale: 'Switched to composite' },
                ]).map((l, i) => (
                  <div key={i} className={`p-3 rounded-md bg-gray-900/80 border ${l.color === 'blue' ? 'border-l-4 border-blue-500' : 'border-l-4 border-orange-500'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{l.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{l.time}</div>
                      </div>
                      <div className="text-xs text-gray-300">{l.color === 'blue' ? 'Info' : 'Action'}</div>
                    </div>
                    <div className="text-sm text-gray-300 mt-2">{l.rationale}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
