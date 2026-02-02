import React, { useRef } from 'react'
import { gsap } from 'gsap'

export default function LineChartPlaceholder({ className = '' }) {
  const svgRef = useRef(null)

  const handleEnter = () => {
    try {
      gsap.to(svgRef.current, { scale: 1.035, duration: 0.28, transformOrigin: '50% 50%', ease: 'power2.out' })
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
        <g transform="translate(30,20)" strokeWidth="2" fill="none" strokeLinecap="round">
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={i} x1={0} x2={320} y1={i * 40} y2={i * 40} stroke="#0f172a" />
          ))}

          <polyline
            points="0,140 40,110 80,90 120,70 160,80 200,60 240,55 280,45 320,40"
            stroke="#60a5fa"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M0 140 L40 110 L80 90 L120 70 L160 80 L200 60 L240 55 L280 45 L320 40 L320 140 Z" fill="#1e3a8a" opacity="0.12" />
        </g>
      </svg>
    </div>
  )
}
