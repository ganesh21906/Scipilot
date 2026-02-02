import React, { useEffect, useMemo, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

function stressColor(ratio) {
  // ratio 0 -> green, 0.5 -> yellow, 1 -> red
  const color = new THREE.Color()
  if (ratio <= 0.5) {
    // green to yellow
    const t = ratio / 0.5
    color.set('#10b981') // green
    color.lerp(new THREE.Color('#f59e0b'), t)
  } else {
    const t = (ratio - 0.5) / 0.5
    color.set('#f59e0b')
    color.lerp(new THREE.Color('#ef4444'), t)
  }
  return color
}

export default function GLTFModel({ trafficLoad = 120, perMeshStress = {}, onLoad = () => {}, onError = () => {} }) {
  const { scene } = useThree()
  const [gltf, setGltf] = useState(null)
  const [error, setError] = useState(null)
  const [meshNames, setMeshNames] = useState([])
  const [progress, setProgress] = useState(0)

  // map trafficLoad 50-300 to 0-1
  const globalRatio = useMemo(() => Math.max(0, Math.min(1, (trafficLoad - 50) / (300 - 50))), [trafficLoad])

  useEffect(() => {
    let mounted = true
    const loader = new GLTFLoader()

    loader.load(
      '/models/bridge.glb',
      (res) => {
        if (!mounted) return
        // normalize model scale and center it so it fits nicely in the scene
        try {
          const bbox = new THREE.Box3().setFromObject(res.scene)
          const size = bbox.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1)
          const desired = 6 // desired size in scene units
          const scale = maxDim > 0 ? (desired / maxDim) : 1
          res.scene.scale.setScalar(scale)
          // recenter
          const center = bbox.getCenter(new THREE.Vector3())
          res.scene.position.sub(center)
        } catch (e) {
          // ignore bbox errors
        }
        const names = []
        res.scene.traverse((node) => {
          if (node.isMesh) {
            names.push(node.name || node.uuid)
            node.userData.originalMaterial = node.material ? node.material.clone() : null
            node.castShadow = true
            node.receiveShadow = true
          }
        })
        setMeshNames(names)
        onLoad(names)
        setGltf(res)
        setProgress(100)
      },
      // onProgress
      (ev) => {
        if (!mounted) return
        try {
          const ratio = ev.total ? ev.loaded / ev.total : 0
          const pct = Math.min(100, Math.round(ratio * 100))
          setProgress(pct)
          if (typeof onLoad === 'function' && pct === 100) {
            // handled in onLoad success handler above
          }
        } catch (e) {}
      },
      (err) => {
        if (!mounted) return
        console.warn('GLTF load failed, falling back to procedural model:', err)
        setError(err)
        try {
          onLoad([])
        } catch (e) {}
        try {
          onError(err)
        } catch (e) {}
      }
    )

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!gltf) return
    // apply stress color blended with original material per mesh
    gltf.scene.traverse((node) => {
      if (!node.isMesh) return
      const name = node.name || node.uuid
      const ratio = name in perMeshStress ? Math.max(0, Math.min(1, perMeshStress[name])) : globalRatio

      const sColor = stressColor(ratio)

      if (node.userData?.originalMaterial) {
        const orig = node.userData.originalMaterial
        // clone original material so we don't overwrite shared resources
        const mat = orig.clone()
        if (mat.color) {
          // blend from original color to stress color by ratio
          mat.color = mat.color.clone()
          mat.color.lerp(sColor, ratio)
        }
        if ('emissive' in mat) {
          mat.emissive = sColor.clone().multiplyScalar(0.08 * ratio)
        }
        mat.transparent = true
        mat.opacity = 1
        node.material = mat
      } else if (node.material) {
        // fallback: tint existing material
        const mat = node.material.clone()
        if (mat.color) mat.color.lerp(sColor, ratio)
        if ('emissive' in mat) mat.emissive = sColor.clone().multiplyScalar(0.06 * ratio)
        mat.transparent = true
        mat.opacity = 1
        node.material = mat
      }
      node.castShadow = true
      node.receiveShadow = true
    })
  }, [gltf, perMeshStress, globalRatio])

  // expose progress via a DOM-free callback if provided (optional)
  useEffect(() => {
    if (typeof GLTFModel.onProgress === 'function') {
      try {
        GLTFModel.onProgress(progress)
      } catch (e) {}
    }
  }, [progress])

  if (error) return null

  if (!gltf) return null

  return <primitive object={gltf.scene} dispose={null} />
}
