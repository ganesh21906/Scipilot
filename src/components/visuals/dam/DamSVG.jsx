import React from 'react'

// Stylized daytime dam diagram, aligned with our daytime SVG theme
export default function DamSVG({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* sky gradient */}
        <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#bfe9ff" />
          <stop offset="60%" stopColor="#95d4f8" />
          <stop offset="100%" stopColor="#7bbce9" />
        </linearGradient>

        {/* reservoir water */}
        <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0677a3" />
          <stop offset="60%" stopColor="#045a80" />
          <stop offset="100%" stopColor="#023a56" />
        </linearGradient>

        {/* concrete */}
        <linearGradient id="concreteGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#eceff1" />
          <stop offset="100%" stopColor="#bfc7ce" />
        </linearGradient>

        {/* rock */}
        <linearGradient id="rockGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#2b343b" />
        </linearGradient>

        {/* spillway foam */}
        <linearGradient id="foam" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#c7eefc" stopOpacity="0.35"/>
        </linearGradient>

        {/* subtle drop shadow */}
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.25"/>
        </filter>

        {/* water surface noise (texture) */}
        <pattern id="waterStripe" patternUnits="userSpaceOnUse" width="120" height="12">
          <rect width="120" height="12" fill="rgba(255,255,255,0.02)" />
          <path d="M0 6 H120" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
        </pattern>

      </defs>

      {/* background sky */}
      <rect x="0" y="0" width="1200" height="600" fill="url(#skyGrad)" />

      {/* distant hills */}
      <g transform="translate(0,0)" opacity="0.75">
        <path d="M0 260 C180 200, 360 180, 600 220 C840 260, 980 240, 1200 260 L1200 600 L0 600 Z"
          fill="#7aa6a0" opacity="0.22" />
        <path d="M0 300 C160 260, 420 240, 700 260 C980 280, 1180 260, 1200 300 L1200 600 L0 600 Z"
          fill="#5b8d85" opacity="0.18" />
      </g>

      {/* reservoir water (left side, high) */}
      <g id="reservoir">
        <path
          d="M60 260 Q200 200 360 200 L540 200 Q720 200 820 220 L820 340 L60 340 Z"
          fill="url(#waterGrad)"
        />
        {/* water surface striping */}
        <path
          d="M60 260 Q200 200 360 200 L540 200 Q720 200 820 220"
          fill="none"
          stroke="url(#waterStripe)"
          strokeWidth="28"
          strokeOpacity="0.18"
        />
      </g>

      {/* dam body (center-right) */}
      <g id="dam" transform="translate(260,140)">
        {/* left abutment rock */}
        <path d="M -60 160 L -20 80 L -10 40 L 0 0 L 40 0 L 40 200 Z" fill="url(#rockGrad)" filter="url(#softShadow)" />

        {/* main dam face */}
        <path
          d="M0 0 L420 0 L360 220 L60 220 Z"
          fill="url(#concreteGrad)"
          stroke="#b0b7bd"
          strokeWidth="2"
        />

        {/* vertical panel lines on dam (concrete segments) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 20 + i * 45;
          return <line key={i} x1={x} y1={10} x2={x} y2={200} stroke="#c6ccd1" strokeWidth="1" strokeOpacity="0.6" />;
        })}

        {/* crest walkway */}
        <rect x="0" y="-12" width="420" height="14" rx="4" fill="#d8dee3" stroke="#aeb6bb" />

        {/* intake tower (small) */}
        <rect x="280" y="-60" width="40" height="60" rx="3" fill="#dfe6ea" stroke="#bfc7cc" />
        <rect x="292" y="-40" width="16" height="10" fill="#7aa6a0" opacity="0.35" />

        {/* spillway gates (three) */}
        {[-1, 1, 3].map((n, i) => {
          const gateX = 80 + i * 90;
          return (
            <g key={i} transform={`translate(${gateX}, 40)`}>
              {/* gate opening */}
              <rect x="0" y="0" width="48" height="110" fill="#0f1724" opacity="0.18" />
              {/* gate door */}
              <rect x="4" y="8" width="40" height="96" rx="3" fill="#9aa6ad" stroke="#7f8b92" strokeWidth="1.2" />
              {/* gate rim */}
              <rect x="-6" y="-6" width="60" height="8" rx="4" fill="#bfc7cc" />
            </g>
          );
        })}

        {/* spillway flow - curved white foam */}
        <g transform="translate(80, 152)">
          <path d="M0 0 C30 22, 60 28, 120 30 C180 32, 220 24, 280 0" fill="none" stroke="url(#foam)" strokeWidth="34" strokeLinecap="round" strokeOpacity="0.95" />
          <path d="M0 18 C40 36, 90 44, 140 44 C190 44, 240 36, 280 18" fill="none" stroke="url(#foam)" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.8" />
        </g>

        {/* downstream water pool */}
        <g transform="translate(0,220)">
          <rect x="-40" y="0" width="520" height="120" fill="#083645" opacity="0.95" />
          {/* reflection highlight */}
          <path d="M0 16 C60 6, 120 4, 180 8 C240 12, 300 18, 360 20 L360 60 L0 60 Z" fill="rgba(255,255,255,0.03)" />
        </g>

        {/* shadow under dam */}
        <ellipse cx="200" cy="356" rx="220" ry="18" fill="#000" opacity="0.12" />

        {/* concrete base footing */}
        <rect x="20" y="210" width="380" height="16" fill="#cfd6da" stroke="#b6bdc2" />
      </g>

      {/* right-side abutment rock */}
      <g transform="translate(680,260)">
        <path d="M0 0 L60 -40 L120 -20 L140 24 L140 160 L0 160 Z" fill="url(#rockGrad)" filter="url(#softShadow)" />
      </g>

      {/* top-of-image controls/legend */}
      <g transform="translate(880,18)">
        <rect x="0" y="0" width="280" height="120" rx="10" fill="#032a31" opacity="0.9" stroke="#0b4a55" />
        <text x="18" y="28" fill="#d2f0f6" fontSize="14" fontWeight="700">Dam Diagram</text>

        <g transform="translate(16,40)">
          <rect x="0" y="0" width="14" height="10" fill="#045a80" />
          <text x="24" y="9" fill="#a7cfdc" fontSize="12">Reservoir (High)</text>
        </g>

        <g transform="translate(16,60)">
          <rect x="0" y="0" width="14" height="10" fill="#9aa6ad" />
          <text x="24" y="9" fill="#a7cfdc" fontSize="12">Concrete Dam</text>
        </g>

        <g transform="translate(16,80)">
          <rect x="0" y="0" width="14" height="10" fill="#efefef" />
          <text x="24" y="9" fill="#a7cfdc" fontSize="12">Spillway Foam</text>
        </g>

        <text x="18" y="110" fill="#89c6d6" fontSize="11">Scale approximated • Stylized view</text>
      </g>

      {/* caption */}
      <text x="40" y="36" fill="#0b3f47" fontSize="13">Concrete dam with spillway gates, reservoir (left) and downstream pool (bottom)</text>
    </svg>
  )
}
