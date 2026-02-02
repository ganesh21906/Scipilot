import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// A lightweight BuildingModel for the 3D viewer.
// This implementation avoids external GUI deps (leva) and accepts optional props:
// { autoRotate, wireframe }
export default function BuildingModel({ autoRotate = false, wireframe = false, ...props }) {
  const group = useRef()

  // Materials memoized to avoid reallocation every render
  const matConcrete = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xbdbdbd, wireframe }), [wireframe])
  const matWall = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xeceff1, wireframe }), [wireframe])
  const matRoof = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xb74e48, wireframe }), [wireframe])
  const matGlass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 0xaedff7, transmission: 0.7, roughness: 0.05, transparent: true, opacity: 0.6, wireframe }), [wireframe])
  const matDoor = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x6d4c41, wireframe }), [wireframe])

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.25
  })

  return (
    <group ref={group} position={[0, 0, 0]} castShadow receiveShadow {...props}>
      {/* Floor slab */}
      <mesh position={[0, 0.25, 0]} material={matConcrete} castShadow receiveShadow>
        <boxGeometry args={[20, 0.5, 12]} />
      </mesh>

      {/* Columns */}
      <group>
        {[[-9, 3.25, -5], [9, 3.25, -5], [-9, 3.25, 5], [9, 3.25, 5]].map((pos, i) => (
          <mesh key={i} position={pos} material={matConcrete} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 6, 20]} />
          </mesh>
        ))}
      </group>

      {/* Walls */}
      <group>
        {/* Side walls */}
        <mesh position={[-9, 3, 0]} material={matWall}>
          <boxGeometry args={[0.4, 5.5, 10.5]} />
        </mesh>
        <mesh position={[9, 3, 0]} material={matWall}>
          <boxGeometry args={[0.4, 5.5, 10.5]} />
        </mesh>

        {/* Front/back walls */}
        <mesh position={[0, 3, -5]} material={matWall}>
          <boxGeometry args={[18.4, 5.5, 0.4]} />
        </mesh>
        <mesh position={[0, 3, 5]} material={matWall}>
          <boxGeometry args={[18.4, 5.5, 0.4]} />
        </mesh>

        {/* Glass window */}
        <mesh position={[0, 3, 5.21]} material={matGlass}>
          <planeGeometry args={[6, 3.5]} />
        </mesh>

        {/* Door */}
        <mesh position={[6.6, 1.75, 5.21]} material={matDoor}>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
        </mesh>
      </group>

      {/* Roof */}
      <group>
        <mesh position={[0, 8.0, 0]} rotation={[0, 0, 0.25]} material={matRoof}>
          <boxGeometry args={[20.8, 0.6, 6.4]} />
        </mesh>
        <mesh position={[0, 8.6, 0.6]} rotation={[0, 0, -0.25]} material={matRoof}>
          <boxGeometry args={[20.8, 0.6, 6.4]} />
        </mesh>
      </group>

      {/* Label - simple flat sign instead of text geometry to avoid font dependency */}
      <mesh position={[0, 11.5, 0]}>
        <planeGeometry args={[6, 1]} />
        <meshBasicMaterial color="#0b1220" />
      </mesh>
    </group>
  )
}
