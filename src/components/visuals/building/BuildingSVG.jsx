import React from 'react'

// Residential apartment blueprint (3BHK/4BHK) with doors, windows, labels
export default function BuildingSVG({ className = '', bhk = 3 }) {
  const P = {
    bg: '#0b2342',
    grid: '#14365f',
    ink: '#e6f3ff',
    acc: '#9bd3ff',
  }

  const gridLines = []
  for (let x = 0; x <= 1200; x += 20) gridLines.push(<line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={500} stroke={P.grid} strokeWidth="1" />)
  for (let y = 0; y <= 500; y += 20) gridLines.push(<line key={`gy-${y}`} x1={0} y1={y} x2={1200} y2={y} stroke={P.grid} strokeWidth="1" />)

  // Helpers
  const Door = ({ x, y, r = 18, dir = 'right' }) => {
    // dir: right,left,up,down
    let arc
    if (dir === 'right') arc = `M ${x} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y + r}`
    else if (dir === 'left') arc = `M ${x} ${y} A ${r} ${r} 0 0 0 ${x - r} ${y + r}`
    else if (dir === 'up') arc = `M ${x} ${y} A ${r} ${r} 0 0 0 ${x + r} ${y - r}`
    else arc = `M ${x} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y + r}`
    return <path d={arc} stroke={P.acc} fill="none" strokeWidth="1.5" />
  }

  const Window = ({ x1, y1, x2, y2 }) => (
    <g stroke={P.acc} strokeWidth="2">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={(x1 + x2) / 2} y1={(y1 + y2) / 2} x2={x2} y2={y2} opacity="0.7" />
    </g>
  )

  // Unit rect area on left
  const unit = { x: 60, y: 60, w: 700, h: 380 }

  // Layout presets
  const is4 = Number(bhk) === 4
  const rooms = [
    { key: 'foyer', name: 'FOYER', x: unit.x + 10, y: unit.y + 290, w: 90, h: 50 },
    { key: 'living', name: 'LIVING / DINING', x: unit.x + 110, y: unit.y + 230, w: 260, h: 110 },
    { key: 'kitchen', name: 'KITCHEN', x: unit.x + 380, y: unit.y + 250, w: 120, h: 90 },
    { key: 'utility', name: 'UTILITY', x: unit.x + 500, y: unit.y + 270, w: 80, h: 70 },
    { key: 'mbed', name: 'MASTER BED', x: unit.x + 100, y: unit.y + 80, w: 200, h: 120 },
    { key: 'mbath', name: 'TOILET', x: unit.x + 300, y: unit.y + 120, w: 70, h: 80 },
    { key: 'bed2', name: 'BED 2', x: unit.x + 380, y: unit.y + 110, w: 150, h: 110 },
    { key: 'cbath', name: 'TOILET', x: unit.x + 540, y: unit.y + 150, w: 80, h: 70 },
    { key: 'bal', name: 'BALCONY', x: unit.x + 110, y: unit.y + 340, w: 200, h: 40 },
  ]
  if (is4) {
    rooms.push({ key: 'bed3', name: 'BED 3', x: unit.x + 540, y: unit.y + 90, w: 120, h: 110 })
  }

  return (
    <svg className={className} viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={P.acc} />
        </marker>
      </defs>

      <rect x="0" y="0" width="1200" height="500" fill={P.bg} />
      <g opacity="0.6">{gridLines}</g>

      {/* Title block */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo" fill={P.ink} stroke={P.ink}>
        <rect x="900" y="24" width="280" height="140" fill="none" strokeWidth="2" />
        <text x="916" y="50" fontSize="16" fontWeight="700">APARTMENT UNIT PLAN — {is4 ? '4BHK' : '3BHK'}</text>
        <text x="916" y="74" fontSize="12">Scale: 1:100</text>
        <text x="916" y="96" fontSize="12">Super Area: {is4 ? '172' : '142'} m²</text>
        <text x="916" y="118" fontSize="12">Carpet Area: {is4 ? '135' : '112'} m²</text>
      </g>

      {/* Unit outer walls */}
      <g stroke={P.ink} fill="none">
        <rect x={unit.x} y={unit.y} width={unit.w} height={unit.h} strokeWidth="3" />
        {/* inner walls/rooms */}
        {rooms.map(r => (
          <g key={r.key}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} strokeWidth="2" />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2} fill={P.ink} fontSize="12" fontFamily="ui-monospace" textAnchor="middle">{r.name}</text>
          </g>
        ))}

        {/* Doors (example placements) */}
        <Door x={unit.x + 110} y={unit.y + 280} dir="right" /> {/* foyer to living */}
        <Door x={unit.x + 370} y={unit.y + 280} dir="right" /> {/* living to kitchen */}
        <Door x={unit.x + 300} y={unit.y + 160} dir="left" /> {/* master toilet */}
        <Door x={unit.x + 520} y={unit.y + 180} dir="left" /> {/* common toilet */}
        {is4 && <Door x={unit.x + 650} y={unit.y + 140} dir="down" />}

        {/* Windows */}
        <Window x1={unit.x + 110} y1={unit.y + 340} x2={unit.x + 310} y2={unit.y + 340} />
        <Window x1={unit.x + 380} y1={unit.y + 110} x2={unit.x + 530} y2={unit.y + 110} />
        <Window x1={unit.x + 600} y1={unit.y + 150} x2={unit.x + 740} y2={unit.y + 150} />
      </g>

      {/* Simple dimension strings on two sides */}
      <g stroke={P.acc} fill={P.acc} fontFamily="ui-monospace" fontSize="12" markerStart="url(#arr)" markerEnd="url(#arr)">
        <line x1={unit.x} y1={unit.y + unit.h + 20} x2={unit.x + unit.w} y2={unit.y + unit.h + 20} />
        <text x={unit.x + unit.w / 2} y={unit.y + unit.h + 16} textAnchor="middle">{(unit.w/10).toFixed(1)} m</text>
        <line x1={unit.x - 20} y1={unit.y} x2={unit.x - 20} y2={unit.y + unit.h} />
        <text x={unit.x - 24} y={unit.y + unit.h/2} transform={`rotate(-90, ${unit.x - 24}, ${unit.y + unit.h/2})`}>{(unit.h/10).toFixed(1)} m</text>
      </g>

      {/* Legend list */}
      <g transform="translate(900,190)" fill={P.ink} fontFamily="ui-monospace" fontSize="12">
        <text x="0" y="0">ROOM LEGEND</text>
        {rooms.map((r,i)=> (
          <text key={r.key} x="0" y={18 + i*16}>{i+1}. {r.name}</text>
        ))}
      </g>

      {/* caption */}
      <text x="60" y="40" fill={P.acc} fontFamily="ui-monospace" fontSize="12">Residential unit blueprint with indicative walls, doors, windows and areas</text>
    </svg>
  )
}
 
