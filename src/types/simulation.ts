export interface SimulationCamera {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
  followingBodyId: string | null;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

export interface SimulationSettings {
  isPlaying: boolean;
  speedMultiplier: number; // 1 = normal baseline, 0.25x - 100x
  showOrbits: boolean;
  showLabels: boolean;
  showTrails: boolean;
  showHabitableZone: boolean;
  showAsteroidBelt: boolean;
  showKuiperBelt: boolean;
  showMoonOrbit: boolean;
  enhancedScale: boolean; // toggle between true proportional vs boosted visibility
  gridOverlay: boolean;
  soundEnabled: boolean;
}

export interface SimulationState {
  currentEpochDays: number; // simulation days elapsed from epoch
  selectedBodyId: string | null;
  hoveredBodyId: string | null;
  isMobileDrawerOpen: boolean;
  isModalOpen: boolean;
  activeTab: 'overview' | 'simulation' | 'worlds' | 'guide' | 'physics' | 'about';
}

export interface BodyScreenPosition {
  id: string;
  name: string;
  screenX: number;
  screenY: number;
  screenRadius: number;
  orbitRadius: number;
  angle: number;
  worldX: number;
  worldY: number;
  type: string;
  isHovered: boolean;
  isSelected: boolean;
  parentBodyId?: string;
}

export interface AsteroidParticle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

export interface StarParticle {
  x: number;
  y: number;
  size: number;
  baseBrightness: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
}
