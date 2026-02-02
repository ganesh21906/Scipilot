import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useGsapFadeIn, useGsapSlideIn } from '../hooks/useGsap'

export default function ProjectInfo() {
  const formRef = useRef(null)
  const houseRef = useRef(null)
  const modernRef = useRef(null)
  useGsapFadeIn(formRef, { delay: 0.05 })

  const { project, setProject } = useProject()
  const navigate = useNavigate()

  const [projectType, setProjectType] = useState(project.projectType || 'Bridge')
  const [houseStyle, setHouseStyle] = useState(project.houseStyle || '')
  const [estimatedCost, setEstimatedCost] = useState(project.estimatedCost || '')
  const [landSize, setLandSize] = useState(project.landSize || '')
  const [location, setLocation] = useState(project.location || '')

  // animate conditional sections when they mount
  useEffect(() => {
    if (projectType === 'House' && houseRef.current) useGsapSlideIn(houseRef, { delay: 0.05 })
  }, [projectType])

  useEffect(() => {
    if (houseStyle === 'Modern' && modernRef.current) useGsapSlideIn(modernRef, { delay: 0.05, x: 12 })
  }, [houseStyle])

  function handleProjectTypeChange(e) {
    const val = e.target.value
    setProjectType(val)
    // clear house-related fields when switching off House
    if (val !== 'House') {
      setHouseStyle('')
      setEstimatedCost('')
      setLandSize('')
      setLocation('')
      setProject({ projectType: val, houseStyle: undefined, estimatedCost: undefined, landSize: undefined, location: undefined })
    } else {
      setProject({ projectType: val })
    }
  }

  function handleHouseStyleChange(e) {
    const val = e.target.value
    setHouseStyle(val)
    setProject({ houseStyle: val })
  }

  function handleModernFieldChange(field, value) {
    // coerce numbers for numeric fields
    const parsed = field === 'estimatedCost' || field === 'landSize' ? (value === '' ? '' : Number(value)) : value
    if (field === 'estimatedCost') setEstimatedCost(parsed)
    if (field === 'landSize') setLandSize(parsed)
    if (field === 'location') setLocation(parsed)
    setProject({ [field]: parsed })
  }

  function onContinue(e) {
    e.preventDefault()
    // basic validation could go here; for now persist and go to /home
    setProject({ projectType, houseStyle, estimatedCost: estimatedCost || undefined, landSize: landSize || undefined, location: location || undefined })
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-6">
      <form
        ref={formRef}
        onSubmit={onContinue}
        className="w-full max-w-2xl bg-slate-800/60 backdrop-blur rounded-xl shadow-lg p-6 ring-1 ring-slate-700"
      >
        <h2 className="text-2xl font-semibold text-indigo-200">What is your project?</h2>
        <p className="mt-1 text-sm text-slate-400">Tell SciPilot a bit about the structure you want to analyze.</p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-300">Project Type</label>
          <select
            value={projectType}
            onChange={handleProjectTypeChange}
            className="mt-2 block w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 p-2"
          >
            <option>Bridge</option>
            <option>House</option>
            <option>Tunnel</option>
            <option>Dam</option>
          </select>
        </div>

        {projectType === 'House' && (
          <div ref={houseRef} className="mt-6 gsap-item">
            <label className="block text-sm font-medium text-slate-300">House style</label>
            <div className="mt-2 flex gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="houseStyle"
                  value="Modern"
                  checked={houseStyle === 'Modern'}
                  onChange={handleHouseStyleChange}
                  className="accent-indigo-400 w-4 h-4"
                />
                <span className="text-sm text-slate-200">Modern</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="houseStyle"
                  value="Traditional"
                  checked={houseStyle === 'Traditional'}
                  onChange={handleHouseStyleChange}
                  className="accent-indigo-400 w-4 h-4"
                />
                <span className="text-sm text-slate-200">Traditional</span>
              </label>
            </div>

            {houseStyle === 'Modern' && (
              <div ref={modernRef} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 gsap-item">
                <div>
                  <label className="block text-sm text-slate-300">Estimated Cost</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => handleModernFieldChange('estimatedCost', e.target.value)}
                    placeholder="e.g. 250000"
                    className="mt-2 block w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">Land Size (sqm)</label>
                  <input
                    type="number"
                    value={landSize}
                    onChange={(e) => handleModernFieldChange('landSize', e.target.value)}
                    placeholder="e.g. 500"
                    className="mt-2 block w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => handleModernFieldChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="mt-2 block w-full rounded-md bg-slate-900 border border-slate-700 text-slate-100 p-2"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white shadow"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}
