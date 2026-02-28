import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../../lib/scrollState'

/**
 * Camera waypoints per scroll section.
 * Sections: 0=Hero 1=About 2=Services 3=Listings 4=Stories 5=Contact
 *
 * Keep movements subtle — the 3D is an ambient accent, not a game.
 * Tuning checklist (see README):
 *   pos.x  → left/right pan  (negative = left)
 *   pos.y  → height          (1.5–2.5 good range)
 *   pos.z  → zoom in/out     (8=close, 11=distant)
 *   target → where to look at
 */
const WAYPOINTS: { pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  /* 0 Hero      */ { pos: new THREE.Vector3( 0.0, 2.20, 9.50), target: new THREE.Vector3( 0.0, 0.80, 0) },
  /* 1 About     */ { pos: new THREE.Vector3(-0.8, 2.00, 9.20), target: new THREE.Vector3(-0.3, 0.70, 0) },
  /* 2 Services  */ { pos: new THREE.Vector3( 0.2, 1.80, 8.90), target: new THREE.Vector3( 0.0, 0.60, 0) },
  /* 3 Listings  */ { pos: new THREE.Vector3( 0.5, 2.00, 9.20), target: new THREE.Vector3( 0.2, 0.80, 0) },
  /* 4 Stories   */ { pos: new THREE.Vector3( 1.0, 2.10, 9.50), target: new THREE.Vector3( 0.5, 0.80, 0) },
  /* 5 Contact   */ { pos: new THREE.Vector3( 0.0, 2.30, 9.80), target: new THREE.Vector3( 0.0, 0.85, 0) },
]

function smoothstep(t: number) {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

const _tmpPos    = new THREE.Vector3()
const _tmpTarget = new THREE.Vector3()

export default function CameraRig() {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3(0, 0.8, 0))

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime()
    const sp = scrollState.progress                 // 0–1
    const n  = WAYPOINTS.length - 1
    const raw = sp * n
    const a  = Math.min(Math.floor(raw), n - 1)
    const b  = a + 1
    const f  = smoothstep(raw - a)

    _tmpPos.lerpVectors(WAYPOINTS[a].pos, WAYPOINTS[b].pos, f)
    _tmpTarget.lerpVectors(WAYPOINTS[a].target, WAYPOINTS[b].target, f)

    // Idle drift — fades out as you scroll past the hero
    const driftAmt = Math.max(0, 1 - sp * 5) * 0.20
    _tmpPos.x += Math.sin(t * 0.11) * driftAmt
    _tmpPos.y += Math.sin(t * 0.07) * driftAmt * 0.35

    camera.position.lerp(_tmpPos, 0.04)
    lookAt.current.lerp(_tmpTarget, 0.04)
    camera.lookAt(lookAt.current)
  })

  return null
}
