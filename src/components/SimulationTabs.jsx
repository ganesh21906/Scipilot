import React, { useState, Suspense } from 'react'
import BridgeSVG from './BridgeSVG'
import GLTFModel from './GLTFModel'
import BuildingModel from './BuildingModel'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function SimulationTabs({ trafficLoad = 120 }) {
  const [tab, setTab] = useState('svg')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [meshNames, setMeshNames] = useState([])
  const [selectedMesh, setSelectedMesh] = useState(null)
  const [perMeshStress, setPerMeshStress] = useState({})

  function handleModelLoad(names) {
    setMeshNames(names)
    setSelectedMesh(names[0] || null)
    setLoading(false)
    setProgress(0)
  }

  function handleProgress(pct) {
    setProgress(pct)
    if (pct >= 100) setLoading(false)
  }

  function handleSelectChange(e) {
    setSelectedMesh(e.target.value)
  }

  function handleStressChange(val) {
    if (!selectedMesh) return
    setPerMeshStress((s) => ({ ...s, [selectedMesh]: val }))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setTab('svg')}
          className={`px-3 py-1 rounded-md ${tab === 'svg' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}
        >
          SVG Viewer
        </button>
        <button
          onClick={() => {
            setTab('3d')
            setLoading(true)
          }}
          className={`px-3 py-1 rounded-md ${tab === '3d' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}
        >
          3D Viewer
        </button>
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-gray-700">
        {tab === 'svg' ? (
          <div className="w-full h-[450px]">
            <BridgeSVG className="w-full h-full" />
          </div>
        ) : (
          <div className="h-[500px] bg-gray-800 relative">
            {(loading || progress > 0) && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 text-white">
                <div className="w-16 h-16 border-4 border-t-transparent border-blue-400 rounded-full animate-spin mb-4" />
                <div className="text-sm">Loading model... {progress}%</div>
              </div>
            )}

            <div className="absolute right-4 top-4 z-40 bg-gray-900/60 p-3 rounded-md text-sm">
              <div className="mb-2 text-xs text-gray-300">3D Controls</div>
              <div className="flex gap-2 items-center">
                <select value={selectedMesh || ''} onChange={handleSelectChange} className="bg-gray-800 text-gray-200 px-2 py-1 rounded">
                  {meshNames.length === 0 && <option value="">(no model meshes)</option>}
                  {meshNames.map((n) => (
                    <option key={n} value={n}>{n || '(unnamed)'}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2">
                <label className="text-xs text-gray-400">Stress (selected)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedMesh ? (perMeshStress[selectedMesh] ?? 0) : 0}
                  onChange={(e) => handleStressChange(Number(e.target.value))}
                  className="w-full mt-1 accent-orange-400"
                />
              </div>
            </div>

            <Canvas shadows camera={{ position: [6, 4, 10], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight castShadow position={[10, 10, 5]} intensity={1.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
              <Suspense fallback={null}>
                {/* GLTFModel will fallback internally to BuildingModel if no model found */}
                <GLTFModel trafficLoad={trafficLoad} perMeshStress={perMeshStress} onLoad={handleModelLoad} onProgress={handleProgress} />
              </Suspense>
              <OrbitControls enablePan enableZoom enableRotate />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  )
}
