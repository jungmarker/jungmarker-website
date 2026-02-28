/**
 * Shared mutable scroll state.
 * Updated from a DOM scroll listener in App.tsx, read in useFrame() in CameraRig.tsx.
 * Using a plain object (not a React ref/state) avoids prop-drilling through the Canvas
 * and keeps scroll reads free from React re-render cycles.
 */
export const scrollState = {
  /** Normalized scroll progress 0→1 over the full page height */
  progress: 0,
  /** Discrete section index 0–5 */
  section: 0,
}
