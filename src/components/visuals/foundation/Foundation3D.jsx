import React, { useMemo } from 'react'
import * as THREE from 'three'

// Foundation3D renders a simple isolated footing with pedestal/columns and rebar,
// designed to be placed inside the shared Canvas in Results.jsx (returns a <group> only).
export default function Foundation3D({
  footing = { lx: 8, lz: 8, t: 1 }, // meters (scaled units)
  pedestal = { lx: 3, lz: 3, h: 1.2 },
  column = { b: 0.6, h: 3, count: 2, spacing: 2.5 }, // two columns on the pedestal by default
  soil = { lx: 24, lz: 24, t: 0.5 },
  rebar = { grid: 6, dia: 0.08 },
}) {
  const baseY = -2.8

  const soilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5b4a3a', roughness: 0.95 }), [])
  const concMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d6dce3', roughness: 0.9 }), [])
  const colMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cfd6dd', roughness: 0.85 }), [])
  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#66707a', roughness: 0.6, metalness: 0.7 }), [])

  // helpers
  const colPositions = useMemo(() => {
    const positions = []
    const c = column.count
    if (c <= 1) return [[0, 0, 0]]
    const span = (c - 1) * column.spacing
    for (let i = 0; i < c; i++) {
      positions.push([-span / 2 + i * column.spacing, 0, 0])
    }
    return positions
  }, [column.count, column.spacing])

  const rebarLines = useMemo(() => {
    const lines = []
    const n = rebar.grid
    const padX = footing.lx * 0.85
    const padZ = footing.lz * 0.85
    for (let i = 0; i < n; i++) {
      const x = -padX / 2 + (i / (n - 1)) * padX
      lines.push({ start: [x, 0, -padZ / 2], end: [x, 0, padZ / 2] })
    }
    for (let i = 0; i < n; i++) {
      const z = -padZ / 2 + (i / (n - 1)) * padZ
      lines.push({ start: [-padX / 2, 0, z], end: [padX / 2, 0, z] })
    }
    return lines
  }, [rebar.grid, footing.lx, footing.lz])

  return (
    <group position={[0, baseY, 0]}>
      {/* Soil pad */}
      <mesh position={[0, -soil.t / 2 - 0.01, 0]} receiveShadow>
        <boxGeometry args={[soil.lx, soil.t, soil.lz]} />
        <primitive object={soilMat} attach="material" />
      </mesh>

      {/* Footing block */}
      <mesh position={[0, footing.t / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[footing.lx, footing.t, footing.lz]} />
        <primitive object={concMat} attach="material" />
      </mesh>

      {/* Rebar grid (top of footing) */}
      <group position={[0, footing.t + 0.03, 0]}>
        {rebarLines.map((l, i) => {
          const start = new THREE.Vector3(...l.start)
          const end = new THREE.Vector3(...l.end)
          const len = start.distanceTo(end)
          const ang = Math.atan2(end.x - start.x, end.z - start.z)
          return (
            <group key={i} position={[start.x, 0, start.z]} rotation={[0, ang, 0]}>
              <mesh>
                <cylinderGeometry args={[rebar.dia / 2, rebar.dia / 2, len, 8]} />
                <primitive object={steelMat} attach="material" />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Pedestal */}
      <mesh position={[0, footing.t + pedestal.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[pedestal.lx, pedestal.h, pedestal.lz]} />
        <primitive object={concMat} attach="material" />
      </mesh>

      {/* Columns on pedestal */}
      {colPositions.map(([x, , z], idx) => (
        <mesh key={idx} position={[x, footing.t + pedestal.h + column.h / 2, z]} castShadow>
          <boxGeometry args={[column.b, column.h, column.b]} />
          <primitive object={colMat} attach="material" />
        </mesh>
      ))}

      {/* Anchor bolts / starter bars at column bases */}
      {colPositions.map(([x, , z], idx) => (
        <group key={`bars-${idx}`} position={[x, footing.t + pedestal.h + 0.05, z]}>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
            <mesh key={i} position={[sx * (column.b / 2 - 0.08), 0.25, sz * (column.b / 2 - 0.08)]}>
              <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
              <primitive object={steelMat} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Soft lighting (works within shared Canvas) */}
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 6, 6]} intensity={0.7} />
    </group>
  )
}
