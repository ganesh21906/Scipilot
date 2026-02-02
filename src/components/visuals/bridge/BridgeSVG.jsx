import React from 'react'

export default function BridgeSVGWrapper({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Daytime sky gradient */}
        <linearGradient id="bgGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#eaf4ff" />
          <stop offset="60%" stopColor="#d8ecff" />
          <stop offset="100%" stopColor="#cfe8ff" />
        </linearGradient>

        {/* Brighter water for daytime */}
        <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a9e1ff" />
          <stop offset="100%" stopColor="#7fd0ff" />
        </linearGradient>

        <linearGradient id="deckGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2b3440" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

  {/* background sky */}
  <rect x="0" y="0" width="1200" height="500" fill="url(#bgGradient)" />
  {/* sun */}
  <circle cx="150" cy="90" r="28" fill="#ffe9a3" opacity="0.9" />

  {/* distant water layer */}
  <rect x="0" y="360" width="1200" height="140" fill="url(#waterGrad)" />

      {/* centered group for bridge (keeps things aligned) */}
      <g transform="translate(0,0)">
        {/* towers */}
        <g transform="translate(0,0)" fill="#e6eef6" opacity="0.95">
          {/* left tower */}
          <g>
            <rect x="300" y="110" width="28" height="190" rx="3" fill="#cbd5e1" filter="url(#softShadow)" />
            <rect x="294" y="140" width="40" height="6" rx="3" fill="#94a3b8" opacity="0.25" />
            <rect x="294" y="200" width="40" height="6" rx="3" fill="#94a3b8" opacity="0.18" />
          </g>

          {/* right tower */}
          <g>
            <rect x="872" y="110" width="28" height="190" rx="3" fill="#cbd5e1" filter="url(#softShadow)" />
            <rect x="866" y="140" width="40" height="6" rx="3" fill="#94a3b8" opacity="0.25" />
            <rect x="866" y="200" width="40" height="6" rx="3" fill="#94a3b8" opacity="0.18" />
          </g>
        </g>

        {/* deck - slightly curved path */}
        <path
          d="M120 320 C 300 300, 450 290, 600 295 C 750 300, 900 310, 1080 320 L 1080 338 C 900 328, 750 318, 600 323 C 450 328, 300 338, 120 338 Z"
          fill="url(#deckGrad)"
          stroke="#0b1220"
          strokeWidth="1"
          filter="url(#softShadow)"
        />

        {/* deck outline (top) */}
        <path d="M120 320 C 300 300, 450 290, 600 295 C 750 300, 900 310, 1080 320" fill="none" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />

        {/* piers / base supports evenly spaced */}
        <g fill="#0f1724">
          {[200, 360, 520, 680, 840, 1000].map((x, i) => (
            <rect key={i} x={x - 12} y={342} width="24" height="48" rx="3" fill="#0b1220" opacity="0.9" />
          ))}
        </g>

        {/* cables from tower tops to deck anchor points - left tower */}
        <g stroke="#93a7b8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.95">
          {Array.from({ length: 12 }).map((_, i) => {
            const t = i / 11
            const x = 140 + t * (600 - 140)
            return <line key={'cl' + i} x1={314} y1={110} x2={x} y2={320 - (Math.sin(t * Math.PI) * 18)} />
          })}
        </g>

        {/* cables from right tower */}
        <g stroke="#93a7b8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.95">
          {Array.from({ length: 12 }).map((_, i) => {
            const t = i / 11
            const x = 1080 - t * (1080 - 600)
            return <line key={'cr' + i} x1={886} y1={110} x2={x} y2={320 - (Math.sin(t * Math.PI) * 18)} />
          })}
        </g>

        {/* deck lanes (centerline) */}
        <path d="M120 328 C 300 308, 450 298, 600 303 C 750 308, 900 318, 1080 328" fill="none" stroke="#111827" strokeWidth="2" strokeDasharray="6 8" strokeOpacity="0.6" />

        {/* stress overlays aligned with deck segments (semi-transparent) */}
        <g opacity="0.9">
          {/* low stress (green) */}
          <path className="overlay-low" d="M180 316 C 300 305, 380 301, 430 304 L 430 338 C 380 334, 300 330, 180 338 Z" fill="#10b981" opacity="0.12" />

          {/* medium stress (yellow) */}
          <path className="overlay-medium" d="M480 310 C 520 307, 580 306, 640 309 L 640 338 C 580 332, 520 330, 480 338 Z" fill="#f59e0b" opacity="0.16" />

          {/* high stress (red) */}
          <path className="overlay-high" d="M700 308 C 760 305, 820 307, 920 315 L 920 338 C 820 332, 760 330, 700 338 Z" fill="#ef4444" opacity="0.18" />
        </g>

        {/* decorative deck rail */}
        <path d="M120 332 C 300 312, 450 302, 600 307 C 750 312, 900 322, 1080 332" fill="none" stroke="#0f1724" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* legend box (top-right) */}
      <g transform="translate(920,20)" fontFamily="Inter, system-ui, Arial" fill="#cbd5e1">
        <rect x="0" y="0" width="240" height="110" rx="10" fill="#051022" stroke="#12202a" />
        <text x="16" y="26" fontSize="14" fontWeight="700">Stress Legend</text>

        <g transform="translate(14,38)">
          <rect x="0" y="0" width="18" height="12" rx="3" fill="#ef4444" />
          <text x="28" y="10" fontSize="12" fill="#9ca3af">High</text>
        </g>

        <g transform="translate(14,58)">
          <rect x="0" y="0" width="18" height="12" rx="3" fill="#f59e0b" />
          <text x="28" y="10" fontSize="12" fill="#9ca3af">Medium</text>
        </g>

        <g transform="translate(14,78)">
          <rect x="0" y="0" width="18" height="12" rx="3" fill="#10b981" />
          <text x="28" y="10" fontSize="12" fill="#9ca3af">Low</text>
        </g>
      </g>

      {/* caption */}
      <text x="40" y="48" fill="#3b5c77" fontSize="12">Cable-stayed bridge — daytime view with stress overlays</text>
    </svg>
  )
}
