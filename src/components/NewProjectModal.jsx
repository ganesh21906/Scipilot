import React, { useState, useEffect, useRef } from 'react'
import { useProject } from '../context/ProjectContext'
import { useNavigate } from 'react-router-dom'

const TEMPLATES = [
  {
    id: 'bridge',
    title: 'Bridge Design Optimizer',
    description: 'Stress overlays, span analysis, cable tension simulation. Extend with wind load and seismic response modules.',
    fields: [
      { name: 'spanLength', label: 'Span length (m)', type: 'number', placeholder: 'e.g. 200' },
      { name: 'trafficLoad', label: 'Traffic load (kN)', type: 'number', placeholder: 'e.g. 120' },
      { name: 'material', label: 'Primary material', type: 'select', options: ['Steel', 'Concrete', 'Composite'] },
      { name: 'windModule', label: 'Include wind-load module', type: 'checkbox' },
      { name: 'seismicModule', label: 'Include seismic module', type: 'checkbox' },
    ],
  },
  {
    id: 'building',
    title: 'Smart Building Planner',
    description: 'Modern or Traditional → Cost, Land Size, Location. Visualize floor plan + 3D structure and optimize material usage, sunlight exposure, ventilation.',
    fields: [
      { name: 'style', label: 'Style', type: 'select', options: ['Modern', 'Traditional'] },
      { name: 'cost', label: 'Estimated budget (USD)', type: 'number' },
      { name: 'landSize', label: 'Land size (m²)', type: 'number' },
      { name: 'location', label: 'Location (city/region)', type: 'text' },
      { name: 'optimizeMaterial', label: 'Optimize material usage', type: 'checkbox' },
    ],
  },
  {
    id: 'tunnel',
    title: 'Tunnel Stability Simulator',
    description: 'Tunnel length, soil type, depth, traffic type → structural stress zones, reinforcement suggestions.',
    fields: [
      { name: 'length', label: 'Tunnel length (m)', type: 'number' },
      { name: 'soilType', label: 'Soil type', type: 'select', options: ['Rock', 'Sandy', 'Clay', 'Mixed'] },
      { name: 'depth', label: 'Depth (m)', type: 'number' },
      { name: 'trafficType', label: 'Traffic type', type: 'select', options: ['Light', 'Heavy', 'Mixed'] },
    ],
  },
  {
    id: 'dam',
    title: 'Dam Load & Spillway Optimizer',
    description: 'Reservoir volume, flow rate, dam type → spillway design, overflow risk, material cost.',
    fields: [
      // Use selects instead of free typing for quicker, sensible choices
      { name: 'reservoirVolume', label: 'Reservoir volume (Mm³)', type: 'select', options: [50, 120, 250, 500, 1000] },
      { name: 'flowRate', label: 'Design flow rate (m³/s)', type: 'select', options: [500, 1000, 1500, 2500, 5000] },
      { name: 'damType', label: 'Dam type', type: 'select', options: ['Gravity', 'Arch', 'Embankment'] },
    ],
  },
  {
    id: 'road',
    title: 'Road Network Layout Generator',
    description: 'Terrain type, traffic density, budget → suggested road layout with intersections.',
    fields: [
      { name: 'terrain', label: 'Terrain type', type: 'select', options: ['Flat', 'Hilly', 'Mountainous', 'Coastal'] },
      { name: 'trafficDensity', label: 'Traffic density', type: 'select', options: ['Low', 'Medium', 'High'] },
      { name: 'budget', label: 'Budget (USD)', type: 'number' },
    ],
  },
  {
    id: 'foundation',
    title: 'Foundation Design Assistant',
    description: 'Building type, soil profile, load distribution → foundation recommendations.',
    fields: [
      { name: 'buildingType', label: 'Building type', type: 'select', options: [
        'Residential (Low-rise)',
        'Residential (High-rise)',
        'Commercial / Office',
        'Industrial / Warehouse',
        'Institutional (School/Hospital)'
      ] },
      { name: 'soilProfile', label: 'Soil profile summary', type: 'select', options: [
        'Soft Clay',
        'Silty Clay',
        'Medium Dense Sand',
        'Dense Sand',
        'Weathered Rock',
        'Layered: Clay over Sand',
        'Layered: Sand over Clay'
      ] },
      { name: 'loadDistribution', label: 'Load distribution (kN)', type: 'select', options: [500, 1000, 1500, 2000, 3000, 5000] },
    ],
  },
]

export default function NewProjectModal({ isOpen, onClose, onCreated }) {
  const { createProject, setProject, selectProject } = useProject()
  const nav = useNavigate()
  const [step, setStep] = useState('list')
  const [selected, setSelected] = useState(null)
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState([])
  // debug: log when modal renders open
  try { console.log('NewProjectModal render, isOpen=', isOpen) } catch (e) {}

  // Instance guard: create a stable id reference for this mount (hooks must be called unconditionally)
  const instanceIdRef = useRef(null)
  if (!instanceIdRef.current) instanceIdRef.current = `npm-newproject-${Date.now()}-${Math.floor(Math.random() * 10000)}`

  // Manage global active id only when the modal is actually opened to avoid stale globals
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isOpen) return
    // if another instance is already claimed, do not override it here
    if (window.__NEW_PROJECT_MODAL_ACTIVE_ID && window.__NEW_PROJECT_MODAL_ACTIVE_ID !== instanceIdRef.current) {
      // another modal is active — we won't claim the slot
      return
    }
    window.__NEW_PROJECT_MODAL_ACTIVE_ID = instanceIdRef.current
    return () => {
      if (window.__NEW_PROJECT_MODAL_ACTIVE_ID === instanceIdRef.current) window.__NEW_PROJECT_MODAL_ACTIVE_ID = null
    }
  }, [isOpen])

  // If modal isn't open, don't render anything
  if (!isOpen) return null

  // If another active modal exists, skip rendering to avoid duplicates
  if (typeof window !== 'undefined' && window.__NEW_PROJECT_MODAL_ACTIVE_ID && window.__NEW_PROJECT_MODAL_ACTIVE_ID !== instanceIdRef.current) {
    console.warn('NewProjectModal: another instance is already active, skipping render')
    return null
  }

  const openTemplate = (tmpl) => {
    setSelected(tmpl)
    // init values
    const init = {}
    tmpl.fields.forEach((f) => {
      if (f.type === 'checkbox') init[f.name] = false
      else if (f.type === 'select') init[f.name] = f.options?.[0] ?? ''
      else init[f.name] = ''
    })
    setValues(init)
    setStep('form')
  }

  const handleChange = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    // simple validation for bridge template
    if (selected && selected.id === 'bridge') {
      const errs = []
      const span = Number(values.spanLength)
      const load = Number(values.trafficLoad)
      if (!span || span <= 0) errs.push('Span length must be a positive number')
      if (!load || load <= 0) errs.push('Traffic load must be a positive number')
      if (!values.material || String(values.material).trim().length < 1) errs.push('Material must be provided')
      if (errs.length) {
        setErrors(errs)
        return
      }
    }
    // canonical projectType mapping so downstream pages can check exact types
    const TYPE_MAP = {
      bridge: 'Bridge',
      building: 'Building',
      tunnel: 'Tunnel',
      dam: 'Dam',
      road: 'Road',
      foundation: 'Foundation',
    }

    const proj = {
      id: `P-${Date.now()}`,
      name: selected.title,
      projectType: TYPE_MAP[selected.id] || selected.title,
      objective: selected.description,
      createdAt: new Date().toISOString(),
      meta: values,
    }
    // create in context and set current
    try {
      // augment project with some fields for bridge template
      if (selected && selected.id === 'bridge') {
        proj.structure = proj.structure || 'Cable-stayed'
        proj.material = values.material || 'Steel'
        proj.loadRange = { min: 0, max: Number(values.trafficLoad) || 120 }
        proj.meta = values
        // prefer SVG visualization for bridge projects by default
        proj.visualization = proj.visualization || 'SVG'
      }

      const created = await createProject(proj)
      console.log('NewProjectModal: createProject returned', created)
      // ensure the created project is selected in context
      try { selectProject(created.id) } catch (e) { /* ignore */ }
      // also patch the selected project with any extra fields
      setProject(created)
      // invoke callback if provided (Projects/Dashboard may want navigation)
      if (onCreated && typeof onCreated === 'function') {
        try { onCreated(created) } catch (e) { console.warn('onCreated callback threw', e) }
      } else {
        // default behavior: close modal and go to results so user sees visualization
        onClose()
        nav('/results')
      }
    } catch (err) {
      // createProject may be synchronous depending on implementation
      console.warn('NewProjectModal: createProject threw', err)
      // still attempt to set and close; ensure selection
      try { selectProject(proj.id) } catch (e) { /* ignore */ }
      setProject(proj)
      if (onCreated && typeof onCreated === 'function') {
        try { onCreated(proj) } catch (e) { console.warn('onCreated callback threw', e) }
      } else {
        onClose()
        nav('/results')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl bg-gray-900 text-gray-100 rounded-xl shadow-xl overflow-auto max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">Close</button>
        </div>

        <div className="p-4">
          {step === 'list' && (
            <div className="grid gap-3">
              {TEMPLATES.map((t) => (
                <div key={t.id} className="p-3 rounded-lg bg-gray-800 border border-gray-700 flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="mt-1 text-sm text-gray-300">{t.description}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => openTemplate(t)} className="px-3 py-2 bg-indigo-600 rounded text-white">Select</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 'form' && selected && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.length > 0 && (
                <div className="p-3 bg-red-900 text-red-100 rounded">
                  <div className="font-semibold">Please fix the following:</div>
                  <ul className="mt-2 list-disc ml-5">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
              <div className="text-sm text-gray-300">Template: <span className="font-medium text-white">{selected.title}</span></div>
              <div className="text-xs text-gray-400">{selected.description}</div>

              <div className="grid gap-3 md:grid-cols-2">
                {selected.fields.map((f) => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-300">{f.label}</label>
                    {f.type === 'text' || f.type === 'number' ? (
                      <input
                        type={f.type}
                        value={values[f.name] ?? ''}
                        placeholder={f.placeholder || ''}
                        onChange={(e) => handleChange(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="mt-1 w-full bg-gray-800 px-2 py-2 rounded"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={values[f.name]}
                        onChange={(e) => handleChange(
                          f.name,
                          Array.isArray(f.options) && typeof f.options[0] === 'number' ? Number(e.target.value) : e.target.value
                        )}
                        className="mt-1 w-full bg-gray-800 px-2 py-2 rounded"
                      >
                        {f.options.map((o, idx) => (
                          <option key={`${f.name}-${idx}`} value={o}>{String(o)}</option>
                        ))}
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input type="checkbox" checked={values[f.name] || false} onChange={(e) => handleChange(f.name, e.target.checked)} className="mr-2" />
                          <span className="text-sm text-gray-300">{f.label}</span>
                        </label>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setStep('list')} className="px-3 py-2 bg-gray-700 rounded-md">Back</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md text-white">Create Project</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
