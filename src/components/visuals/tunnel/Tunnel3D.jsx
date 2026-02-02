import React from 'react'
import * as THREE from 'three'

// Minimal, self-contained tunnel portal with entry/exit roads and curved top.
// Adapted from the provided snippet to fit our single-Canvas architecture (no nested Canvas).
export default function Tunnel3D() {
  const baseY = -2.8
  const roadW = 8
  const portalRadius = 6
  const portalThickness = 0.9 // thicker portal ring so it doesn't look flimsy
  const innerRoadLen = 40
  const wallT = 0.8 // structural wall thickness

  return (
    <group position={[0, baseY, 0]}>
      {/* Ground/apron */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1e2d3b" />
      </mesh>

      {/* Entry road (left) */}
      <mesh position={[-35, 0, 0]} receiveShadow>
        <boxGeometry args={[30, 0.2, roadW]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Entry road markings */}
      <mesh position={[-35, 0.11, roadW / 2 - 0.25]}>
        <boxGeometry args={[30, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[-35, 0.11, -roadW / 2 + 0.25]}>
        <boxGeometry args={[30, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`dash-en-${i}`} position={[-35 - 15 + 2 + i * (30 / 6), 0.12, 0]}>
          <boxGeometry args={[2.0, 0.01, 0.12]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      ))}

      {/* Inside road segment */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[innerRoadLen, 0.2, roadW]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Edge lines (solid) on inside road */}
      <mesh position={[0, 0.11, roadW / 2 - 0.25]}>
        <boxGeometry args={[innerRoadLen, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 0.11, -roadW / 2 + 0.25]}>
        <boxGeometry args={[innerRoadLen, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Center dashed line on inside road */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`dash-in-${i}`} position={[-innerRoadLen / 2 + 2 + i * (innerRoadLen / 9), 0.12, 0]}>
          <boxGeometry args={[2.2, 0.01, 0.12]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      ))}

      {/* Exit road (right) */}
      <mesh position={[35, 0, 0]} receiveShadow>
        <boxGeometry args={[30, 0.2, roadW]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Exit road markings */}
      <mesh position={[35, 0.11, roadW / 2 - 0.25]}>
        <boxGeometry args={[30, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[35, 0.11, -roadW / 2 + 0.25]}>
        <boxGeometry args={[30, 0.01, 0.08]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`dash-ex-${i}`} position={[35 - 15 + 2 + i * (30 / 6), 0.12, 0]}>
          <boxGeometry args={[2.0, 0.01, 0.12]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      ))}

      {/* Curved portal ring (top is curved, thicker tube) */}
      <mesh position={[0, portalRadius + 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[portalRadius, portalThickness, 12, 64, Math.PI]} />
        <meshStandardMaterial color="#c8cfd6" roughness={0.7} />
      </mesh>

      {/* Cheek walls (sides of opening) */}
      <mesh position={[0, portalRadius * 0.5, roadW / 2 + 0.5]} castShadow>
        <boxGeometry args={[3.5, portalRadius, 1.6]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.85} />
      </mesh>
      <mesh position={[0, portalRadius * 0.5, -roadW / 2 - 0.5]} castShadow>
        <boxGeometry args={[3.5, portalRadius, 1.6]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.85} />
      </mesh>

      {/* Side walls along the bore to visually support the roof (thicker) */}
      <mesh position={[0, portalRadius / 2, roadW / 2 + 0.25]} castShadow receiveShadow>
        <boxGeometry args={[innerRoadLen, portalRadius, wallT]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.85} />
      </mesh>
      <mesh position={[0, portalRadius / 2, -roadW / 2 - 0.25]} castShadow receiveShadow>
        <boxGeometry args={[innerRoadLen, portalRadius, wallT]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.85} />
      </mesh>

      {/* Roof shell: thick double half-cylinder (outer + inner with BackSide) */}
      {/* Outer shell */}
      <mesh position={[0, portalRadius, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[portalRadius, portalRadius, innerRoadLen, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#d6dce3" roughness={0.85} />
      </mesh>
      {/* Inner liner */}
      <mesh position={[0, portalRadius, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[portalRadius - wallT, portalRadius - wallT, innerRoadLen, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} side={THREE.BackSide} />
      </mesh>

      {/* Simple interior ribs (reduced count) under the roof, chunkier */}
      {[-12, 0, 12].map((x, i) => (
        <mesh key={i} position={[x, portalRadius * 0.92, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[portalRadius - wallT * 0.2, 0.25, 12, 40, Math.PI]} />
          <meshStandardMaterial color="#cfd6dd" roughness={0.85} />
        </mesh>
      ))}

      {/* Lights to echo provided snippet */}
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
  <ambientLight intensity={0.35} />
    </group>
  )
}

