import React, { useMemo } from 'react'
import * as THREE from 'three'

function Cable({ start, end, radius = 0.05, color = '#93a7b8' }) {
  // Compute transform once per cable
  const { mid, quat, len } = useMemo(() => {
    const s = start.clone()
    const e = end.clone()
    const d = new THREE.Vector3().subVectors(e, s)
    const L = d.length()
    const m = s.clone().addScaledVector(d, 0.5)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
    return { mid: m, quat: q, len: L }
  }, [start, end])

  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius, len, 10]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
    </mesh>
  )
}

function Bridge() {
  // Scaled-up scene for better presence
  const span = 160
  const deckWidth = 16
  const deckThickness = 1
  // Add a central median so towers are not on the driving lanes
  const medianWidth = 4
  const carriageHalf = (deckWidth - medianWidth) / 2
  const towerHeight = 45
  const towerLegWidth = 2.2
  const towerSpacing = 80 // distance between tower centers
  const leftTowerX = -towerSpacing / 2
  const rightTowerX = towerSpacing / 2
  const deckY = -2.5
  const railHeight = 1.2
  const railThickness = 0.2
  // Cable planes sit just off the tower faces so cables visibly attach
  const cablePlaneOffset = 1.1
  // Environment plane heights (separate to avoid z-fighting flicker)
  const waterY = deckY - 2.0
  const landY = deckY - 1.2

  const deckMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.9, metalness: 0.1 }), [])
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.35, metalness: 0.6 }), [])
  const railMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.6, metalness: 0.3 }), [])
  const cableColor = '#93a7b8'

  // Anchor x positions along deck for cables (both sides of each tower)
  const anchorsLeft = useMemo(() => {
    const count = 10
    const start = -span / 2 + 8
    const end = leftTowerX - 4
    return Array.from({ length: count }, (_, i) => THREE.MathUtils.lerp(start, end, i / (count - 1)))
  }, [span, leftTowerX])

  const anchorsRight = useMemo(() => {
    const count = 10
    const start = rightTowerX + 4
    const end = span / 2 - 8
    return Array.from({ length: count }, (_, i) => THREE.MathUtils.lerp(start, end, i / (count - 1)))
  }, [span, rightTowerX])

  const zEdge = (deckWidth / 2) - 0.6
  const laneZ = medianWidth / 2 + carriageHalf / 2 // center of each carriageway

  return (
    <group>
      {/* Bridge Deck */}
      <mesh position={[0, deckY, 0]} castShadow receiveShadow>
        <boxGeometry args={[span, deckThickness, deckWidth]} />
        <primitive object={deckMat} attach="material" />
      </mesh>

      {/* Guard rails (outer edges) */}
      <mesh position={[0, deckY + railHeight / 2, zEdge]} castShadow>
        <boxGeometry args={[span, railThickness, 0.2]} />
        <primitive object={railMat} attach="material" />
      </mesh>
      <mesh position={[0, deckY + railHeight / 2, -zEdge]} castShadow>
        <boxGeometry args={[span, railThickness, 0.2]} />
        <primitive object={railMat} attach="material" />
      </mesh>

      {/* Median strip and barriers */}
      <mesh position={[0, deckY + deckThickness / 2 + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[span, 0.12, medianWidth]} />
        <meshStandardMaterial color="#374151" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Median guard rails */}
      <mesh position={[0, deckY + 0.6, medianWidth / 2]} castShadow>
        <boxGeometry args={[span, 0.25, 0.18]} />
        <primitive object={railMat} attach="material" />
      </mesh>
      <mesh position={[0, deckY + 0.6, -medianWidth / 2]} castShadow>
        <boxGeometry args={[span, 0.25, 0.18]} />
        <primitive object={railMat} attach="material" />
      </mesh>

      {/* Lane markings (dashed for each carriageway) */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`lane-left-${i}`} position={[-span / 2 + 6 + i * (span / 24), deckY + deckThickness / 2 + 0.02, laneZ]}>
          <boxGeometry args={[3, 0.02, 0.12]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`lane-right-${i}`} position={[-span / 2 + 6 + i * (span / 24), deckY + deckThickness / 2 + 0.02, -laneZ]}>
          <boxGeometry args={[3, 0.02, 0.12]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* Towers (A-frame) */}
      {[leftTowerX, rightTowerX].map((tx, idx) => (
        <group key={`tower-${idx}`} position={[tx, 0, 0]}>
          {/* left leg */}
          <mesh position={[-towerLegWidth / 2, deckY + towerHeight / 2, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-6)]} castShadow>
            <boxGeometry args={[towerLegWidth, towerHeight, 2]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* right leg */}
          <mesh position={[towerLegWidth / 2, deckY + towerHeight / 2, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(6)]} castShadow>
            <boxGeometry args={[towerLegWidth, towerHeight, 2]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* cross beam */}
          <mesh position={[0, deckY + towerHeight * 0.72, 0]} castShadow>
            <boxGeometry args={[towerLegWidth * 2.2, 1.2, 1.6]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* smooth top joint: curved cap + gusset plates */}
          {/* curved cap (partial torus as an arch between legs) */}
          <mesh position={[0, deckY + towerHeight + 0.4, 0]} castShadow>
            <torusGeometry args={[towerLegWidth * 0.95, 0.35, 12, 48, Math.PI * 0.85]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* subtle flat cap to seal the top seam */}
          <mesh position={[0, deckY + towerHeight + 0.1, 0]} castShadow>
            <boxGeometry args={[towerLegWidth * 1.1, 0.25, 1.7]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* gusset plates at the knee (left/right) */}
          <mesh position={[-towerLegWidth * 0.45, deckY + towerHeight * 0.92, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(-6)]} castShadow>
            <boxGeometry args={[0.5, 1.2, 1.6]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          <mesh position={[towerLegWidth * 0.45, deckY + towerHeight * 0.92, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(6)]} castShadow>
            <boxGeometry args={[0.5, 1.2, 1.6]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* anchor plates where cables meet the tower (left/right faces) */}
          <mesh position={[0, deckY + towerHeight, cablePlaneOffset]} castShadow>
            <boxGeometry args={[1.6, 0.6, 0.4]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          <mesh position={[0, deckY + towerHeight, -cablePlaneOffset]} castShadow>
            <boxGeometry args={[1.6, 0.6, 0.4]} />
            <primitive object={metalMat} attach="material" />
          </mesh>
          {/* pier to water */}
          <mesh position={[0, deckY - 2, 0]} castShadow>
            <boxGeometry args={[3.5, 4, 3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Cables from tower tops to deck anchors on both edges */}
      {/* Left tower */}
      {anchorsLeft.map((ax, i) => (
        <>
          <Cable key={`lt-l-${i}`} start={new THREE.Vector3(leftTowerX, deckY + towerHeight, cablePlaneOffset)} end={new THREE.Vector3(ax, deckY + deckThickness / 2, zEdge)} radius={0.07} color={cableColor} />
          <Cable key={`lt-r-${i}`} start={new THREE.Vector3(leftTowerX, deckY + towerHeight, -cablePlaneOffset)} end={new THREE.Vector3(ax, deckY + deckThickness / 2, -zEdge)} radius={0.07} color={cableColor} />
        </>
      ))}
      {/* Right tower */}
      {anchorsRight.map((ax, i) => (
        <>
          <Cable key={`rt-l-${i}`} start={new THREE.Vector3(rightTowerX, deckY + towerHeight, cablePlaneOffset)} end={new THREE.Vector3(ax, deckY + deckThickness / 2, zEdge)} radius={0.07} color={cableColor} />
          <Cable key={`rt-r-${i}`} start={new THREE.Vector3(rightTowerX, deckY + towerHeight, -cablePlaneOffset)} end={new THREE.Vector3(ax, deckY + deckThickness / 2, -zEdge)} radius={0.07} color={cableColor} />
        </>
      ))}

      {/* Water Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, waterY, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.6} />
      </mesh>

      {/* River banks (simple land masses) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-span / 2 - 120, landY, 0]} receiveShadow>
        <planeGeometry args={[400, 800]} />
        <meshStandardMaterial color="#84cc16" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[span / 2 + 120, landY, 0]} receiveShadow>
        <planeGeometry args={[400, 800]} />
        <meshStandardMaterial color="#84cc16" roughness={1} />
      </mesh>

      {/* Beacon lights on tower tops */}
      {[leftTowerX, rightTowerX].map((tx, i) => (
        <mesh key={`beacon-${i}`} position={[tx, deckY + towerHeight + 1.4, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial emissive="#ffd166" emissiveIntensity={1.4} color="#fff7e6" />
        </mesh>
      ))}

      {/* Lamp posts along the deck edges */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -span / 2 + 20 + i * (span / 13)
        const h = 5
        return (
          <group key={`lamp-l-${i}`} position={[x, deckY + h / 2, zEdge]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, h, 12]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, h / 2, 0]}>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial emissive="#fff4cc" emissiveIntensity={1.2} color="#ffffff" />
            </mesh>
          </group>
        )
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -span / 2 + 20 + i * (span / 13)
        const h = 5
        return (
          <group key={`lamp-r-${i}`} position={[x, deckY + h / 2, -zEdge]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, h, 12]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, h / 2, 0]}>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial emissive="#fff4cc" emissiveIntensity={1.2} color="#ffffff" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// This component is meant to be used inside an existing <Canvas> in Results.jsx
export default function Bridge3D() {
  return <Bridge />
}
