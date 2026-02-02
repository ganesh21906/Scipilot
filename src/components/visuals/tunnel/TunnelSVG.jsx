import React from 'react'

// Daytime tunnel elevation/section in the app's clean theme
export default function TunnelSVG() {
  return (
    <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe8ff" />
          <stop offset="100%" stopColor="#eaf4ff" />
        </linearGradient>
        <linearGradient id="pav" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3544" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>
      <rect width="900" height="500" fill="url(#sky)"/>

      {/* Rock slopes */}
      <path d="M0,340 L140,260 L260,300 L380,240 L520,310 L660,260 L820,300 L900,260 L900,500 L0,500 Z" fill="#9aa6b2" opacity="0.5"/>

      {/* Apron pavement */}
      <rect x="80" y="360" width="740" height="30" fill="url(#pav)" stroke="#0f172a" strokeWidth="1" opacity="0.95"/>

      {/* Portal wall */}
      <rect x="120" y="230" width="660" height="140" rx="6" fill="#cfd6dd" stroke="#b2bbc4"/>

      {/* Twin arch portals */}
      <g transform="translate(270, 250)">
        <path d="M0,120 A100,100 0 0 1 200,120 L200,140 L0,140 Z" fill="#bfc7d0" />
        <path d="M20,120 A80,80 0 0 1 180,120 L180,140 L20,140 Z" fill="#202a36" />
        {/* road */}
        <rect x="40" y="140" width="120" height="14" fill="#1f2937" />
        {/* dashes */}
        {Array.from({length:6}).map((_,i)=> (
          <rect key={i} x={55+i*20} y="146" width="12" height="2.5" fill="#e5edf5" />
        ))}
        {/* lights */}
        {Array.from({length:6}).map((_,i)=> (
          <rect key={`l-${i}`} x={38+i*26} y="132" width="18" height="3" fill="#fff7cc" />
        ))}
      </g>
      <g transform="translate(460, 250)">
        <path d="M0,120 A100,100 0 0 1 200,120 L200,140 L0,140 Z" fill="#bfc7d0" />
        <path d="M20,120 A80,80 0 0 1 180,120 L180,140 L20,140 Z" fill="#202a36" />
        <rect x="40" y="140" width="120" height="14" fill="#1f2937" />
        {Array.from({length:6}).map((_,i)=> (
          <rect key={i} x={55+i*20} y="146" width="12" height="2.5" fill="#e5edf5" />
        ))}
        {Array.from({length:6}).map((_,i)=> (
          <rect key={`l-${i}`} x={38+i*26} y="132" width="18" height="3" fill="#fff7cc" />
        ))}
      </g>

      {/* Sign board */}
      <rect x="420" y="205" width="120" height="28" rx="3" fill="#3b82f6" stroke="#275aa9"/>
      <text x="480" y="224" textAnchor="middle" fontFamily="Segoe UI" fontSize="12" fill="#e7f1ff">Tunnel - Keep Left</text>

      {/* Legend */}
      <g fontFamily="Segoe UI" fontSize="12" fill="#334155">
        <rect x="120" y="420" width="660" height="56" rx="6" fill="#f5f7fa" stroke="#c7d0da" />
        <text x="150" y="446">A. Portal wall</text>
        <text x="320" y="446">B. Arch lining</text>
        <text x="480" y="446">C. Roadway + markings</text>
        <text x="710" y="446">D. Lighting</text>
      </g>
    </svg>
  )
}
