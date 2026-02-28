/**
 * House configuration — drives both the 3D scene and section labels.
 * Zustand removed: navigation is now scroll-based, no interactive state needed.
 */
export interface HouseConfig {
  id: string
  x: number         // 3D scene x position
  label: string     // Short name for sign + nav
  sectionId: string // HTML anchor id this house conceptually ties to
  color: string     // brick hex
  door: string      // door hex
  trimColor: string // cornice/trim hex
  acUnit: boolean
}

export const HOUSES: HouseConfig[] = [
  { id: 'h-about',    x: -3.4, label: 'About',    sectionId: 'about',    color: '#7a3520', door: '#1a1a2e', trimColor: '#e8e4dc', acUnit: false },
  { id: 'h-listings', x: -1.7, label: 'Listings', sectionId: 'listings', color: '#8b4513', door: '#722b1b', trimColor: '#d4c5a9', acUnit: true  },
  { id: 'h-sold',     x:  0.0, label: 'Sold',     sectionId: 'listings', color: '#6b3020', door: '#c9a84c', trimColor: '#e8e4dc', acUnit: false },
  { id: 'h-stories',  x:  1.7, label: 'Stories',  sectionId: 'stories',  color: '#7d3a2a', door: '#2d4a1e', trimColor: '#d4c5a9', acUnit: true  },
  { id: 'h-contact',  x:  3.4, label: 'Contact',  sectionId: 'contact',  color: '#723218', door: '#1a1a2e', trimColor: '#e8e4dc', acUnit: false },
]
