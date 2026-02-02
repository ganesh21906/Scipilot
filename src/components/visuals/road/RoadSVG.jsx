import React from 'react'
import { useProject } from '../../../context/ProjectContext'

// RoadSVG: plan view of a road with 2–3 junctions
export default function RoadSVG() {
  const { project } = useProject()
  const m = project?.meta || {}
  const junctions = Math.min(3, Math.max(2, Number(m.junctions ?? 3)))

  const bg = '#071428'
  const asphalt = '#0f172a'
  const edge = '#e5e7eb'
  const dash = '#f8fafc'

  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <rect width="100%" height="100%" fill={bg} />

      {/* Main road (E-W) */}
      <rect x="60" y="210" width="680" height="64" fill={asphalt} rx="4" />
      {/* Edge lines */}
      <rect x="60" y="214" width="680" height="4" fill={edge} opacity="0.9" />
      <rect x="60" y="270" width="680" height="4" fill={edge} opacity="0.9" />
      {/* Center dashes */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={70 + i * 30} y={240} width="18" height="4" fill={dash} />
      ))}

      {/* Central cross road (N-S) */}
      <rect x="368" y="80" width="64" height="320" fill={asphalt} rx="4" />
      <rect x="372" y="80" width="4" height="320" fill={edge} opacity="0.9" />
      <rect x="424" y="80" width="4" height="320" fill={edge} opacity="0.9" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={396} y={90 + i * 20} width="8" height="12" fill={dash} />
      ))}

      {/* Zebra crossings at the main intersection */}
      {[-1, 1].map((s, i) => (
        <g key={i} transform={`translate(0, ${s * 38})`}>
          {Array.from({ length: 12 }).map((_, j) => (
            <rect key={j} x={300 + j * 20} y={230} width="12" height="6" fill={dash} />
          ))}
        </g>
      ))}
      {[-1, 1].map((s, i) => (
        <g key={`zv-${i}`} transform={`translate(${s * 38}, 0)`}>
          {Array.from({ length: 10 }).map((_, j) => (
            <rect key={j} x={388} y={200 + j * 16} width="6" height="10" fill={dash} />
          ))}
        </g>
      ))}

      {/* Junction 2: T-branch to North at x ~ 540 */}
      {junctions >= 2 && (
        <g>
          <rect x="540" y="80" width="64" height="130" fill={asphalt} rx="4" />
          <rect x="544" y="80" width="4" height="130" fill={edge} opacity="0.9" />
          <rect x="596" y="80" width="4" height="130" fill={edge} opacity="0.9" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={568} y={88 + i * 18} width="8" height="12" fill={dash} />
          ))}
          {/* stop line */}
          <rect x="548" y="210" width="50" height="4" fill={dash} />
        </g>
      )}

      {/* Junction 3: T-branch to South at x ~ 220 */}
      {junctions >= 3 && (
        <g>
          <rect x="220" y="270" width="64" height="130" fill={asphalt} rx="4" />
          <rect x="224" y="270" width="4" height="130" fill={edge} opacity="0.9" />
          <rect x="276" y="270" width="4" height="130" fill={edge} opacity="0.9" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={248} y={278 + i * 18} width="8" height="12" fill={dash} />
          ))}
          {/* stop line */}
          <rect x="228" y="266" width="50" height="4" fill={dash} />
        </g>
      )}

      {/* Caption */}
      <text x="24" y="40" fill="#dbeafe" fontSize="18" fontWeight="600">Road network — {junctions} junctions</text>
    </svg>
  )
}
