import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { HouseConfig } from '../../store/useStore'

interface Props { house: HouseConfig }
interface FlickerSeed { phase: number; speed: number; base: number }

function makeSeeds(n: number): FlickerSeed[] {
  return Array.from({ length: n }, () => ({
    phase: Math.random() * Math.PI * 2,
    speed: 0.35 + Math.random() * 0.55,
    base:  0.55 + Math.random() * 0.40,
  }))
}

export default function RowHome({ house }: Props) {
  const groupRef     = useRef<THREE.Group>(null)
  const winMats      = useRef<THREE.MeshStandardMaterial[]>([])
  const doorGlowRef  = useRef<THREE.PointLight>(null)
  const flickerSeeds = useMemo(() => makeSeeds(4), [])

  const brickCol = useMemo(() => new THREE.Color(house.color),     [house.color])
  const doorCol  = useMemo(() => new THREE.Color(house.door),      [house.door])
  const trimCol  = useMemo(() => new THREE.Color(house.trimColor), [house.trimColor])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Very subtle ambient float — gives life without requiring interaction
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.18 + house.x) * 0.011
    }
    // Candlelight window flicker
    winMats.current.forEach((mat, i) => {
      if (!mat) return
      const s = flickerSeeds[i]
      mat.emissiveIntensity = s.base + Math.sin(t * s.speed + s.phase) * 0.14
    })
    // Door glow slow pulse
    if (doorGlowRef.current) {
      doorGlowRef.current.intensity = 0.26 + Math.sin(t * 0.58 + house.x) * 0.08
    }
  })

  const glassPane = (idx: number) => (
    <meshStandardMaterial
      ref={(m) => { if (m) winMats.current[idx] = m as THREE.MeshStandardMaterial }}
      color="#ffdd99"
      emissive="#ffcc44"
      emissiveIntensity={0.65}
      roughness={0.08}
      metalness={0}
    />
  )

  return (
    <group ref={groupRef} position={[house.x, 0, 0]}>

      {/* ── Section label: small gold text above parapet ── */}
      <Text
        position={[0, 2.26, 0.46]}
        fontSize={0.092}
        color="#c9a84c"
        anchorX="center"
        anchorY="bottom"
        letterSpacing={0.09}
        outlineWidth={0.007}
        outlineColor="#0f1b2d"
        renderOrder={1}
      >
        {house.label.toUpperCase()}
      </Text>

      {/* ── Brick body ── */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.8, 0.85]} />
        <meshStandardMaterial color={brickCol} roughness={0.88} metalness={0.02} />
      </mesh>

      {/* ── Cornice ── */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <boxGeometry args={[1.5, 0.10, 0.95]} />
        <meshStandardMaterial color={trimCol} roughness={0.7} />
      </mesh>

      {/* ── Parapet ── */}
      <mesh position={[0, 1.94, 0]}>
        <boxGeometry args={[1.46, 0.14, 0.92]} />
        <meshStandardMaterial color={trimCol} roughness={0.7} />
      </mesh>

      {/* ── Chimney ── */}
      <mesh position={[0.38, 2.30, 0]} castShadow>
        <boxGeometry args={[0.20, 0.72, 0.20]} />
        <meshStandardMaterial color={house.color} roughness={0.9} />
      </mesh>
      <mesh position={[0.38, 2.68, 0]}>
        <boxGeometry args={[0.26, 0.07, 0.26]} />
        <meshStandardMaterial color={trimCol} roughness={0.8} />
      </mesh>

      {/* ── Upper windows ── */}
      {([-0.32, 0.32] as number[]).map((wx, i) => (
        <group key={i} position={[wx, 1.28, 0.43]}>
          <mesh>
            <boxGeometry args={[0.32, 0.44, 0.04]} />
            <meshStandardMaterial color={trimCol} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.24, 0.36, 0.01]} />
            {glassPane(i)}
          </mesh>
          <mesh position={[0, 0.25, 0.01]}>
            <boxGeometry args={[0.34, 0.07, 0.05]} />
            <meshStandardMaterial color={trimCol} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Lower windows flanking door ── */}
      {([-0.48, 0.48] as number[]).map((wx, i) => (
        <group key={i + 2} position={[wx, 0.62, 0.43]}>
          <mesh>
            <boxGeometry args={[0.28, 0.38, 0.04]} />
            <meshStandardMaterial color={trimCol} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.20, 0.30, 0.01]} />
            {glassPane(i + 2)}
          </mesh>
        </group>
      ))}

      {/* ── Door ── */}
      <group position={[0, 0.25, 0.43]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.36, 0.64, 0.03]} />
          <meshStandardMaterial color={trimCol} roughness={0.65} />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.58, 0.04]} />
          <meshStandardMaterial color={doorCol} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.34, 0.02]}>
          <boxGeometry args={[0.28, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffdd99" emissive="#ffcc44" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0.10, 0, 0.04]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Marble stoop (3 steps) ── */}
      {([0, 1, 2] as number[]).map((step) => (
        <mesh key={step} position={[0, -0.10 - step * 0.10, 0.50 + step * 0.14]} receiveShadow>
          <boxGeometry args={[1.0 + step * 0.10, 0.10, 0.30]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.50} />
        </mesh>
      ))}

      {/* ── Iron railings ── */}
      {([-0.45, 0.45] as number[]).map((rx, i) => (
        <group key={i} position={[rx, 0, 0.56]}>
          {([0, 0.20, 0.40] as number[]).map((rz, j) => (
            <mesh key={j} position={[0, -0.02, rz]}>
              <cylinderGeometry args={[0.012, 0.012, 0.35, 6]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 0.16, 0.20]}>
            <boxGeometry args={[0.02, 0.02, 0.46]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Basement band ── */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[1.40, 0.12, 0.85]} />
        <meshStandardMaterial color="#3a2018" roughness={0.95} />
      </mesh>

      {/* ── AC unit ── */}
      {house.acUnit && (
        <mesh position={[-0.32, 1.94, 0.38]}>
          <boxGeometry args={[0.28, 0.16, 0.22]} />
          <meshStandardMaterial color="#aaa" roughness={0.7} metalness={0.4} />
        </mesh>
      )}

      {/* ── Ambient door glow ── */}
      <pointLight ref={doorGlowRef} position={[0, 0.25, 0.9]} color="#ffcc66" intensity={0.26} distance={2.5} decay={2} />
    </group>
  )
}
