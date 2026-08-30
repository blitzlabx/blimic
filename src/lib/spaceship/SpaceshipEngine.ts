import { CelestialBodyData } from '../../types/astronomy';
import {
  SpaceshipState,
  Particle,
  RadarContact,
  FlightMode,
  FlightSettings,
  TeleportState,
} from '../../types/spaceship';

export const DEFAULT_FLIGHT_SETTINGS: FlightSettings = {
  controlScheme: 'joystick',
  speedMultiplier: 0.65, // Balanced, smooth control
  turnSensitivity: 0.8,
  spaceDamping: 'assisted', // Auto-stabilize drift
  autoBrakeNearPlanets: true, // Effortless orbital capture
  soiCaptureRadius: 1.8,
  cameraMode: 'third_person',
  hudStyle: 'compact',
  enableHyperspaceFX: true,
};

export class SpaceshipEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bodies: CelestialBodyData[];

  // Simulation loop
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private epochDays = 0;

  // Camera coordinates (centered on ship or planet)
  public camera = {
    x: 0,
    y: 0,
    zoom: 1.0,
    targetZoom: 1.0,
  };
  public userZoomFactor = 1.0;

  // Spaceship state
  public ship: SpaceshipState;

  // Flight settings
  public settings: FlightSettings;

  // Particle systems
  private thrusterParticles: Particle[] = [];
  private warpStars: Particle[] = [];
  private shockwaveRings: { x: number; y: number; radius: number; maxRadius: number; alpha: number; color: string }[] = [];
  private backgroundStars: { x: number; y: number; size: number; alpha: number; color: string }[] = [];
  private asteroids: { x: number; y: number; size: number; angle: number; rotSpeed: number; color: string }[] = [];

  // Planet dynamic positions in simulator space
  public planetPositions: Map<string, { x: number; y: number; radius: number; body: CelestialBodyData }> = new Map();

  // Callbacks for UI updates
  public onStateUpdate?: (ship: SpaceshipState, contacts: RadarContact[]) => void;
  public onProximityAlert?: (body: CelestialBodyData | null, distanceKm: number) => void;
  public onModeChange?: (mode: FlightMode, body: CelestialBodyData | null) => void;
  public onTeleportComplete?: (targetName: string) => void;

  constructor(canvas: HTMLCanvasElement, bodies: CelestialBodyData[], customSettings?: Partial<FlightSettings>) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Failed to acquire 2D canvas context for Spaceship Engine');
    this.ctx = context;
    this.bodies = bodies;
    this.settings = { ...DEFAULT_FLIGHT_SETTINGS, ...customSettings };

    // Start ship near Earth
    const initialTarget = bodies.find((b) => b.id === 'mars') || bodies[4];

    this.ship = {
      x: 350,
      y: 0,
      vx: 0,
      vy: -0.8,
      angle: -Math.PI / 2, // Facing up/north
      angularVelocity: 0,
      thrust: false,
      reverse: false,
      turningLeft: false,
      turningRight: false,
      isBoosting: false,
      isNitroActive: false,
      isWarping: false,
      fuel: 100,
      shields: 100,
      hull: 100,
      speedKms: 18.5,
      flightMode: 'interplanetary',
      currentOrbitBody: null,
      targetBody: initialTarget,
      distanceToTargetKm: 78340000,
      targetAngle: 0,
      isAutopilotEngaged: false,
      proximityBody: null,
      proximityDistanceKm: Infinity,
      surfaceSurveyComplete: false,
      collectedSamples: 0,
      teleport: {
        isTeleporting: false,
        progress: 0,
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        targetBodyName: '',
        phase: 'idle',
      },
    };

    this.initBackground();
    this.initWarpStars();
    this.handleResize();
  }

  private initBackground(): void {
    this.backgroundStars = [];
    for (let i = 0; i < 900; i++) {
      const colors = ['#ffffff', '#f8fafc', '#bae6fd', '#fed7aa', '#fef08a', '#c084fc'];
      this.backgroundStars.push({
        x: (Math.random() - 0.5) * 14000,
        y: (Math.random() - 0.5) * 14000,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Asteroids in Main Belt
    this.asteroids = [];
    for (let i = 0; i < 500; i++) {
      const dist = 580 + (Math.random() - 0.5) * 160;
      const angle = Math.random() * Math.PI * 2;
      this.asteroids.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: Math.random() * 3.5 + 1.2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: Math.random() > 0.4 ? '#9ca3af' : '#6b7280',
      });
    }
  }

  private initWarpStars(): void {
    this.warpStars = [];
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 25 + 15;
      this.warpStars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.3 ? '#38bdf8' : '#c084fc',
        alpha: 0.9,
      });
    }
  }

  public handleResize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    const baseZoom = this.getBaseCameraZoom();
    this.camera.targetZoom = baseZoom * this.userZoomFactor;
    this.camera.zoom = this.camera.targetZoom;
  }

  public getBaseCameraZoom(): number {
    if (this.ship?.isWarping) return 0.65;
    if (this.ship?.isNitroActive) return 0.85;
    if (this.settings.cameraMode === 'close_chase') return 1.4;
    if (this.settings.cameraMode === 'wide_sector') return 0.65;
    const rect = this.canvas.getBoundingClientRect();
    return (rect.width > 0 && rect.width < 640) ? 0.9 : 1.0;
  }

  public applyTargetZoom(): void {
    this.camera.targetZoom = this.getBaseCameraZoom() * this.userZoomFactor;
  }

  public adjustZoom(delta: number): void {
    // delta > 0 zooms in, delta < 0 zooms out
    const nextFactor = this.userZoomFactor * (1 + delta);
    this.userZoomFactor = Math.max(0.25, Math.min(3.5, nextFactor));
    this.applyTargetZoom();
  }

  public setZoomFactor(factor: number): void {
    this.userZoomFactor = Math.max(0.25, Math.min(3.5, factor));
    this.applyTargetZoom();
  }

  public resetZoom(): void {
    this.userZoomFactor = 1.0;
    this.applyTargetZoom();
  }

  public updateSettings(newSettings: Partial<FlightSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.applyTargetZoom();
  }

  public start(): void {
    if (this.animationFrameId !== null) return;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.1);
      this.lastTime = time;
      this.update(dt);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy(): void {
    this.stop();
  }

  // --- Flight Controls ---
  public setThrust(active: boolean): void {
    this.ship.thrust = active;
  }

  public setReverse(active: boolean): void {
    this.ship.reverse = active;
  }

  public setTurningLeft(active: boolean): void {
    this.ship.turningLeft = active;
  }

  public setTurningRight(active: boolean): void {
    this.ship.turningRight = active;
  }

  public setBoosting(active: boolean): void {
    this.ship.isBoosting = active;
  }

  public setNitro(active: boolean): void {
    this.ship.isNitroActive = active;
    this.applyTargetZoom();
  }

  public setWarping(active: boolean): void {
    this.ship.isWarping = active;
    this.applyTargetZoom();
  }

  // Instant Full Stop Emergency Brake
  public emergencyFullStop(): void {
    this.ship.vx *= 0.1;
    this.ship.vy *= 0.1;
    this.ship.angularVelocity = 0;
    this.ship.thrust = false;
    this.ship.isWarping = false;
    this.ship.isBoosting = false;
    this.ship.isNitroActive = false;

    // Spawn emergency retro brake plumes in all 4 cardinal directions
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = Math.random() * 4 + 2;
      this.thrusterParticles.push({
        x: this.ship.x,
        y: this.ship.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 20,
        size: Math.random() * 3 + 1.5,
        color: '#38bdf8',
        alpha: 0.9,
      });
    }
  }

  public setSteeringJoystick(x: number, y: number): void {
    // Virtual joystick input: x (-1 to 1), y (-1 to 1)
    const magnitude = Math.hypot(x, y);
    if (magnitude > 0.12) {
      const targetAngle = Math.atan2(y, x);
      let angleDiff = targetAngle - this.ship.angle;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      
      const turnSpeed = 3.5 * this.settings.turnSensitivity;
      this.ship.angularVelocity = Math.max(-turnSpeed, Math.min(turnSpeed, angleDiff * 4.0));
      this.ship.thrust = magnitude > 0.55;
    } else {
      this.ship.angularVelocity *= 0.75;
      this.ship.thrust = false;
    }
  }

  public toggleAutopilot(): void {
    this.ship.isAutopilotEngaged = !this.ship.isAutopilotEngaged;
  }

  public setTargetPlanet(bodyId: string): void {
    const target = this.bodies.find((b) => b.id === bodyId) || null;
    this.ship.targetBody = target;
  }

  // --- Quantum Teleportation / Warp Jump System ---
  public initiateQuantumTeleport(targetX: number, targetY: number, targetName: string = 'Deep Space Sector'): void {
    if (this.ship.teleport.isTeleporting) return;

    this.ship.isAutopilotEngaged = false;
    this.ship.isWarping = false;
    this.ship.thrust = false;
    this.ship.reverse = false;
    this.ship.flightMode = 'interplanetary';
    this.ship.currentOrbitBody = null;

    this.ship.teleport = {
      isTeleporting: true,
      progress: 0,
      startX: this.ship.x,
      startY: this.ship.y,
      targetX,
      targetY,
      targetBodyName: targetName,
      phase: 'charging',
    };

    // Zoom camera in tight during charge, then pull out for warp tunnel
    this.camera.targetZoom = 1.6;

    // Spawn charge-up energy ring
    this.shockwaveRings.push({
      x: this.ship.x,
      y: this.ship.y,
      radius: 5,
      maxRadius: 80,
      alpha: 1,
      color: '#38bdf8',
    });
  }

  public teleportToBody(bodyId: string): void {
    const targetBody = this.bodies.find((b) => b.id === bodyId);
    if (!targetBody) return;

    const pos = this.planetPositions.get(bodyId);
    const targetX = pos ? pos.x : 0;
    const targetY = pos ? pos.y : 0;

    // Offset slightly so ship arrives into high orbit rather than inside planet
    const arrivalAngle = Math.random() * Math.PI * 2;
    const arrivalDist = (pos?.radius || 30) + 40;
    const finalX = targetX + Math.cos(arrivalAngle) * arrivalDist;
    const finalY = targetY + Math.sin(arrivalAngle) * arrivalDist;

    this.setTargetPlanet(bodyId);
    this.initiateQuantumTeleport(finalX, finalY, targetBody.name);
  }

  public enterPlanetOrbit(bodyId?: string): void {
    const targetId = bodyId || this.ship.proximityBody?.id;
    if (!targetId) return;

    const body = this.bodies.find((b) => b.id === targetId);
    if (!body) return;

    const pos = this.planetPositions.get(body.id);
    if (pos) {
      this.ship.x = pos.x;
      this.ship.y = pos.y;
    }
    this.ship.vx = 0;
    this.ship.vy = 0;
    this.ship.speedKms = 0;
    this.ship.flightMode = 'landed';
    this.ship.currentOrbitBody = body;
    this.ship.isAutopilotEngaged = false;
    this.ship.isWarping = false;
    this.ship.isBoosting = false;
    this.ship.surfaceSurveyComplete = false;

    if (this.onModeChange) {
      this.onModeChange('landed', body);
    }
  }

  public leavePlanetOrbit(): void {
    if (!this.ship.currentOrbitBody) {
      this.ship.flightMode = 'interplanetary';
      return;
    }

    const currentBody = this.ship.currentOrbitBody;
    const pos = this.planetPositions.get(currentBody.id);
    const launchAngle = this.ship.angle;
    
    // Eject ship slightly away from planet at escape velocity
    const ejectDist = (pos?.radius || 30) + 50;
    this.ship.x = (pos?.x || 0) + Math.cos(launchAngle) * ejectDist;
    this.ship.y = (pos?.y || 0) + Math.sin(launchAngle) * ejectDist;
    this.ship.vx = Math.cos(launchAngle) * 3.5 * this.settings.speedMultiplier;
    this.ship.vy = Math.sin(launchAngle) * 3.5 * this.settings.speedMultiplier;
    this.ship.flightMode = 'interplanetary';
    this.ship.currentOrbitBody = null;

    // Takeoff exhaust shockwave
    this.shockwaveRings.push({
      x: this.ship.x,
      y: this.ship.y,
      radius: 10,
      maxRadius: 100,
      alpha: 1,
      color: '#38bdf8',
    });

    for (let i = 0; i < 35; i++) {
      const angle = launchAngle + Math.PI + (Math.random() - 0.5) * 1.2;
      const speed = Math.random() * 5 + 2;
      this.thrusterParticles.push({
        x: this.ship.x,
        y: this.ship.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 30 + Math.random() * 15,
        size: Math.random() * 3.5 + 2,
        color: Math.random() > 0.3 ? '#38bdf8' : '#34d399',
        alpha: 1,
      });
    }

    if (this.onModeChange) {
      this.onModeChange('interplanetary', null);
    }
  }

  public conductSurfaceSurvey(): void {
    this.ship.surfaceSurveyComplete = true;
    this.ship.collectedSamples += 1;
    this.ship.fuel = Math.min(100, this.ship.fuel + 50); // Refuel at planetary station
    this.ship.shields = 100;
    this.ship.hull = 100;
  }

  // --- Physics & Logic Update ---
  private update(dt: number): void {
    this.epochDays += dt * 1.8;

    // 1. Update Celestial Body Positions
    this.planetPositions.clear();
    const scaleFactor = 1.6;

    this.bodies.forEach((body) => {
      let x = 0;
      let y = 0;

      if (body.id === 'sun') {
        x = 0;
        y = 0;
      } else if (body.id === 'moon') {
        const earthPos = this.planetPositions.get('earth');
        const moonAngle = this.epochDays * 0.35;
        const moonDist = 28;
        x = (earthPos?.x || 350) + Math.cos(moonAngle) * moonDist;
        y = (earthPos?.y || 0) + Math.sin(moonAngle) * moonDist;
      } else {
        const orbitRadius = body.simOrbitRadius * scaleFactor;
        const orbitSpeed = body.simOrbitSpeed * 0.08;
        const angle = (this.epochDays * orbitSpeed) % (Math.PI * 2);
        x = Math.cos(angle) * orbitRadius;
        y = Math.sin(angle) * orbitRadius * (1 - body.eccentricity * 0.5);
      }

      this.planetPositions.set(body.id, {
        x,
        y,
        radius: Math.max(12, body.simRadius * 1.5),
        body,
      });
    });

    // 2. Handle Quantum Teleportation / Warp Jump Sequence
    if (this.ship.teleport.isTeleporting) {
      const tp = this.ship.teleport;
      tp.progress += dt * 0.65; // ~1.5s total jump duration

      if (tp.progress < 0.25) {
        tp.phase = 'charging';
        this.camera.targetZoom = 1.5;
        // Screen jitter / charge vibrations
        this.camera.x += (Math.random() - 0.5) * 3;
        this.camera.y += (Math.random() - 0.5) * 3;
      } else if (tp.progress < 0.85) {
        tp.phase = 'warp_tunnel';
        this.camera.targetZoom = 0.55;
        // Smooth cubic interpolation across space
        const t = (tp.progress - 0.25) / 0.6;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        this.ship.x = tp.startX + (tp.targetX - tp.startX) * ease;
        this.ship.y = tp.startY + (tp.targetY - tp.startY) * ease;
        this.ship.angle = Math.atan2(tp.targetY - tp.startY, tp.targetX - tp.startX);

        // Spawn warp tunnel streaks
        for (let i = 0; i < 4; i++) {
          const spreadAngle = this.ship.angle + Math.PI + (Math.random() - 0.5) * 0.6;
          this.thrusterParticles.push({
            x: this.ship.x,
            y: this.ship.y,
            vx: Math.cos(spreadAngle) * 20,
            vy: Math.sin(spreadAngle) * 20,
            life: 0,
            maxLife: 25,
            size: Math.random() * 4 + 2,
            color: '#c084fc',
            alpha: 0.9,
          });
        }
      } else if (tp.progress < 1.0) {
        tp.phase = 'arrival';
        this.ship.x = tp.targetX;
        this.ship.y = tp.targetY;
        this.ship.vx = 0;
        this.ship.vy = 0;
        this.camera.targetZoom = this.settings.cameraMode === 'close_chase' ? 1.4 : this.settings.cameraMode === 'wide_sector' ? 0.65 : 1.0;
      } else {
        // Complete Teleportation
        tp.isTeleporting = false;
        tp.phase = 'idle';
        this.ship.vx = 0;
        this.ship.vy = 0;
        this.ship.speedKms = 0;

        // Arrival shockwave
        this.shockwaveRings.push({
          x: this.ship.x,
          y: this.ship.y,
          radius: 10,
          maxRadius: 140,
          alpha: 1,
          color: '#38bdf8',
        });

        if (this.onTeleportComplete) {
          this.onTeleportComplete(tp.targetBodyName);
        }
      }

      this.camera.x += (this.ship.x - this.camera.x) * 0.2;
      this.camera.y += (this.ship.y - this.camera.y) * 0.2;
      this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.1;
      this.updateParticles();
      this.updateRadarAndProximity();
      return;
    }

    // 3. Landed State
    if (this.ship.flightMode === 'landed') {
      if (this.ship.currentOrbitBody) {
        const pPos = this.planetPositions.get(this.ship.currentOrbitBody.id);
        if (pPos) {
          this.ship.x = pPos.x;
          this.ship.y = pPos.y;
        }
      }
      this.camera.x = this.ship.x;
      this.camera.y = this.ship.y;
      this.updateParticles();
      this.updateRadarAndProximity();
      return;
    }

    // 4. Steering Dynamics with Sensitivity Settings
    const baseRotSpeed = 2.6 * this.settings.turnSensitivity;
    if (this.ship.turningLeft) {
      this.ship.angularVelocity = -baseRotSpeed;
    } else if (this.ship.turningRight) {
      this.ship.angularVelocity = baseRotSpeed;
    } else if (!this.ship.isAutopilotEngaged) {
      this.ship.angularVelocity *= 0.82;
    }

    this.ship.angle += this.ship.angularVelocity * dt;

    // 5. Autopilot Vector Tracking
    if (this.ship.isAutopilotEngaged && this.ship.targetBody) {
      const targetPos = this.planetPositions.get(this.ship.targetBody.id);
      if (targetPos) {
        const dx = targetPos.x - this.ship.x;
        const dy = targetPos.y - this.ship.y;
        const dist = Math.hypot(dx, dy);
        const desiredAngle = Math.atan2(dy, dx);
        
        let angleDiff = desiredAngle - this.ship.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        this.ship.angle += angleDiff * Math.min(1.0, dt * 4.5);

        if (dist > (targetPos.radius + 70)) {
          this.ship.thrust = true;
          this.ship.isWarping = dist > 380;
        } else {
          this.ship.thrust = false;
          this.ship.isWarping = false;
          this.ship.vx *= 0.88;
          this.ship.vy *= 0.88;
          if (dist < targetPos.radius + 45) {
            this.enterPlanetOrbit(this.ship.targetBody.id);
          }
        }
      }
    }

    // 6. Thrust, Brake, and Sensitivity Calculations
    const speedMult = this.settings.speedMultiplier;
    let accel = 0;

    if (this.ship.isWarping && this.ship.fuel > 0) {
      accel = 16.0 * speedMult;
      this.ship.fuel = Math.max(0, this.ship.fuel - dt * 1.0);
    } else if (this.ship.isNitroActive && this.ship.fuel > 0) {
      // High-velocity Nitro Overdrive Boost
      accel = 11.5 * speedMult;
      this.ship.fuel = Math.max(0, this.ship.fuel - dt * 1.4);
    } else if (this.ship.isBoosting && this.ship.fuel > 0) {
      accel = 7.5 * speedMult;
      this.ship.fuel = Math.max(0, this.ship.fuel - dt * 1.8);
    } else if (this.ship.thrust) {
      accel = 3.2 * speedMult; // Smooth and controlled forward thrust
      this.ship.fuel = Math.max(0, this.ship.fuel - dt * 0.15);
    } else if (this.ship.reverse) {
      // Active Continuous Braking / Retro-thruster
      accel = -3.5 * speedMult;
      this.ship.vx *= 0.88;
      this.ship.vy *= 0.88;
    }

    // Solar Recharge when near central star
    const distToSun = Math.hypot(this.ship.x, this.ship.y);
    if (distToSun < 600) {
      this.ship.fuel = Math.min(100, this.ship.fuel + dt * 1.2);
    }

    // Apply acceleration
    if (accel !== 0) {
      this.ship.vx += Math.cos(this.ship.angle) * accel * dt;
      this.ship.vy += Math.sin(this.ship.angle) * accel * dt;

      // Spawn thruster plume particles
      const isWarp = this.ship.isWarping;
      const isNitro = this.ship.isNitroActive;
      const count = isWarp ? 4 : (isNitro ? 4 : 2);
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * (isNitro ? 0.45 : 0.35);
        const pAngle = this.ship.angle + (accel > 0 ? Math.PI : 0) + spread;
        const pSpeed = (accel > 0 ? (isWarp ? 9 : (isNitro ? 7.5 : 4)) : 3) + Math.random() * 2;
        
        let color = '#06b6d4';
        if (isWarp) {
          color = '#c084fc';
        } else if (isNitro) {
          color = Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#f97316' : '#22d3ee');
        } else if (this.ship.isBoosting) {
          color = '#38bdf8';
        } else if (this.ship.reverse) {
          color = '#f59e0b';
        }
        
        this.thrusterParticles.push({
          x: this.ship.x - Math.cos(this.ship.angle) * (accel > 0 ? 12 : -10),
          y: this.ship.y - Math.sin(this.ship.angle) * (accel > 0 ? 12 : -10),
          vx: Math.cos(pAngle) * pSpeed + this.ship.vx * 0.15,
          vy: Math.sin(pAngle) * pSpeed + this.ship.vy * 0.15,
          life: 0,
          maxLife: isWarp ? 25 : (isNitro ? 22 : 15),
          size: Math.random() * 2.5 + (isWarp ? 2.5 : (isNitro ? 2.8 : 1.2)),
          color,
          alpha: 0.95,
        });
      }
    }

    // 7. Planetary Proximity Auto-Deceleration & SOI Assistance
    let nearestDist = Infinity;
    this.planetPositions.forEach((pos) => {
      const d = Math.hypot(pos.x - this.ship.x, pos.y - this.ship.y);
      if (d < nearestDist) nearestDist = d;
      
      // Auto-brake when entering planetary gravitational well (unless nitro overdrive engaged)
      if (this.settings.autoBrakeNearPlanets && !this.ship.isNitroActive && d < (pos.radius + 120)) {
        this.ship.vx *= 0.94;
        this.ship.vy *= 0.94;
        this.ship.isWarping = false;
      }
    });

    // 8. Flight Assist Space Damping (Stabilizes drift)
    if (this.settings.spaceDamping === 'assisted') {
      if (!this.ship.thrust && !this.ship.isBoosting && !this.ship.isNitroActive && !this.ship.isWarping) {
        this.ship.vx *= 0.97;
        this.ship.vy *= 0.97;
      }
    } else if (this.settings.spaceDamping === 'standard') {
      this.ship.vx *= (1 - dt * 0.02);
      this.ship.vy *= (1 - dt * 0.02);
    }

    // Cap Max Velocity
    const maxSpeed = this.ship.isWarping
      ? 20.0 * speedMult
      : this.ship.isNitroActive
      ? 14.0 * speedMult
      : this.ship.isBoosting
      ? 10.0 * speedMult
      : 5.0 * speedMult;
    const currentSpeed = Math.hypot(this.ship.vx, this.ship.vy);
    if (currentSpeed > maxSpeed) {
      this.ship.vx = (this.ship.vx / currentSpeed) * maxSpeed;
      this.ship.vy = (this.ship.vy / currentSpeed) * maxSpeed;
    }

    // Move Ship
    this.ship.x += this.ship.vx * 60 * dt;
    this.ship.y += this.ship.vy * 60 * dt;

    // Telemetry speed in km/s
    this.ship.speedKms = currentSpeed * 22.5 * (this.ship.isWarping ? 60 : (this.ship.isNitroActive ? 2.5 : 1));

    // Smooth Camera Follow
    this.camera.x += (this.ship.x - this.camera.x) * 0.12;
    this.camera.y += (this.ship.y - this.camera.y) * 0.12;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.08;

    this.updateParticles();
    this.updateRadarAndProximity();
  }

  private updateParticles(): void {
    // Thruster particles
    for (let i = this.thrusterParticles.length - 1; i >= 0; i--) {
      const p = this.thrusterParticles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        this.thrusterParticles.splice(i, 1);
      }
    }

    // Shockwave expansion rings
    for (let i = this.shockwaveRings.length - 1; i >= 0; i--) {
      const sw = this.shockwaveRings[i];
      sw.radius += 3.5;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        this.shockwaveRings.splice(i, 1);
      }
    }
  }

  private updateRadarAndProximity(): void {
    let closestBody: CelestialBodyData | null = null;
    let closestDistKm = Infinity;
    const radarContacts: RadarContact[] = [];

    const captureMultiplier = this.settings.soiCaptureRadius || 1.8;

    this.planetPositions.forEach((pos) => {
      const dx = pos.x - this.ship.x;
      const dy = pos.y - this.ship.y;
      const distSim = Math.hypot(dx, dy);
      const distKm = (distSim / 350) * 149597870;

      const isTarget = this.ship.targetBody?.id === pos.body.id;
      const captureThreshold = (pos.radius + 50) * captureMultiplier;
      const isNear = distSim < captureThreshold;

      if (distKm < closestDistKm) {
        closestDistKm = distKm;
        closestBody = pos.body;
      }

      radarContacts.push({
        body: pos.body,
        x: pos.x,
        y: pos.y,
        distanceKm: distKm,
        angle: Math.atan2(dy, dx),
        isTarget,
        isNear,
      });

      if (isTarget) {
        this.ship.distanceToTargetKm = distKm;
        this.ship.targetAngle = Math.atan2(dy, dx);
      }
    });

    const isInsideSOI = closestBody !== null && closestDistKm < (22000000 * captureMultiplier);
    this.ship.proximityBody = isInsideSOI ? closestBody : null;
    this.ship.proximityDistanceKm = closestDistKm;

    if (this.onProximityAlert) {
      this.onProximityAlert(this.ship.proximityBody, closestDistKm);
    }

    if (this.onStateUpdate) {
      this.onStateUpdate(this.ship, radarContacts);
    }
  }

  // --- Rendering ---
  private render(): void {
    const ctx = this.ctx;
    const width = this.canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const height = this.canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

    ctx.fillStyle = '#030712'; // Deep astronomical black
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw Starfield
    this.backgroundStars.forEach((star) => {
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Quantum Teleportation / Hyperspace FX Lines
    if (this.ship.teleport.isTeleporting && this.ship.teleport.phase === 'warp_tunnel') {
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 40; i++) {
        const offsetDist = Math.random() * 300 - 150;
        const lineAngle = this.ship.angle;
        const lx = this.ship.x + Math.cos(lineAngle + Math.PI / 2) * offsetDist;
        const ly = this.ship.y + Math.sin(lineAngle + Math.PI / 2) * offsetDist;
        ctx.beginPath();
        ctx.moveTo(lx - Math.cos(lineAngle) * 300, ly - Math.sin(lineAngle) * 300);
        ctx.lineTo(lx + Math.cos(lineAngle) * 300, ly + Math.sin(lineAngle) * 300);
        ctx.stroke();
      }
    }

    // 3. Draw Solar System Grid & Coordinate Lattice
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.lineWidth = 1;
    const gridSize = 250;
    const startX = Math.floor((this.camera.x - width * 1.5) / gridSize) * gridSize;
    const endX = Math.floor((this.camera.x + width * 1.5) / gridSize) * gridSize;
    const startY = Math.floor((this.camera.y - height * 1.5) / gridSize) * gridSize;
    const endY = Math.floor((this.camera.y + height * 1.5) / gridSize) * gridSize;

    ctx.beginPath();
    for (let gx = startX; gx <= endX; gx += gridSize) {
      ctx.moveTo(gx, startY);
      ctx.lineTo(gx, endY);
    }
    for (let gy = startY; gy <= endY; gy += gridSize) {
      ctx.moveTo(startX, gy);
      ctx.lineTo(endX, gy);
    }
    ctx.stroke();

    // 4. Draw Asteroid Field
    ctx.fillStyle = '#94a3b8';
    this.asteroids.forEach((ast) => {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(ast.x, ast.y, ast.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw Planetary Orbits & Worlds
    this.planetPositions.forEach((pos) => {
      const { body, x, y, radius } = pos;

      // Orbit Path Ring
      if (body.id !== 'sun' && body.id !== 'moon') {
        const orbitRadius = Math.hypot(x, y);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Gravitational SOI Capture Zone (Expanded and clearly marked)
      const captureThreshold = (radius + 50) * (this.settings.soiCaptureRadius || 1.8);
      ctx.strokeStyle = body.id === 'sun' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(34, 211, 238, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x, y, captureThreshold, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Corona Glow
      const glowGrad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.4);
      glowGrad.addColorStop(0, body.color);
      glowGrad.addColorStop(0.5, body.color + '44');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Body Sphere
      const bodyGrad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(0.3, body.color);
      bodyGrad.addColorStop(0.85, body.secondaryColor || body.accentColor || '#0f172a');
      bodyGrad.addColorStop(1, '#020617');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Saturn Rings
      if (body.hasRings) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.35);
        ctx.scale(1, 0.35);
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.7)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Planet Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(body.name.toUpperCase(), x, y + radius + 16);

      // Target Lock Box
      if (this.ship.targetBody?.id === body.id) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        const boxSize = radius + 12;
        ctx.strokeRect(x - boxSize, y - boxSize, boxSize * 2, boxSize * 2);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('TARGET LOCK', x, y - radius - 14);
      }
    });

    // 6. Draw Shockwaves & Energy Rings
    this.shockwaveRings.forEach((sw) => {
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 7. Draw Thruster Exhaust Particles
    this.thrusterParticles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 8. Draw Spaceship
    if (this.ship.flightMode !== 'landed') {
      ctx.save();
      ctx.translate(this.ship.x, this.ship.y);
      ctx.rotate(this.ship.angle);

      // Warp/Shield Bubble
      if (this.ship.isWarping || this.ship.teleport.isTeleporting || this.ship.shields > 0) {
        ctx.strokeStyle = (this.ship.isWarping || this.ship.teleport.isTeleporting) ? 'rgba(192, 132, 252, 0.6)' : 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 24, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Hull Geometry
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(18, 0); // Nose cone
      ctx.lineTo(-10, -12); // Left wingtip
      ctx.lineTo(-6, -5); // Left notch
      ctx.lineTo(-14, -6); // Left engine
      ctx.lineTo(-14, 6); // Right engine
      ctx.lineTo(-6, 5); // Right notch
      ctx.lineTo(-10, 12); // Right wingtip
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Canopy Glass
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(4, 0, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wingtip lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-11, -13, 2, 2);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-11, 11, 2, 2);

      ctx.restore();

      // Target Vector Line
      if (this.ship.targetBody) {
        const targetPos = this.planetPositions.get(this.ship.targetBody.id);
        if (targetPos) {
          const dx = targetPos.x - this.ship.x;
          const dy = targetPos.y - this.ship.y;
          const angle = Math.atan2(dy, dx);
          
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(this.ship.x, this.ship.y);
          ctx.lineTo(this.ship.x + Math.cos(angle) * 70, this.ship.y + Math.sin(angle) * 70);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    ctx.restore();
  }
}
