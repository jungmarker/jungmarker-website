import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { HOUSES } from '../../store/useStore'
import RowHome from './RowHome'
import CameraRig from './CameraRig'

/* ─────────────────────────────────────────────────────────────────────────────
   GROUND
   Fix: use box geometries at clearly-separated Y levels. No coplanar planes.
   Old code had ContactShadows + sidewalk plane both at y=-0.12 (exact z-fight),
   plus street/stripe all within 0.01 of each other → constant flickering.
   New code: sidewalk top at y=0, street top at y=-0.025, stripe at y=-0.021.
   A single far background plane sits 0.1 below all boxes (no overlap).
───────────────────────────────────────────────────────────────────────────── */
function Ground() {
  return (
    <group>
      {/* Sidewalk slab  — top face at y = 0 (center y=-0.06, height=0.12) */}
      <mesh position={[0, -0.06, 0.4]} receiveShadow>
        <boxGeometry args={[15, 0.12, 2.6]} />
        <meshStandardMaterial color="#a8a09a" roughness={0.94} metalness={0} />
      </mesh>

      {/* Curb raised edge — top face at y ≈ 0.07 */}
      <mesh position={[0, 0.035, 1.68]} receiveShadow castShadow>
        <boxGeometry args={[15, 0.07, 0.18]} />
        <meshStandardMaterial color="#ccc8c0" roughness={0.88} />
      </mesh>

      {/* Street slab — top face at y = -0.025 (center=-0.095, height=0.14) */}
      <mesh position={[0, -0.095, 3.6]} receiveShadow>
        <boxGeometry args={[15, 0.14, 4.4]} />
        <meshStandardMaterial color="#212121" roughness={1.0} metalness={0} />
      </mesh>

      {/* Center line — sits 0.004 above street top, no overlap possible */}
      <mesh position={[0, -0.019, 4.3]}>
        <boxGeometry args={[15, 0.006, 0.09]} />
        <meshStandardMaterial color="#c9a84c" roughness={0.9} metalness={0} />
      </mesh>

      {/* Far background plane — 0.12 below all boxes, zero overlap risk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.30, 5]}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial color="#131110" roughness={1.0} />
      </mesh>
    </group>
  )
}

/* ── Street lamp ── */
function StreetLamp({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.4]}>
      <mesh>
        <cylinderGeometry args={[0.025, 0.032, 2.3, 8]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, -0.28]} rotation={[Math.PI * 0.08, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.58, 6]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.12, -0.54]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#fff9e6" emissive="#ffdd88" emissiveIntensity={1.6} />
      </mesh>
      <pointLight
        position={[0, 1.12, -0.54]}
        color="#ffcc66"
        intensity={1.0}
        distance={4.5}
        decay={2}
      />
    </group>
  )
}

/* ── Parked car ── */
function Car({ x, color }: { x: number; color: string }) {
  return (
    <group position={[x, -0.025, 2.6]}>
      <mesh position={[0, 0.17, 0]} castShadow>
        <boxGeometry args={[0.7, 0.22, 1.5]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.32, -0.14]} castShadow>
        <boxGeometry args={[0.62, 0.18, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      {([ [-0.3, 0.07, 0.52], [0.3, 0.07, 0.52], [-0.3, 0.07, -0.52], [0.3, 0.07, -0.52] ] as [number,number,number][]).map(([wx,wy,wz], i) => (
        <mesh key={i} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 10]} />
          <meshStandardMaterial color="#111" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Fireflies ── */
function Fireflies() {
  const ref = useRef<THREE.Points>(null)
  const positions = useRef(
    Float32Array.from({ length: 60 * 3 }, (_, i) =>
      i % 3 === 1 ? Math.random() * 1.8 + 0.4 : (Math.random() - 0.5) * 9
    )
  )

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < 60; i++) {
      arr[i * 3]     += Math.sin(t * 0.45 + i * 1.1) * 0.0015
      arr[i * 3 + 1] += Math.cos(t * 0.28 + i * 0.9) * 0.0008
      arr[i * 3 + 2] += Math.sin(t * 0.38 + i * 1.4) * 0.0012
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ;(ref.current.material as THREE.PointsMaterial).opacity =
      0.45 + Math.sin(t * 1.8) * 0.28
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#88ff66" size={0.038} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function RowHomeScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.2, 9.5], fov: 42, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      style={{ background: '#0f1b2d' }}
    >
      <Sky sunPosition={[-1, 0.14, -2]} turbidity={7} rayleigh={1.4} inclination={0.52} />
      <Stars radius={90} depth={50} count={2500} factor={3} fade speed={0.3} />

      <ambientLight intensity={0.22} color="#4466aa" />
      <directionalLight
        position={[-6, 9, 5]}
        intensity={1.35}
        color="#ffd580"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={7}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
      />
      <hemisphereLight args={['#3355aa', '#1a0a00', 0.45]} />

      <Suspense fallback={null}>
        <Ground />
        {HOUSES.map((h) => <RowHome key={h.id} house={h} />)}
        <StreetLamp x={-3.1} />
        <StreetLamp x={0} />
        <StreetLamp x={3.1} />
        <Car x={-2.3} color="#1a3a5c" />
        <Car x={0.9} color="#2d4a1e" />
        <Car x={2.7} color="#5c1a1a" />
        <Fireflies />
      </Suspense>

      <CameraRig />
    </Canvas>
  )
}
