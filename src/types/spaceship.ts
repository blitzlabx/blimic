import { CelestialBodyData } from './astronomy';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

export type FlightMode = 
  | 'interplanetary' // Flying in deep solar system space
  | 'orbital_descent' // Reentry sequence into planet's atmosphere
  | 'landed' // On the planet's surface / orbital base station
  | 'orbital_ascent'; // Launching back to solar space

export type ControlScheme = 'joystick' | 'dpad' | 'direct' | 'keyboard';
export type CameraPerspective = 'third_person' | 'close_chase' | 'wide_sector';
export type HudStyle = 'full' | 'compact' | 'minimal' | 'hidden';

export interface FlightSettings {
  controlScheme: ControlScheme;
  speedMultiplier: number; // 0.35x to 1.5x (default 0.65x for precise, smooth control)
  turnSensitivity: number; // 0.5x to 1.5x (default 0.8x)
  spaceDamping: 'assisted' | 'standard' | 'drift'; // assisted = auto-stabilize drift
  autoBrakeNearPlanets: boolean; // auto slow down when entering planet SOI
  soiCaptureRadius: number; // 1.0x to 2.5x capture zone
  cameraMode: CameraPerspective;
  hudStyle: HudStyle;
  enableHyperspaceFX: boolean;
}

export interface TeleportState {
  isTeleporting: boolean;
  progress: number; // 0 to 1
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetBodyName: string;
  phase: 'idle' | 'charging' | 'warp_tunnel' | 'arrival';
}

export interface SpaceshipState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // In radians (0 = pointing right / east)
  angularVelocity: number;
  thrust: boolean;
  reverse: boolean;
  turningLeft: boolean;
  turningRight: boolean;
  isBoosting: boolean; // Afterburner
  isNitroActive: boolean; // Continuous high-velocity Nitro Overdrive (held down)
  isWarping: boolean; // Hyperdrive / Quantum cruise
  fuel: number; // 0 to 100%
  shields: number; // 0 to 100%
  hull: number; // 0 to 100%
  speedKms: number; // Current calculated velocity in km/s
  flightMode: FlightMode;
  currentOrbitBody: CelestialBodyData | null;
  targetBody: CelestialBodyData | null;
  distanceToTargetKm: number;
  targetAngle: number;
  isAutopilotEngaged: boolean;
  proximityBody: CelestialBodyData | null;
  proximityDistanceKm: number;
  surfaceSurveyComplete: boolean;
  collectedSamples: number;
  teleport: TeleportState;
}

export interface RadarContact {
  body: CelestialBodyData;
  x: number;
  y: number;
  distanceKm: number;
  angle: number;
  isTarget: boolean;
  isNear: boolean;
}
