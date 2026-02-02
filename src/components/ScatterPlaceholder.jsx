import React, { useRef } from 'react'
import { gsap } from 'gsap'

export default function ScatterPlaceholder({ className = '' }) {
  const svgRef = useRef(null)
  const points = Array.from({ length: 25 }).map(() => ({ x: 10 + Math.random() * 300, y: 10 + Math.random() * 140 }))

  const handleEnter = () => {
    try {
      gsap.to(svgRef.current, { scale: 1.03, duration: 0.28, transformOrigin: '50% 50%', ease: 'power2.out' })
    } catch (e) {}
  }
  const handleLeave = () => {
    try {
      gsap.to(svgRef.current, { scale: 1, duration: 0.28, ease: 'power2.out' })
    } catch (e) {}
  }

  return (
    <div className="w-full h-full" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <svg ref={svgRef} className={className} viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="10" fill="#0b1220" />
        <g transform="translate(30,20)" fill="#94a3b8">
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={i} x1={0} x2={320} y1={i * 40} y2={i * 40} stroke="#0f172a" strokeWidth="1" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={'v' + i} x1={i * 40} x2={i * 40} y1={0} y2={160} stroke="#0f172a" strokeWidth="1" />
          ))}

          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill="#64748b" opacity="0.9" />
          ))}

          <circle cx={220} cy={60} r={6} fill="#fb923c" stroke="#fff2" strokeWidth="1.2" />
          <text x={230} y={56} fill="#f1f5f9" fontSize="11">Best</text>
        </g>
      </svg>
    </div>
  )
}
