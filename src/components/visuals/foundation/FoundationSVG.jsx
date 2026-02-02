import React from 'react'

// Blueprint-style plan and elevation of an isolated footing with rebar grid
export default function FoundationSVG() {
  const bg = '#071428'
  const line = '#c6d3e1'
  const acc = '#60a5fa'
  const dim = '#94a3b8'

  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1f3a" />
          <stop offset="100%" stopColor="#071428" />
        </linearGradient>
        <pattern id="rebar" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect x="7" y="0" width="2" height="16" fill={acc} opacity="0.9" />
          <rect x="0" y="7" width="16" height="2" fill={acc} opacity="0.9" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sky)" />

      {/* Title */}
      <text x="24" y="40" fill="#dbeafe" fontSize="20" fontWeight="600">Isolated Footing — Plan & Elevation</text>

      {/* Plan view */}
      <g transform="translate(40,80)">
        <rect x="0" y="0" width="320" height="220" fill="#0d223f" stroke={line} />
        {/* footing outline */}
        <rect x="40" y="40" width="240" height="160" fill="#132a4d" stroke={line} />
        {/* rebar grid */}
        <rect x="58" y="58" width="204" height="124" fill="url(#rebar)" opacity="0.6" />
        {/* pedestal */}
        <rect x="140" y="90" width="80" height="80" fill="#163058" stroke={line} />
        {/* columns */}
        <rect x="152" y="102" width="22" height="56" fill="#274d7d" stroke={line} />
        <rect x="186" y="102" width="22" height="56" fill="#274d7d" stroke={line} />
        {/* dims */}
        <g fill={dim} fontSize="12">
          <text x="160" y="26" textAnchor="middle">Footing 2.4 m</text>
          <line x1="40" y1="28" x2="280" y2="28" stroke={dim} strokeDasharray="6 4" />
          <text x="-6" y="125" transform="rotate(-90 -6 125)" textAnchor="middle">2.0 m</text>
          <line x1="-4" y1="40" x2="-4" y2="200" stroke={dim} strokeDasharray="6 4" />
        </g>
      </g>

      {/* Elevation view */}
      <g transform="translate(420,80)">
        <rect x="0" y="0" width="340" height="220" fill="#0d223f" stroke={line} />
        {/* soil */}
        <rect x="0" y="180" width="340" height="40" fill="#3b2f25" opacity="0.8" />
        {/* footing block */}
        <rect x="50" y="150" width="240" height="30" fill="#1a345e" stroke={line} />
        {/* pedestal */}
        <rect x="120" y="110" width="100" height="40" fill="#163058" stroke={line} />
        {/* columns */}
        <rect x="135" y="60" width="25" height="50" fill="#274d7d" stroke={line} />
        <rect x="180" y="60" width="25" height="50" fill="#274d7d" stroke={line} />
        {/* starter bars */}
        <rect x="136" y="102" width="4" height="10" fill={acc} />
        <rect x="156" y="102" width="4" height="10" fill={acc} />
        <rect x="182" y="102" width="4" height="10" fill={acc} />
        <rect x="202" y="102" width="4" height="10" fill={acc} />
        {/* dims */}
        <g fill={dim} fontSize="12">
          <text x="170" y="146" textAnchor="middle">t = 0.30 m</text>
          <text x="170" y="208" textAnchor="middle">Soil</text>
        </g>
      </g>

      {/* Legend */}
      <g transform="translate(40,330)">
        <rect x="0" y="0" width="720" height="110" fill="#0b1f3a" stroke={line} />
        <g fontSize="12" fill="#e2e8f0">
          <text x="16" y="28">Legend:</text>
          <rect x="90" y="16" width="20" height="10" fill="#132a4d" stroke={line} />
          <text x="116" y="25">Footing</text>
          <rect x="180" y="16" width="20" height="10" fill="#163058" stroke={line} />
          <text x="206" y="25">Pedestal</text>
          <rect x="280" y="16" width="20" height="10" fill="#274d7d" stroke={line} />
          <text x="306" y="25">Column</text>
          <rect x="380" y="16" width="20" height="10" fill={acc} />
          <text x="406" y="25">Rebar</text>
        </g>
      </g>
    </svg>
  )
}
