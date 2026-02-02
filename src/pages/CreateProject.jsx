import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGsapFadeIn, useGsapSlideIn } from '../hooks/useGsap'
import { useProject } from '../context/ProjectContext'

export default function CreateProject() {
  const { createProject, setProject } = useProject()
  const navigate = useNavigate()
  const rootRef = useRef(null)
  useGsapFadeIn(rootRef)

  const [name, setName] = useState('')
  const [type, setType] = useState('Bridge')
  const [category, setCategory] = useState('Research & Development')
  const [objective, setObjective] = useState('')

  // Building fields
  const [floors, setFloors] = useState(12)
  const [bhk, setBhk] = useState(3)
  const [unitsPerFloor, setUnitsPerFloor] = useState(3)

  // Bridge fields
  const [spanLength, setSpanLength] = useState(120)
  const [trafficLoad, setTrafficLoad] = useState(120)
  const [material, setMaterial] = useState('Steel')

  // Tunnel fields
  const [tLength, setTLength] = useState(2000)
  const [tDiameter, setTDiameter] = useState(10)
  const [supportClass, setSupportClass] = useState('NATM-III')
  const [ventilation, setVentilation] = useState('Longitudinal')

  // Dam fields
  const [damType, setDamType] = useState('Concrete Gravity')
  const [damHeight, setDamHeight] = useState(90)
  const [crestLength, setCrestLength] = useState(500)
  const [spillway, setSpillway] = useState('Radial Gates')

  // Road fields
  const [lanes, setLanes] = useState(4)
  const [designSpeed, setDesignSpeed] = useState(80)
  const [rLength, setRLength] = useState(25)
  const [pavement, setPavement] = useState('Flexible (Bituminous)')

  // Foundation fields
  const [fType, setFType] = useState('Pile Group')
  const [piles, setPiles] = useState(36)
  const [capacity, setCapacity] = useState(4500)
  const [embedment, setEmbedment] = useState(18)
  const [soil, setSoil] = useState('Medium Dense Sand')

  const buildingRef = useRef(null)
  const bridgeRef = useRef(null)
  const tunnelRef = useRef(null)
  const damRef = useRef(null)
  const roadRef = useRef(null)
  const foundationRef = useRef(null)

  useEffect(() => {
    if (type === 'Building') useGsapSlideIn(buildingRef, { delay: 0.05 })
    if (type === 'Bridge') useGsapSlideIn(bridgeRef, { delay: 0.05 })
    if (type === 'Tunnel') useGsapSlideIn(tunnelRef, { delay: 0.05 })
    if (type === 'Dam') useGsapSlideIn(damRef, { delay: 0.05 })
    if (type === 'Road') useGsapSlideIn(roadRef, { delay: 0.05 })
    if (type === 'Foundation') useGsapSlideIn(foundationRef, { delay: 0.05 })
  }, [type])

  function persistAndNavigate() {
    const payload = {
      name,
      projectType: type,
      category,
      objective,
      metadata: {},
      createdAt: new Date().toISOString(),
    }

    if (type === 'Building') {
      payload.metadata = { floors: Number(floors), bhk: Number(bhk), unitsPerFloor: Number(unitsPerFloor) }
    }

    if (type === 'Bridge') {
      payload.metadata = { spanLength: Number(spanLength), trafficLoad: Number(trafficLoad), material }
    }

    if (type === 'Tunnel') {
      payload.metadata = { length: Number(tLength), diameter: Number(tDiameter), supportClass, ventilation }
    }

    if (type === 'Dam') {
      payload.metadata = { type: damType, height: Number(damHeight), crestLength: Number(crestLength), spillway }
    }

    if (type === 'Road') {
      payload.metadata = { lanes: Number(lanes), designSpeed: Number(designSpeed), length: Number(rLength), pavement }
    }

    if (type === 'Foundation') {
      payload.metadata = { type: fType, piles: Number(piles), capacity: Number(capacity), embedment: Number(embedment), soil }
    }

    // include category in metadata as well
    payload.metadata = { ...payload.metadata, category }

    // store to localStorage key `currentProject`
    try {
      localStorage.setItem('currentProject', JSON.stringify(payload))
    } catch (e) {
      // ignore
    }

    // also add to ProjectContext for in-app listing
    try {
      const created = createProject({ name: payload.name || `Project ${Date.now()}`, projectType: payload.projectType, ...payload })
      // make selected project reflect this new project
      setProject({ projectType: payload.projectType, objective: objective })
    } catch (e) {
      // if context not available, ignore
    }

    // navigate to home (you can change to /results if you prefer)
    navigate('/home')
  }

  function onSubmit(e) {
    e.preventDefault()
    persistAndNavigate()
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-slate-900 text-slate-100 p-6 flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-2xl bg-slate-800/60 p-6 rounded-xl ring-1 ring-slate-700 backdrop-blur">
        <h2 className="text-2xl font-semibold text-white mb-2">Create New Project</h2>
        <p className="text-sm text-slate-300 mb-4">Quickly define a project for SciPilot. Fields change depending on project type.</p>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-slate-300">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100" placeholder="e.g. Midtown Bridge" />
          </div>

          <div>
            <label className="text-sm text-slate-300">Project Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100">
              <option>Bridge</option>
              <option>Building</option>
              <option>Tunnel</option>
              <option>Dam</option>
              <option>Road</option>
              <option>Foundation</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100">
              <option>Research & Development</option>
              <option>Education</option>
              <option>Proof of Concept</option>
              <option>Commercial</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Objective</label>
            <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} className="mt-2 w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-100" placeholder="Describe the project objective" />
          </div>

          {type === 'Building' && (
            <div ref={buildingRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Building details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Floors</label>
                  <select value={floors} onChange={(e) => setFloors(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Flat Type</label>
                  <select value={bhk} onChange={(e) => setBhk(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Units / Floor</label>
                  <select value={unitsPerFloor} onChange={(e) => setUnitsPerFloor(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Bridge' && (
            <div ref={bridgeRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Bridge details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Span Length (m)</label>
                  <select value={spanLength} onChange={(e) => setSpanLength(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={80}>80</option>
                    <option value={120}>120</option>
                    <option value={180}>180</option>
                    <option value={240}>240</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Traffic Load (kN)</label>
                  <select value={trafficLoad} onChange={(e) => setTrafficLoad(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={80}>80</option>
                    <option value={120}>120</option>
                    <option value={160}>160</option>
                    <option value={200}>200</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Material</label>
                  <select value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Steel</option>
                    <option>Concrete</option>
                    <option>Composite</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Tunnel' && (
            <div ref={tunnelRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Tunnel details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Length (m)</label>
                  <select value={tLength} onChange={(e) => setTLength(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={1000}>1000</option>
                    <option value={2000}>2000</option>
                    <option value={3000}>3000</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Diameter (m)</label>
                  <select value={tDiameter} onChange={(e) => setTDiameter(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={8}>8</option>
                    <option value={10}>10</option>
                    <option value={12}>12</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Support Class</label>
                  <select value={supportClass} onChange={(e) => setSupportClass(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>NATM-II</option>
                    <option>NATM-III</option>
                    <option>NATM-IV</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Ventilation</label>
                  <select value={ventilation} onChange={(e) => setVentilation(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Longitudinal</option>
                    <option>Transverse</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Dam' && (
            <div ref={damRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Dam details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Type</label>
                  <select value={damType} onChange={(e) => setDamType(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Concrete Gravity</option>
                    <option>Arch</option>
                    <option>Earthfill</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Height (m)</label>
                  <select value={damHeight} onChange={(e) => setDamHeight(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={60}>60</option>
                    <option value={90}>90</option>
                    <option value={120}>120</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Crest Length (m)</label>
                  <select value={crestLength} onChange={(e) => setCrestLength(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={300}>300</option>
                    <option value={500}>500</option>
                    <option value={800}>800</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Spillway</label>
                  <select value={spillway} onChange={(e) => setSpillway(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>OG Weir</option>
                    <option>Radial Gates</option>
                    <option>Fusegates</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Road' && (
            <div ref={roadRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Road details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Lanes</label>
                  <select value={lanes} onChange={(e) => setLanes(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Design Speed (km/h)</label>
                  <select value={designSpeed} onChange={(e) => setDesignSpeed(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Length (km)</label>
                  <select value={rLength} onChange={(e) => setRLength(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Pavement</label>
                  <select value={pavement} onChange={(e) => setPavement(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Flexible (Bituminous)</option>
                    <option>Rigid (Concrete)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'Foundation' && (
            <div ref={foundationRef} className="p-4 rounded bg-slate-900/40">
              <h3 className="text-sm font-medium text-white mb-2">Foundation details</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Type</label>
                  <select value={fType} onChange={(e) => setFType(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Isolated Footing</option>
                    <option>Combined Footing</option>
                    <option>Raft</option>
                    <option>Pile Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Piles</label>
                  <select value={piles} onChange={(e) => setPiles(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100" disabled={fType !== 'Pile Group'}>
                    <option value={9}>9</option>
                    <option value={16}>16</option>
                    <option value={36}>36</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Capacity (kN)</label>
                  <select value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={2000}>2000</option>
                    <option value={4500}>4500</option>
                    <option value={8000}>8000</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Embedment (m)</label>
                  <select value={embedment} onChange={(e) => setEmbedment(Number(e.target.value))} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option value={12}>12</option>
                    <option value={18}>18</option>
                    <option value={24}>24</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Soil</label>
                  <select value={soil} onChange={(e) => setSoil(e.target.value)} className="mt-2 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-100">
                    <option>Soft Clay</option>
                    <option>Medium Dense Sand</option>
                    <option>Dense Sand</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4">
            <button type="button" onClick={() => navigate('/projects')} className="px-4 py-2 bg-gray-700 rounded text-slate-200">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 rounded text-white">Create Project</button>
          </div>
        </div>
      </form>
    </div>
  )
}
