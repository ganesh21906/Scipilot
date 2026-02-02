import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useProject } from '../../../context/ProjectContext'

// Daytime-friendly dam model with curved wall, spillway bays, rails and terrain
// Plugs into the shared Results Canvas (no nested Canvas)
export default function Dam3D() {
  const { project } = useProject()
  const meta = project?.meta || {}

  const baseY = -2.6 // align with scene baseline

  // Parametric inputs with fallbacks
  const R = Number(meta.radius ?? meta.crestRadius ?? 14) // arc radius
  const crestThetaDeg = Number(meta.crestAngleDeg ?? meta.crestThetaDeg ?? meta.crestLengthDeg ?? 162)
  const theta = Math.PI * (crestThetaDeg / 180) // arc angle
  const gateCount = Math.max(1, Math.min(7, Number(meta.gateCount ?? meta.damGateCount ?? 3)))
  const waterLevel = Math.max(0, Math.min(1, Number(meta.waterLevel ?? meta.reservoirLevel ?? 0.5)))

  const segments = Math.max(18, Math.round(theta * 18)) // wall segmentation for curvature
  const wallHeight = 8
  const wallThickness = 2
  const wallTilt = -Math.PI / 24 // slight downstream batter

  const crestRailPosts = Math.max(12, Math.round(theta * 14))

  // Precompute angles for wall segments and crest details
  const wallAngles = useMemo(() => {
    const arr = []
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1)
      arr.push(-theta / 2 + t * theta)
    }
    return arr
  }, [segments, theta])

  const crestAngles = useMemo(() => {
    const arr = []
    for (let i = 0; i < crestRailPosts; i++) {
      const t = i / (crestRailPosts - 1)
      arr.push(-theta / 2 + t * theta)
    }
    return arr
  }, [crestRailPosts, theta])

  // Water sheet animation refs sized by bay count
  const flows = useMemo(() => Array.from({ length: gateCount }, () => React.createRef()), [gateCount])
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    flows.forEach((ref, i) => {
      if (!ref.current) return
      const wobble = Math.sin(t * 1.2 + i) * 0.05
      ref.current.scale.y = 1 + wobble
      ref.current.material.opacity = 0.6 + (Math.sin(t * 2 + i) * 0.1)
    })
  })

  // Helper to compute position on arc at angle a
  const onArc = (a, radius = R) => [Math.sin(a) * radius, 0, -Math.cos(a) * radius]

  // Spillway bay angles centered around 0 based on gateCount
  const baySpread = Math.min(theta * 0.45, 0.9)
  const bayAngles = useMemo(() => {
    if (gateCount === 1) return [0]
    return Array.from({ length: gateCount }, (_, i) => -baySpread / 2 + (i / (gateCount - 1)) * baySpread)
  }, [gateCount, baySpread])

  // Water surface component with ripples
  function WaterSurface({ size = [20, 20], position = [0, 0, 0], color = '#0a638e', opacity = 0.8, metalness = 0.35, roughness = 0.25, speed = 0.6, amp = 0.08, freq = 0.6, segments = 64 }) {
    const geoRef = useRef()
    useFrame((state) => {
      const t = state.clock.getElapsedTime() * speed
      const geo = geoRef.current
      if (!geo) return
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const w = Math.sin(x * freq + t) * amp + Math.cos(y * freq * 0.85 + t * 1.15) * amp * 0.7
        pos.setZ(i, w)
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
    })
    return (
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry ref={geoRef} args={[size[0], size[1], segments, segments]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={0.5} transparent opacity={opacity} />
      </mesh>
    )
  }

  return (
    <group position={[0, baseY, 0]}>
      {/* Upstream Reservoir (rippled) */}
      <WaterSurface size={[Math.max(40, R * 3), 30]} position={[0, -0.2 + (waterLevel - 0.5) * 1.2, -18]} color="#0a638e" opacity={0.82} metalness={0.4} roughness={0.25} />

      {/* Curved Dam Wall composed of slim segments */}
      {wallAngles.map((a, idx) => (
        <group key={idx} position={onArc(a, R)} rotation={[wallTilt, a, 0]} castShadow receiveShadow>
          {/* segment body */}
          <mesh>
            <boxGeometry args={[R * (theta / segments) * 1.05, wallHeight, wallThickness]} />
            <meshStandardMaterial color="#cfd6dd" roughness={0.75} />
          </mesh>
          {/* face ribs for detail */}
          <mesh position={[0, 0, wallThickness * 0.51]}>
            <boxGeometry args={[R * (theta / segments) * 1.02, 0.25, 0.2]} />
            <meshStandardMaterial color="#b8c1c9" roughness={0.8} />
          </mesh>
          <mesh position={[0, wallHeight * 0.35, wallThickness * 0.51]}>
            <boxGeometry args={[R * (theta / segments) * 1.02, 0.25, 0.2]} />
            <meshStandardMaterial color="#b8c1c9" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Crest cap (slim band along the arc) */}
      {wallAngles.map((a, idx) => {
        const p = onArc(a, R)
        return (
          <mesh key={`cap-${idx}`} position={[p[0], wallHeight * 0.52, p[2]]} rotation={[0, a, 0]} castShadow>
            <boxGeometry args={[R * (theta / segments) * 1.06, 0.4, wallThickness * 0.9]} />
            <meshStandardMaterial color="#e3e7eb" roughness={0.6} />
          </mesh>
        )
      })}

      {/* Crest rails and lamps */}
      {crestAngles.map((a, i) => {
        const [x, , z] = onArc(a, R + wallThickness * 0.6)
        // place posts just above crest (top is wallHeight/2)
        const y = wallHeight / 2 + 0.5
        return (
          <group key={`rail-${i}`} position={[x, y, z]} rotation={[0, a, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.3, 8]} />
              <meshStandardMaterial color="#aab4bd" roughness={0.5} />
            </mesh>
            {/* top rail */}
            <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, R * 0.09, 8]} />
              <meshStandardMaterial color="#c7d0d8" />
            </mesh>
            {/* small lamp */}
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial emissive="#fff6cc" emissiveIntensity={0.6} color="#f0f0f0" />
            </mesh>
          </group>
        )
      })}

      {/* Spillway bays (3) at center with gates */}
      {bayAngles.map((a, i) => {
        const [x, , z] = onArc(a, R)
        const rot = [wallTilt, a, 0]
        const pierW = 0.6
        const bayW = Math.max(2.2, R * 0.1)
        const gateOpen = gateCount > 1 ? (i === Math.floor(gateCount / 2) ? 0.5 : 0.28) : 0.5
        return (
          <group key={`bay-${i}`} position={[x, 0, z]} rotation={rot}>
            {/* left and right piers */}
            <mesh position={[-bayW / 2 - pierW / 2, 1.4, wallThickness * 0.4]} castShadow receiveShadow>
              <boxGeometry args={[pierW, 4.8, 1.6]} />
              <meshStandardMaterial color="#b5bcc3" roughness={0.8} />
            </mesh>
            <mesh position={[bayW / 2 + pierW / 2, 1.4, wallThickness * 0.4]} castShadow receiveShadow>
              <boxGeometry args={[pierW, 4.8, 1.6]} />
              <meshStandardMaterial color="#b5bcc3" roughness={0.8} />
            </mesh>
            {/* gate leaf */}
            <mesh position={[0, 2.4 - gateOpen * 2.0, wallThickness * 0.3]} castShadow>
              <boxGeometry args={[bayW, 2, 0.3]} />
              <meshStandardMaterial color="#6b8ba1" metalness={0.4} roughness={0.5} />
            </mesh>
            {/* hoist frame above piers */}
            <group position={[0, wallHeight / 2 + 0.8, wallThickness * 0.5]}>
              <mesh position={[-bayW / 2, 0.6, 0]} castShadow>
                <boxGeometry args={[0.2, 1.2, 0.4]} />
                <meshStandardMaterial color="#adb7c0" />
              </mesh>
              <mesh position={[bayW / 2, 0.6, 0]} castShadow>
                <boxGeometry args={[0.2, 1.2, 0.4]} />
                <meshStandardMaterial color="#adb7c0" />
              </mesh>
              <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[bayW + 0.4, 0.2, 0.5]} />
                <meshStandardMaterial color="#c8d0d7" />
              </mesh>
              {/* small catwalk slab */}
              <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[bayW + 0.6, 0.08, 0.8]} />
                <meshStandardMaterial color="#d7dce1" roughness={0.7} />
              </mesh>
            </group>
            {/* flowing water sheet */}
            <mesh ref={flows[i]} position={[0, -1.8, 2.2]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
              <boxGeometry args={[bayW * 0.9, 0.5, 8]} />
              <meshStandardMaterial color="#a3d9ff" transparent opacity={0.65} emissive="#78b2e5" emissiveIntensity={0.25} />
            </mesh>
            {/* flip-bucket chute (approx.) */}
            <mesh position={[0, -2.2, 5]} rotation={[-Math.PI / 3.2, 0, 0]} castShadow>
              <boxGeometry args={[bayW * 0.9, 0.4, 3]} />
              <meshStandardMaterial color="#cfd6dd" roughness={0.75} />
            </mesh>
            <mesh position={[0, -2.9, 6.8]} rotation={[-Math.PI / 10, 0, 0]} castShadow>
              <boxGeometry args={[bayW * 0.9, 0.3, 1.2]} />
              <meshStandardMaterial color="#cfd6dd" roughness={0.75} />
            </mesh>
          </group>
        )
      })}

      {/* Downstream Pool with darker rippled water */}
      <WaterSurface size={[Math.max(44, R * 3.2), 34]} position={[0, -3.0, 10]} color="#083d5e" opacity={0.9} metalness={0.2} roughness={0.55} amp={0.05} freq={0.8} />

      {/* Splash/foam at spillway toe */}
      <mesh position={[0, -2.9, 5.8]} rotation={[-Math.PI / 2.6, 0, 0]}>
        <boxGeometry args={[12, 0.05, 4]} />
        <meshStandardMaterial color="#e6f5ff" transparent opacity={0.6} />
      </mesh>

      {/* Rock Abutments with subtle angle */}
      <mesh position={[-R - 1.5, 0.4, -0.5]} rotation={[0, Math.PI / 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 11, 10]} />
        <meshStandardMaterial color="#5c6167" roughness={0.9} />
      </mesh>
      <mesh position={[R + 1.5, 0.4, -0.5]} rotation={[0, -Math.PI / 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 11, 10]} />
        <meshStandardMaterial color="#5c6167" roughness={0.9} />
      </mesh>

      {/* Intake Tower and service house on crest */}
      <group position={[0, wallHeight / 2 + 0.6, -1]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 2.2, 1.2]} />
          <meshStandardMaterial color="#d8dee3" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.3, 1.6]} />
          <meshStandardMaterial color="#c9d1d7" />
        </mesh>
      </group>

      {/* Small powerhouse at right abutment with pipes */}
      <group position={[R + 4.2, -1.6, -4]} rotation={[0, -Math.PI / 16, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 3, 6]} />
          <meshStandardMaterial color="#cfd6dd" roughness={0.8} />
        </mesh>
        {/* roof */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[4.2, 0.3, 6.2]} />
          <meshStandardMaterial color="#e3e7eb" />
        </mesh>
        {/* intake pipe from reservoir */}
        <mesh position={[-1.6, 0.0, -3.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 6, 16]} />
          <meshStandardMaterial color="#7b8c99" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* outlet pipe to tailrace */}
        <mesh position={[1.6, -0.2, 3.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 5.5, 16]} />
          <meshStandardMaterial color="#6f838f" metalness={0.6} roughness={0.45} />
        </mesh>
      </group>

      {/* Simple hills/terrain silhouettes */}
      <mesh position={[-28, -1.5, -12]} rotation={[0, Math.PI / 12, 0]} receiveShadow>
        <boxGeometry args={[18, 6, 24]} />
        <meshStandardMaterial color="#6f7a82" roughness={0.95} />
      </mesh>
      <mesh position={[26, -1.6, -10]} rotation={[0, -Math.PI / 16, 0]} receiveShadow>
        <boxGeometry args={[16, 5, 20]} />
        <meshStandardMaterial color="#6b747c" roughness={0.95} />
      </mesh>
    </group>
  )
}
