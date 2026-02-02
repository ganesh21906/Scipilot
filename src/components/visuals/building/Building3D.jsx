import React, { useMemo } from 'react'
import * as THREE from 'three'

function Wall({ a, b, t = 0.2, h = 3, color = '#e5e7eb' }) {
  // a and b are [x, z] in meters in unit-local coords (centered conversion is handled by caller)
  const { pos, rotY, len } = useMemo(() => {
    const ax = a[0], az = a[1]
    const bx = b[0], bz = b[1]
    const dx = bx - ax
    const dz = bz - az
    const L = Math.hypot(dx, dz)
    const mid = [(ax + bx) / 2, (az + bz) / 2]
    const yaw = Math.atan2(dx, dz)
    return { pos: [mid[0], h / 2, mid[1]], rotY: yaw, len: L }
  }, [a, b, h])

  return (
    <mesh position={[pos[0], pos[1], pos[2]]} rotation={[0, rotY, 0]} castShadow receiveShadow>
      <boxGeometry args={[t, h, len]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
    </mesh>
  )
}

function WallWithDoor({ a, b, doorAt = 0.5, doorW = 0.9, t = 0.18, h = 2.4, color = '#e5e7eb' }) {
  // Split wall into two segments around a centered door opening at fraction doorAt along length
  const parts = useMemo(() => {
    const ax = a[0], az = a[1]
    const bx = b[0], bz = b[1]
    const dx = bx - ax
    const dz = bz - az
    const L = Math.hypot(dx, dz)
    const ux = dx / L
    const uz = dz / L
    const gap = Math.min(doorW, L - 0.2)
    const centerDist = L * doorAt
    const leftEnd = centerDist - gap / 2
    const rightStart = centerDist + gap / 2
    const p0 = [ax, az]
    const p1 = [ax + ux * leftEnd, az + uz * leftEnd]
    const p2 = [ax + ux * rightStart, az + uz * rightStart]
    const p3 = [bx, bz]
    return [
      { a: p0, b: p1 },
      { a: p2, b: p3 },
    ]
  }, [a, b, doorAt, doorW])

  // compute hinge and door leaf pose (simple 60° open leaf)
  const leaf = useMemo(() => {
    const ax = a[0], az = a[1]
    const bx = b[0], bz = b[1]
    const dx = bx - ax
    const dz = bz - az
    const L = Math.hypot(dx, dz)
    const ux = dx / L
    const uz = dz / L
    const centerDist = L * doorAt
    const hinge = [ax + ux * (centerDist - doorW / 2), az + uz * (centerDist - doorW / 2)]
    const yaw = Math.atan2(dx, dz)
    return { hinge, yaw }
  }, [a, b, doorAt, doorW])

  return (
    <group>
      {parts.map((s, i) => (
        <Wall key={i} a={s.a} b={s.b} t={t} h={h} color={color} />
      ))}
      {/* simple door leaf */}
      <group position={[leaf.hinge[0], h * 0.9, leaf.hinge[1]]} rotation={[0, leaf.yaw + THREE.MathUtils.degToRad(60), 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[t * 0.8, h * 0.9, doorW]} />
          <meshStandardMaterial color="#8b5e3c" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

function Slab({ w, d, th = 0.2, y = 0, color = '#d8c3a5' }) {
  return (
    <mesh position={[0, y - th / 2, 0]} receiveShadow castShadow>
      <boxGeometry args={[w, th, d]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

function GlassRibbon({ a, b, sill = 1.0, h = 1.0, t = 0.06, color = '#8ecaff' }) {
  // Simple window ribbon flush with exterior
  const { pos, rotY, len } = useMemo(() => {
    const ax = a[0], az = a[1]
    const bx = b[0], bz = b[1]
    const dx = bx - ax
    const dz = bz - az
    const L = Math.hypot(dx, dz)
    const mid = [(ax + bx) / 2, (az + bz) / 2]
    const yaw = Math.atan2(dx, dz)
    return { pos: [mid[0], sill + h / 2, mid[1]], rotY: yaw, len: L }
  }, [a, b, sill, h])

  return (
    <mesh position={[pos[0], pos[1], pos[2]]} rotation={[0, rotY, 0]} castShadow>
      <boxGeometry args={[t, h, len - 0.4]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} transparent opacity={0.6} />
    </mesh>
  )
}

function Furniture() {
  // Minimal placeholders: bed, sofa, table, counters
  return (
    <group>
      {/* Bed (master) */}
      <mesh position={[-3.5, 0.25, -1.5]} castShadow>
        <boxGeometry args={[2.0, 0.5, 1.8]} />
        <meshStandardMaterial color="#cfd9e0" roughness={0.8} />
      </mesh>
      {/* Sofa in living */}
      <mesh position={[1.0, 0.3, 2.2]} castShadow>
        <boxGeometry args={[2.2, 0.6, 0.9]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>
      {/* Dining table */}
      <mesh position={[0.5, 0.78, 1.8]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.8]} />
        <meshStandardMaterial color="#c4a484" roughness={0.6} />
      </mesh>
      {/* Kitchen counter */}
      <mesh position={[3.6, 0.9, 2.6]} castShadow>
        <boxGeometry args={[1.6, 0.9, 0.6]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function Building3D() {
  // Global baseline matches Results environment
  const baseY = -2.5

  // Tower dimensions (meters)
  const floors = 12
  const floorH = 3.0
  const towerW = 14.0
  const towerD = 8.5
  const podiumH = 3.0
  const towerH = floors * floorH

  // Window grid
  const colsW = 8 // along width faces
  const colsD = 6 // along depth faces
  const winW = towerW / (colsW + 2)
  const winD = towerD / (colsD + 2)
  const winH = 1.4
  const sill = 1.0

  const cityBlocks = useMemo(() => {
    const arr = []
    const rings = [
      { r: 30, n: 10, h: [6, 18] },
      { r: 60, n: 14, h: [8, 30] },
    ]
    rings.forEach(({ r, n, h }) => {
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2
        const x = Math.cos(ang) * (r + (i % 3))
        const z = Math.sin(ang) * (r + (i % 5))
        const w = 6 + (i % 3)
        const d = 6 + ((i + 1) % 3)
        const ht = h[0] + (i % (h[1] - h[0]))
        arr.push({ x, z, w, d, h: ht })
      }
    })
    return arr
  }, [])

  return (
    <group position={[0, baseY, 0]}>
      {/* Ground plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial color="#dfe7ef" roughness={1} />
      </mesh>

      {/* Podium */}
      <mesh position={[0, podiumH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[towerW + 4, podiumH, towerD + 4]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
      </mesh>

      {/* Tower core */}
      <mesh position={[0, podiumH + towerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[towerW, towerH, towerD]} />
        <meshStandardMaterial color="#bfc9d6" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Floor spandrel bands */}
      {Array.from({ length: floors + 1 }).map((_, i) => (
        <mesh key={`band-${i}`} position={[0, podiumH + i * floorH, 0]} castShadow>
          <boxGeometry args={[towerW + 0.1, 0.08, towerD + 0.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      ))}

      {/* Windows on width faces (north/south) */}
      {Array.from({ length: floors }).map((_, f) => (
        Array.from({ length: colsW }).map((_, c) => (
          <>
            <mesh key={`wN-${f}-${c}`} position={[
              -towerW / 2 + (c + 1) * (towerW / (colsW + 1)),
              podiumH + sill + f * floorH + winH / 2,
              towerD / 2 + 0.02,
            ]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[winW * 0.7, winH, 0.04]} />
              <meshStandardMaterial color="#8ecaff" transparent opacity={0.7} roughness={0.2} metalness={0.2} />
            </mesh>
            <mesh key={`wS-${f}-${c}`} position={[
              -towerW / 2 + (c + 1) * (towerW / (colsW + 1)),
              podiumH + sill + f * floorH + winH / 2,
              -towerD / 2 - 0.02,
            ]} rotation={[0, Math.PI, 0]} castShadow>
              <boxGeometry args={[winW * 0.7, winH, 0.04]} />
              <meshStandardMaterial color="#8ecaff" transparent opacity={0.7} roughness={0.2} metalness={0.2} />
            </mesh>
          </>
        ))
      ))}

      {/* Windows on depth faces (east/west) */}
      {Array.from({ length: floors }).map((_, f) => (
        Array.from({ length: colsD }).map((_, c) => (
          <>
            <mesh key={`wE-${f}-${c}`} position={[
              towerW / 2 + 0.02,
              podiumH + sill + f * floorH + winH / 2,
              -towerD / 2 + (c + 1) * (towerD / (colsD + 1)),
            ]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[winD * 0.7, winH, 0.04]} />
              <meshStandardMaterial color="#8ecaff" transparent opacity={0.7} roughness={0.2} metalness={0.2} />
            </mesh>
            <mesh key={`wW-${f}-${c}`} position={[
              -towerW / 2 - 0.02,
              podiumH + sill + f * floorH + winH / 2,
              -towerD / 2 + (c + 1) * (towerD / (colsD + 1)),
            ]} rotation={[0, -Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[winD * 0.7, winH, 0.04]} />
              <meshStandardMaterial color="#8ecaff" transparent opacity={0.7} roughness={0.2} metalness={0.2} />
            </mesh>
          </>
        ))
      ))}

      {/* Roof equipment & parapet */}
      <mesh position={[0, podiumH + towerH + 0.5, 0]} castShadow>
        <boxGeometry args={[towerW - 4, 1.0, towerD - 3]} />
        <meshStandardMaterial color="#9aa7b5" roughness={0.7} />
      </mesh>
      <mesh position={[0, podiumH + towerH + 0.1, 0]} castShadow>
        <boxGeometry args={[towerW, 0.2, towerD]} />
        <meshStandardMaterial color="#8b98a8" />
      </mesh>

      {/* Simple city background */}
      {cityBlocks.map((b, i) => (
        <mesh key={`blk-${i}`} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#cfd6de" roughness={0.85} />
        </mesh>
      ))}

      {/* Surrounding road ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <ringGeometry args={[18, 22, 64]} />
        <meshStandardMaterial color="#c0c8d2" />
      </mesh>
    </group>
  )
}
