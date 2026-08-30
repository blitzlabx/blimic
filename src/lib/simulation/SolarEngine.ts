import { CelestialBodyData } from '../../types/astronomy';
import { SimulationCamera, SimulationSettings, BodyScreenPosition, AsteroidParticle, StarParticle } from '../../types/simulation';
import { calculateOrbitPosition } from '../astronomy/calculations';

export class SolarSimulationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bodies: CelestialBodyData[];
  private settings: SimulationSettings;
  private camera: SimulationCamera;
  
  private stars: StarParticle[] = [];
  private asteroidBelt: AsteroidParticle[] = [];
  private kuiperBelt: AsteroidParticle[] = [];
  
  private screenPositions: Map<string, BodyScreenPosition> = new Map();
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private epochDays = 0;
  
  // Callback hooks
  public onTargetSelect?: (bodyId: string | null) => void;
  public onHoverChange?: (bodyId: string | null) => void;
  public onEpochUpdate?: (epochDays: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    bodies: CelestialBodyData[],
    initialSettings: Partial<SimulationSettings> = {}
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not acquire 2D canvas context');
    this.ctx = context;
    this.bodies = bodies;

    this.settings = {
      isPlaying: true,
      speedMultiplier: 1.0,
      showOrbits: true,
      showLabels: true,
      showTrails: false,
      showHabitableZone: true,
      showAsteroidBelt: true,
      showKuiperBelt: true,
      showMoonOrbit: true,
      enhancedScale: true,
      gridOverlay: true,
      soundEnabled: false,
      ...initialSettings,
    };

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0,
      targetX: 0,
      targetY: 0,
      targetZoom: 1.0,
      followingBodyId: null,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
    };

    this.initBackgroundParticles();
    this.setupPointerListeners();
    this.handleResize();
  }

  private initBackgroundParticles(): void {
    // 600 Background Stars
    this.stars = [];
    for (let i = 0; i < 600; i++) {
      const colors = ['#ffffff', '#f8fafc', '#e0f2fe', '#fef3c7', '#fed7aa'];
      this.stars.push({
        x: (Math.random() - 0.5) * 4000,
        y: (Math.random() - 0.5) * 4000,
        size: Math.random() < 0.85 ? Math.random() * 1.2 + 0.5 : Math.random() * 2.0 + 1.2,
        baseBrightness: Math.random() * 0.7 + 0.3,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Asteroid Belt: Main belt between Mars (195 sim units) and Jupiter (260 sim units)
    this.asteroidBelt = [];
    for (let i = 0; i < 450; i++) {
      const distance = 215 + (Math.random() - 0.5) * 35 + (Math.random() - 0.5) * 15;
      this.asteroidBelt.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        speed: 0.35 + (Math.random() - 0.5) * 0.08,
        size: Math.random() * 1.6 + 0.6,
        opacity: Math.random() * 0.5 + 0.25,
        color: Math.random() > 0.3 ? '#9ca3af' : '#d1d5db',
      });
    }

    // Kuiper Belt: Beyond Neptune (460 sim units) out past Pluto (520 sim units)
    this.kuiperBelt = [];
    for (let i = 0; i < 350; i++) {
      const distance = 485 + (Math.random() - 0.5) * 80;
      this.kuiperBelt.push({
        angle: Math.random() * Math.PI * 2,
        distance,
        speed: 0.01 + (Math.random() - 0.5) * 0.004,
        size: Math.random() * 1.8 + 0.7,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.5 ? '#7dd3fc' : '#cbd5e1',
      });
    }
  }

  public handleResize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) return;

    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.ctx.scale(dpr, dpr);

    // Initial zoom adaptation for screen width
    if (this.camera.zoom === 1.0 && this.camera.targetZoom === 1.0) {
      if (rect.width < 500) {
        this.camera.zoom = 0.55;
        this.camera.targetZoom = 0.55;
      } else if (rect.width < 900) {
        this.camera.zoom = 0.75;
        this.camera.targetZoom = 0.75;
      } else {
        this.camera.zoom = 0.95;
        this.camera.targetZoom = 0.95;
      }
    }
  }

  // Pointer & Gesture Event Handlers
  private setupPointerListeners(): void {
    let isPinching = false;
    let initialPinchDistance = 0;
    let initialPinchZoom = 1.0;

    const getTouchDistance = (t1: Touch, t2: Touch) => {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Mouse Down / Touch Start
    const handlePointerDown = (clientX: number, clientY: number) => {
      this.camera.isDragging = true;
      this.camera.lastMouseX = clientX;
      this.camera.lastMouseY = clientY;
    };

    // Mouse Move / Touch Move
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (this.camera.isDragging) {
        const dx = (clientX - this.camera.lastMouseX) / this.camera.zoom;
        const dy = (clientY - this.camera.lastMouseY) / this.camera.zoom;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          // If user starts panning, break following lock smoothly
          if (this.camera.followingBodyId) {
            this.camera.followingBodyId = null;
          }
        }

        this.camera.x += dx;
        this.camera.y += dy;
        this.camera.targetX = this.camera.x;
        this.camera.targetY = this.camera.y;

        this.camera.lastMouseX = clientX;
        this.camera.lastMouseY = clientY;
      } else {
        // Hit test for hover
        const hoveredId = this.detectHitBody(clientX, clientY);
        if (this.onHoverChange) {
          this.onHoverChange(hoveredId);
        }
      }
    };

    // Pointer Up / Tap
    const handlePointerUp = (clientX: number, clientY: number, wasDrag: boolean) => {
      this.camera.isDragging = false;
      if (!wasDrag) {
        const clickedId = this.detectHitBody(clientX, clientY);
        if (this.onTargetSelect) {
          this.onTargetSelect(clickedId);
        }
      }
    };

    // Mouse Listeners
    let dragStartPos = { x: 0, y: 0 };
    this.canvas.addEventListener('mousedown', (e) => {
      dragStartPos = { x: e.clientX, y: e.clientY };
      handlePointerDown(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', (e) => {
      const dist = Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y);
      handlePointerUp(e.clientX, e.clientY, dist > 5);
    });

    // Wheel Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      this.setTargetZoom(this.camera.targetZoom * zoomFactor);
    }, { passive: false });

    // Touch Listeners
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isPinching = false;
        dragStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        isPinching = true;
        this.camera.isDragging = false;
        initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
        initialPinchZoom = this.camera.targetZoom;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !isPinching) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && isPinching) {
        const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
        const scale = currentDist / initialPinchDistance;
        this.setTargetZoom(initialPinchZoom * scale);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (isPinching && e.touches.length < 2) {
        isPinching = false;
      } else if (!isPinching && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        const dist = Math.hypot(t.clientX - dragStartPos.x, t.clientY - dragStartPos.y);
        handlePointerUp(t.clientX, t.clientY, dist > 8);
      }
    }, { passive: true });
  }

  public detectHitBody(clientX: number, clientY: number): string | null {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    let closestBodyId: string | null = null;
    let minDistance = Infinity;

    for (const [id, pos] of this.screenPositions.entries()) {
      const dx = clickX - pos.screenX;
      const dy = clickY - pos.screenY;
      const dist = Math.hypot(dx, dy);

      // Generous hit box for touch targets (minimum 24px radius)
      const hitRadius = Math.max(pos.screenRadius + 10, 24);
      if (dist <= hitRadius && dist < minDistance) {
        minDistance = dist;
        closestBodyId = id;
      }
    }

    return closestBodyId;
  }

  public setTargetZoom(newZoom: number): void {
    this.camera.targetZoom = Math.max(0.18, Math.min(newZoom, 6.5));
  }

  public zoomIn(): void {
    this.setTargetZoom(this.camera.targetZoom * 1.3);
  }

  public zoomOut(): void {
    this.setTargetZoom(this.camera.targetZoom * 0.77);
  }

  public resetView(): void {
    this.camera.targetX = 0;
    this.camera.targetY = 0;
    this.camera.followingBodyId = null;
    const rect = this.canvas.getBoundingClientRect();
    this.camera.targetZoom = rect.width < 600 ? 0.6 : 0.95;
  }

  public focusBody(bodyId: string): void {
    this.camera.followingBodyId = bodyId;
    
    // Set appropriate contextual zoom based on body scale
    if (bodyId === 'sun') {
      this.camera.targetZoom = 1.2;
    } else if (bodyId === 'moon') {
      this.camera.targetZoom = 3.5;
    } else if (['mercury', 'venus', 'earth', 'mars', 'pluto'].includes(bodyId)) {
      this.camera.targetZoom = 2.4;
    } else {
      this.camera.targetZoom = 1.8;
    }
  }

  public updateSettings(newSettings: Partial<SimulationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public setEpoch(days: number): void {
    this.epochDays = days;
    if (this.onEpochUpdate) {
      this.onEpochUpdate(this.epochDays);
    }
  }

  public start(): void {
    if (this.animationFrameId !== null) return;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (timestamp: number): void => {
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    // Time progression
    if (this.settings.isPlaying) {
      // 1 real second = 5 days * speedMultiplier at standard 1x
      const dayRate = 5 * this.settings.speedMultiplier;
      this.epochDays += dt * dayRate;

      if (this.onEpochUpdate && Math.floor(this.epochDays) % 2 === 0) {
        this.onEpochUpdate(this.epochDays);
      }
    }

    // Smooth Camera Interpolation (Lerp)
    const lerpSpeed = 0.12;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * lerpSpeed;

    if (this.camera.followingBodyId) {
      const targetPos = this.screenPositions.get(this.camera.followingBodyId);
      if (targetPos) {
        this.camera.targetX = -targetPos.worldX;
        this.camera.targetY = -targetPos.worldY;
      }
    }

    this.camera.x += (this.camera.targetX - this.camera.x) * lerpSpeed;
    this.camera.y += (this.camera.targetY - this.camera.y) * lerpSpeed;
  }

  private render(): void {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    const ctx = this.ctx;
    ctx.save();

    // 1. Clear background deep space tone
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Radial Vignette Gradient
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 50,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.6)');
    bgGrad.addColorStop(0.7, 'rgba(3, 7, 18, 0.95)');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Screen Center Origin
    const centerX = width / 2;
    const centerY = height / 2;

    // Apply Camera Transform
    ctx.translate(centerX, centerY);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(this.camera.x, this.camera.y);

    // 3. Render Coordinate Grid & Range Rings
    if (this.settings.gridOverlay) {
      this.renderCoordinateGrid(ctx);
    }

    // 4. Render Starfield with subtle parallax
    this.renderStarfield(ctx);

    // 5. Render Habitable Zone
    if (this.settings.showHabitableZone) {
      this.renderHabitableZone(ctx);
    }

    // 6. Calculate all world coordinates & populate screenPositions map
    const calculatedPositions = this.calculateWorldPositions();

    // 7. Render Asteroid Belt
    if (this.settings.showAsteroidBelt) {
      this.renderAsteroidBelt(ctx);
    }

    // 8. Render Kuiper Belt
    if (this.settings.showKuiperBelt) {
      this.renderKuiperBelt(ctx);
    }

    // 9. Render Orbital Paths
    if (this.settings.showOrbits) {
      this.renderOrbitPaths(ctx, calculatedPositions);
    }

    // 10. Render Sun
    this.renderSun(ctx, calculatedPositions.get('sun')!);

    // 11. Render Planets and Moons
    for (const body of this.bodies) {
      if (body.id === 'sun') continue;
      const pos = calculatedPositions.get(body.id);
      if (!pos) continue;

      this.renderCelestialBody(ctx, body, pos, calculatedPositions);
    }

    ctx.restore();
  }

  private calculateWorldPositions(): Map<string, BodyScreenPosition> {
    const positions = new Map<string, BodyScreenPosition>();
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let earthWorldX = 0;
    let earthWorldY = 0;

    for (const body of this.bodies) {
      let worldX = 0;
      let worldY = 0;
      let angle = 0;

      if (body.id === 'sun') {
        worldX = 0;
        worldY = 0;
      } else if (body.id === 'moon') {
        // Moon orbits Earth
        const moonOrbit = calculateOrbitPosition(
          body.simOrbitRadius,
          body.eccentricity,
          body.orbital.orbitalPeriodDays,
          this.epochDays
        );
        worldX = earthWorldX + moonOrbit.x;
        worldY = earthWorldY + moonOrbit.y;
        angle = moonOrbit.angle;
      } else {
        // Major Planets
        const orbit = calculateOrbitPosition(
          body.simOrbitRadius,
          body.eccentricity,
          body.orbital.orbitalPeriodDays,
          this.epochDays,
          body.orderFromSun * 0.785 // Phase offset
        );
        worldX = orbit.x;
        worldY = orbit.y;
        angle = orbit.angle;

        if (body.id === 'earth') {
          earthWorldX = worldX;
          earthWorldY = worldY;
        }
      }

      // Convert world coordinate to screen coordinate
      const screenX = centerX + (worldX + this.camera.x) * this.camera.zoom;
      const screenY = centerY + (worldY + this.camera.y) * this.camera.zoom;
      const effectiveRadius = this.settings.enhancedScale 
        ? body.simRadius 
        : Math.max(body.simRadius * 0.6, 2.5);

      positions.set(body.id, {
        id: body.id,
        name: body.name,
        screenX,
        screenY,
        screenRadius: effectiveRadius * this.camera.zoom,
        orbitRadius: body.simOrbitRadius,
        angle,
        worldX,
        worldY,
        type: body.type,
        isHovered: false,
        isSelected: this.camera.followingBodyId === body.id,
        parentBodyId: body.id === 'moon' ? 'earth' : undefined,
      });
    }

    this.screenPositions = positions;
    return positions;
  }

  private renderCoordinateGrid(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1 / this.camera.zoom;

    // Concentric Range Rings (100, 200, 300, 400, 500 sim units)
    for (const radius of [100, 200, 300, 400, 500, 600]) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshair Axis Lines
    ctx.beginPath();
    ctx.moveTo(-650, 0);
    ctx.lineTo(650, 0);
    ctx.moveTo(0, -650);
    ctx.lineTo(0, 650);
    ctx.stroke();

    ctx.restore();
  }

  private renderStarfield(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const star of this.stars) {
      // Subtle parallax & twinkle
      const brightness = star.baseBrightness + Math.sin(this.epochDays * star.twinkleSpeed + star.twinklePhase) * 0.2;
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.15, Math.min(1.0, brightness));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size / Math.max(0.8, this.camera.zoom * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  private renderHabitableZone(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    // Inner boundary: ~140 (0.95 AU), Outer boundary: ~210 (1.4 AU)
    const innerRadius = 135;
    const outerRadius = 215;

    const habGrad = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
    habGrad.addColorStop(0, 'rgba(16, 185, 129, 0.0)');
    habGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.04)');
    habGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.04)');
    habGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.fillStyle = habGrad;
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Boundary stroke lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 1 / this.camera.zoom;
    ctx.setLineDash([4 / this.camera.zoom, 8 / this.camera.zoom]);
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  private renderAsteroidBelt(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const a of this.asteroidBelt) {
      const currentAngle = a.angle + (this.epochDays * a.speed * 0.01);
      const x = Math.cos(currentAngle) * a.distance;
      const y = Math.sin(currentAngle) * a.distance;

      ctx.fillStyle = a.color;
      ctx.globalAlpha = a.opacity;
      ctx.beginPath();
      ctx.arc(x, y, a.size / Math.max(0.8, this.camera.zoom * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  private renderKuiperBelt(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (const k of this.kuiperBelt) {
      const currentAngle = k.angle + (this.epochDays * k.speed * 0.005);
      const x = Math.cos(currentAngle) * k.distance;
      const y = Math.sin(currentAngle) * k.distance;

      ctx.fillStyle = k.color;
      ctx.globalAlpha = k.opacity;
      ctx.beginPath();
      ctx.arc(x, y, k.size / Math.max(0.8, this.camera.zoom * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  private renderOrbitPaths(
    ctx: CanvasRenderingContext2D,
    positions: Map<string, BodyScreenPosition>
  ): void {
    ctx.save();

    for (const body of this.bodies) {
      if (body.id === 'sun') continue;
      if (body.id === 'moon') {
        if (!this.settings.showMoonOrbit) continue;
        const earthPos = positions.get('earth');
        if (!earthPos) continue;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1 / this.camera.zoom;
        ctx.setLineDash([2 / this.camera.zoom, 3 / this.camera.zoom]);
        ctx.beginPath();
        ctx.arc(earthPos.worldX, earthPos.worldY, body.simOrbitRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }

      const isSelected = this.camera.followingBodyId === body.id;
      ctx.strokeStyle = isSelected 
        ? 'rgba(56, 189, 248, 0.6)' 
        : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = (isSelected ? 1.5 : 1) / this.camera.zoom;

      // Draw Elliptical Orbit
      const a = body.simOrbitRadius;
      const b = a * Math.sqrt(1 - body.eccentricity * body.eccentricity);
      const c = a * body.eccentricity; // focal offset

      ctx.beginPath();
      // Orbit ellipse with Sun at one focus (-c)
      ctx.ellipse(-c, 0, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderSun(ctx: CanvasRenderingContext2D, sunPos: BodyScreenPosition): void {
    ctx.save();
    const r = sunPos.screenRadius / this.camera.zoom;

    // Multi-layered Solar Corona Glow
    const coronaGrad = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 2.8);
    coronaGrad.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
    coronaGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)');
    coronaGrad.addColorStop(0.65, 'rgba(234, 88, 12, 0.15)');
    coronaGrad.addColorStop(1, 'rgba(234, 88, 12, 0.0)');

    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Solar Core Body
    const bodyGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#fffbeb');
    bodyGrad.addColorStop(0.35, '#fef08a');
    bodyGrad.addColorStop(0.7, '#f59e0b');
    bodyGrad.addColorStop(1, '#d97706');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Subtle pulsating flare spikes
    const pulse = Math.sin(this.epochDays * 0.05) * 0.15 + 1.0;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1.2 / this.camera.zoom;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + (this.epochDays * 0.002);
      const inner = r * 0.95;
      const outer = r * (1.18 * pulse);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();
    }

    // Label
    if (this.settings.showLabels) {
      this.renderLabel(ctx, 'Sun (Sol)', 0, r + 14 / this.camera.zoom, '#fbbf24', true);
    }

    ctx.restore();
  }

  private renderCelestialBody(
    ctx: CanvasRenderingContext2D,
    body: CelestialBodyData,
    pos: BodyScreenPosition,
    allPositions: Map<string, BodyScreenPosition>
  ): void {
    ctx.save();
    ctx.translate(pos.worldX, pos.worldY);

    const r = pos.screenRadius / this.camera.zoom;
    const isSelected = this.camera.followingBodyId === body.id;

    // 1. Render Saturn / Uranus Rings (behind planet half)
    if (body.hasRings && body.ringOuterRadius) {
      this.renderRings(ctx, body, r, true);
    }

    // 2. Planet Disc Base & Shading
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.clip();

    // Planet texture base color
    ctx.fillStyle = body.color;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    // Procedural Details & Belts
    this.renderPlanetProceduralSurface(ctx, body, r);

    // Dynamic Sunlight & Day/Night Terminator Shading
    // Light arrives from the Sun (which is at world origin 0,0)
    // Angle from world origin (0,0) to current position
    const lightAngle = Math.atan2(-pos.worldY, -pos.worldX);

    const shadowGrad = ctx.createLinearGradient(
      Math.cos(lightAngle) * r, Math.sin(lightAngle) * r,
      -Math.cos(lightAngle) * r, -Math.sin(lightAngle) * r
    );
    shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)'); // sunlit crest
    shadowGrad.addColorStop(0.48, 'rgba(0, 0, 0, 0.0)');
    shadowGrad.addColorStop(0.55, 'rgba(3, 7, 18, 0.6)');
    shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.96)'); // dark hemisphere

    ctx.fillStyle = shadowGrad;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.restore(); // Restore clip

    // 3. Atmospheric Rim Glow (for Earth, Venus, Neptune, Titan)
    if (body.atmosphere.hasAtmosphere && r > 4) {
      ctx.strokeStyle = body.accentColor;
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(0, 0, r + ctx.lineWidth * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // 4. Render Saturn / Uranus Rings (front half)
    if (body.hasRings && body.ringOuterRadius) {
      this.renderRings(ctx, body, r, false);
    }

    // 5. Selection Reticle & Target Indicators
    if (isSelected) {
      this.renderTargetReticle(ctx, r, body.accentColor);
    }

    // 6. World Label
    if (this.settings.showLabels) {
      const labelColor = isSelected ? '#38bdf8' : '#e2e8f0';
      const labelY = r + (body.hasRings ? 18 : 12) / this.camera.zoom;
      this.renderLabel(ctx, body.name, 0, labelY, labelColor, isSelected);
    }

    ctx.restore();
  }

  private renderPlanetProceduralSurface(
    ctx: CanvasRenderingContext2D,
    body: CelestialBodyData,
    r: number
  ): void {
    if (body.id === 'earth') {
      // Earth: Oceans + Green continents + Cloud bands
      ctx.fillStyle = '#1e3a8a'; // Deep ocean
      ctx.fillRect(-r, -r, r * 2, r * 2);

      // Continent shapes
      ctx.fillStyle = '#15803d'; // Green land
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.1, r * 0.55, 0, Math.PI * 2);
      ctx.arc(r * 0.35, r * 0.2, r * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Clouds
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = Math.max(1.2, r * 0.2);
      ctx.beginPath();
      ctx.arc(0, -r * 0.3, r * 0.8, 0.2, Math.PI - 0.2);
      ctx.arc(0, r * 0.35, r * 0.7, 0.3, Math.PI - 0.3);
      ctx.stroke();
    } else if (body.id === 'mars') {
      // Mars: Dark volcanic provinces + Polar ice cap
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // White polar ice cap
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, -r * 0.82, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (body.id === 'jupiter') {
      // Jupiter: Banded atmosphere + Great Red Spot
      const bands = [
        { y: -0.7, h: 0.25, col: '#78350f' },
        { y: -0.4, h: 0.2, col: '#fed7aa' },
        { y: -0.15, h: 0.3, col: '#9a3412' },
        { y: 0.2, h: 0.25, col: '#ffedd5' },
        { y: 0.5, h: 0.25, col: '#7c2d12' },
      ];
      for (const band of bands) {
        ctx.fillStyle = band.col;
        ctx.fillRect(-r, band.y * r, r * 2, band.h * r);
      }

      // Great Red Spot
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(r * 0.35, r * 0.25, r * 0.28, r * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (body.id === 'saturn') {
      // Saturn: Subtle cream/gold bands
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-r, -r * 0.3, r * 2, r * 0.2);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-r, r * 0.1, r * 2, r * 0.25);
    } else if (body.id === 'pluto') {
      // Pluto: Heart-shaped Tombaugh Regio
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(r * 0.15, r * 0.1, r * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderRings(
    ctx: CanvasRenderingContext2D,
    body: CelestialBodyData,
    r: number,
    isBackHalf: boolean
  ): void {
    if (!body.ringInnerRadius || !body.ringOuterRadius) return;

    ctx.save();
    const inner = (body.ringInnerRadius / body.simRadius) * r;
    const outer = (body.ringOuterRadius / body.simRadius) * r;
    const tilt = body.id === 'uranus' ? 1.45 : 0.42; // Tilt angle

    ctx.scale(1, tilt);

    // Draw rings
    const ringGrad = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
    if (body.id === 'saturn') {
      ringGrad.addColorStop(0, 'rgba(217, 119, 6, 0.1)');
      ringGrad.addColorStop(0.25, 'rgba(253, 224, 71, 0.7)');
      ringGrad.addColorStop(0.6, 'rgba(180, 83, 9, 0.05)'); // Cassini division!
      ringGrad.addColorStop(0.75, 'rgba(254, 240, 138, 0.65)');
      ringGrad.addColorStop(1, 'rgba(217, 119, 6, 0.0)');
    } else {
      ringGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
      ringGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
      ringGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    }

    ctx.fillStyle = ringGrad;
    ctx.beginPath();

    if (isBackHalf) {
      // Draw upper/back half
      ctx.arc(0, 0, outer, Math.PI, 0, false);
      ctx.arc(0, 0, inner, 0, Math.PI, true);
    } else {
      // Draw lower/front half
      ctx.arc(0, 0, outer, 0, Math.PI, false);
      ctx.arc(0, 0, inner, Math.PI, 0, true);
    }

    ctx.fill();
    ctx.restore();
  }

  private renderTargetReticle(
    ctx: CanvasRenderingContext2D,
    r: number,
    color: string
  ): void {
    ctx.save();
    const reticleR = Math.max(r + 8 / this.camera.zoom, 16 / this.camera.zoom);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5 / this.camera.zoom;

    // Corner brackets
    const bracketLen = 6 / this.camera.zoom;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(-reticleR, -reticleR + bracketLen);
    ctx.lineTo(-reticleR, -reticleR);
    ctx.lineTo(-reticleR + bracketLen, -reticleR);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(reticleR - bracketLen, -reticleR);
    ctx.lineTo(reticleR, -reticleR);
    ctx.lineTo(reticleR, -reticleR + bracketLen);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(-reticleR, reticleR - bracketLen);
    ctx.lineTo(-reticleR, reticleR);
    ctx.lineTo(-reticleR + bracketLen, reticleR);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(reticleR - bracketLen, reticleR);
    ctx.lineTo(reticleR, reticleR);
    ctx.lineTo(reticleR, reticleR - bracketLen);
    ctx.stroke();

    ctx.restore();
  }

  private renderLabel(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string,
    isHighlighted: boolean
  ): void {
    ctx.save();
    const fontSize = Math.max(10, Math.min(13, 11 / Math.sqrt(this.camera.zoom)));
    ctx.font = `${isHighlighted ? '600' : '400'} ${fontSize}px var(--font-sans, system-ui, sans-serif)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Text Shadow / Backing
    ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
    const metrics = ctx.measureText(text);
    const pad = 4;
    ctx.fillRect(x - metrics.width / 2 - pad, y - 1, metrics.width + pad * 2, fontSize + 3);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  public destroy(): void {
    this.stop();
  }
}
