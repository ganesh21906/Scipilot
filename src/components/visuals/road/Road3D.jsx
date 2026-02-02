import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useProject } from '../../../context/ProjectContext'

// Road3D: simple road network with 2–3 junctions. Designed for the shared Canvas (returns a <group> only).
export default function Road3D() {
  const { project } = useProject()
  const meta = project?.meta || {}

  // Params (can be provided via project.meta)
  const junctions = Math.min(3, Math.max(2, Number(meta.junctions ?? 3)))
  const roadW = Number(meta.roadWidth ?? 10)
  const laneW = Number(meta.laneWidth ?? 3.5)
  const baseY = -2.8
  const mainLen = Number(meta.length ?? 160)
  const crossLen = Number(meta.crossLength ?? 120)

  // Materials
  const asphalt = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.95 }), [])
  const marking = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1f5f9' }), [])
  const edgeLine = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e5e7eb' }), [])

  const dashCount = 24
  const dashLen = 3
  const dashGap = 3

  // Helper: place dashed centerline along X or Z
  const CenterDashesX = ({ length, z = 0, x0 = 0 }) => (
    <group>
      {Array.from({ length: dashCount }).map((_, i) => {
        const x = x0 - length / 2 + i * ((length) / dashCount) + 0.5
        return (
          <mesh key={i} position={[x, 0.11, z]}>
            <boxGeometry args={[dashLen, 0.01, 0.18]} />
            <primitive object={marking} attach="material" />
          </mesh>
        )
      })}
    </group>
  )

  const CenterDashesZ = ({ length, x = 0, z0 = 0 }) => (
    <group>
      {Array.from({ length: dashCount }).map((_, i) => {
        const z = z0 - length / 2 + i * ((length) / dashCount) + 0.5
        return (
          <mesh key={i} position={[x, 0.11, z]}>
            <boxGeometry args={[0.18, 0.01, dashLen]} />
            <primitive object={marking} attach="material" />
          </mesh>
        )
      })}
    </group>
  )

  const EdgeLinesX = ({ length, zOff }) => (
    <group>
      <mesh position={[0, 0.11, zOff]}>
        <boxGeometry args={[length, 0.01, 0.08]} />
        <primitive object={edgeLine} attach="material" />
      </mesh>
      <mesh position={[0, 0.11, -zOff]}>
        <boxGeometry args={[length, 0.01, 0.08]} />
        <primitive object={edgeLine} attach="material" />
      </mesh>
    </group>
  )

  const EdgeLinesZ = ({ length, xOff }) => (
    <group>
      <mesh position={[xOff, 0.11, 0]}>
        <boxGeometry args={[0.08, 0.01, length]} />
        <primitive object={edgeLine} attach="material" />
      </mesh>
      <mesh position={[-xOff, 0.11, 0]}>
        <boxGeometry args={[0.08, 0.01, length]} />
        <primitive object={edgeLine} attach="material" />
      </mesh>
    </group>
  )

  return (
    <group position={[0, baseY, 0]}>
      {/* Main E-W road */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[mainLen, 0.2, roadW]} />
        <primitive object={asphalt} attach="material" />
      </mesh>
      <EdgeLinesX length={mainLen} zOff={roadW / 2 - 0.25} />
      <CenterDashesX length={mainLen} z={0} />

      {/* Junction 1: central cross road (N-S) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[roadW, 0.2, crossLen]} />
        <primitive object={asphalt} attach="material" />
      </mesh>
      <EdgeLinesZ length={crossLen} xOff={roadW / 2 - 0.25} />
      <CenterDashesZ length={crossLen} x={0} />

      {/* Zebra crossings at the intersection */}
      {[-roadW / 2 - 0.1, roadW / 2 + 0.1].map((z, i) => (
        <group key={`zebra-x-${i}`} position={[0, 0.12, z]}>
          {Array.from({ length: 10 }).map((_, j) => (
            <mesh key={j} position={[-12 + j * 2.6, 0, 0]}>
              <boxGeometry args={[1.6, 0.01, 0.35]} />
              <primitive object={marking} attach="material" />
            </mesh>
          ))}
        </group>
      ))}
      {[-roadW / 2 - 0.1, roadW / 2 + 0.1].map((x, i) => (
        <group key={`zebra-z-${i}`} position={[x, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
          {Array.from({ length: 10 }).map((_, j) => (
            <mesh key={j} position={[-12 + j * 2.6, 0, 0]}>
              <boxGeometry args={[1.6, 0.01, 0.35]} />
              <primitive object={marking} attach="material" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Junction 2: T-branch to North at x = +50 */}
      {junctions >= 2 && (
        <group>
          <mesh position={[50, 0, roadW / 2 + (crossLen / 4)]} receiveShadow>
            <boxGeometry args={[roadW, 0.2, crossLen / 2]} />
            <primitive object={asphalt} attach="material" />
          </mesh>
          <EdgeLinesZ length={crossLen / 2} xOff={roadW / 2 - 0.25} />
          <CenterDashesZ length={crossLen / 2} x={50} z0={roadW / 2 + (crossLen / 4)} />
          {/* Stop line on minor road */}
          <mesh position={[50, 0.12, roadW / 2 + 0.05]}>
            <boxGeometry args={[2.4, 0.01, 0.2]} />
            <primitive object={marking} attach="material" />
          </mesh>
        </group>
      )}

      {/* Junction 3: T-branch to South at x = -60 */}
      {junctions >= 3 && (
        <group>
          <mesh position={[-60, 0, -roadW / 2 - (crossLen / 4)]} receiveShadow>
            <boxGeometry args={[roadW, 0.2, crossLen / 2]} />
            <primitive object={asphalt} attach="material" />
          </mesh>
          <EdgeLinesZ length={crossLen / 2} xOff={roadW / 2 - 0.25} />
          <CenterDashesZ length={crossLen / 2} x={-60} z0={-roadW / 2 - (crossLen / 4)} />
          <mesh position={[-60, 0.12, -roadW / 2 - 0.05]}>
            <boxGeometry args={[2.4, 0.01, 0.2]} />
            <primitive object={marking} attach="material" />
          </mesh>
        </group>
      )}

      {/* Soft lights for visibility */}
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} intensity={0.7} />
    </group>
  )
}
