import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGsapFadeIn } from '../hooks/useGsap'

export default function Landing() {
  const nav = useNavigate()

  const rootRef = useRef(null)
  useGsapFadeIn(rootRef)

  // Auto-navigate to /home after a brief welcome
  React.useEffect(() => {
    const t = setTimeout(() => {
      nav('/home')
    }, 2000)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-gray-900/60 backdrop-blur rounded-2xl p-10 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="gsap-item text-4xl font-bold text-white">SciPilot</h1>
            <p className="gsap-item text-gray-400 mt-1">AI-powered structural simulation & optimization</p>
          </div>

          <div className="text-right">
            <div className="gsap-item text-sm text-gray-400">Fast simulations • Explainable agents • Material-aware</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="gsap-item text-2xl font-semibold">Start smarter — build safer</h2>
            <p className="gsap-item text-gray-300 mt-3">Define your project intent and let SciPilot propose optimized designs, trade-offs, and safety checks. Get a simulation-ready model in minutes.</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => nav('/project-intent')}
                className="gsap-item px-5 py-3 bg-orange-500 hover:bg-orange-400 rounded-lg text-white font-medium"
              >
                Start Your Project
              </button>

              <button
                onClick={() => nav('/home')}
                className="gsap-item px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200"
              >
                Explore Dashboard
              </button>
            </div>
          </div>

          <div className="gsap-item bg-gradient-to-tr from-slate-800 to-slate-900 rounded-lg p-4 border border-gray-800">
            <h4 className="text-sm text-gray-300">Why SciPilot</h4>
            <ul className="text-sm text-gray-400 mt-3 space-y-2">
              <li>• Automates structural design exploration with agent-based search.</li>
              <li>• Integrates material models and manufacturing constraints.</li>
              <li>• Visualizes stress and safety factors with interactive 3D.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
