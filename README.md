# blimic by Blitz

An interactive cosmic Solar System exploration experience, high-precision Keplerian orbital simulator, and real-time spaceship flight engine crafted with modern React, TypeScript, Tailwind CSS, and HTML5 Canvas.

Author: Blitz ([@blitzlabx](https://x.com/blitzlabx))

---

## Features

### 1. Spaceship Flight & Exploration Simulator
- **Dual Control Schemes**: Analog joystick or split directional D-pad for mobile touch devices, alongside keyboard controls on desktop.
- **Nitro Speed Overdrive**: Long-press/hold nitro boost for high-speed interplanetary transits with dynamic relativistic particle trails.
- **Keplerian Orbital Capture**: Real-time sphere-of-influence detection allows entering orbit and docking with any of the 9 worlds plus the Sun and the Moon.
- **Orbital Command & Surface Lander**: Deploy reconnaissance landers, extract planetary samples, conduct atmospheric spectroscopy, and examine high-detail scientific profiles.
- **Tactical System Map & Quantum Teleportation**: Real-time solar system mini-map with point-and-click quantum warp teleportation and transit animations.
- **Flight Physics Customization**: Configurable turn rates, flight dampening, collision rebound, autopilot trajectories, and HUD styles.

### 2. Keplerian Astronomical Simulation Engine
- **J2000.0 Epoch Telemetry**: Accurate semi-major axes, eccentricities, orbital inclinations, and orbital periods for all major celestial bodies.
- **Newton-Raphson Kepler Equation Solver**: Solves eccentric anomaly ($E$) and true anomaly ($\nu$) at 60 FPS.
- **Multi-Perspective Astronomical Views**: System scale toggle (Keplerian true distance vs. log-compressed visual clarity), orbital speed multiplier (1x to 1000x), and time-scrubbing controls.
- **Astrophysics Field Guide & World Catalog**: Comprehensive physical, thermal, atmospheric, geological, and historical space mission dossiers.

---

## Flight Controls

### Desktop Keyboard
- `W` / `Up Arrow`: Main Thrusters
- `S` / `Down Arrow`: Reverse Retro-Thrusters
- `A` / `Left Arrow`: Turn Left
- `D` / `Right Arrow`: Turn Right
- `N`: **Nitro Speed Overdrive** (Hold to Boost)
- `Space`: Booster Burst / Launch from Orbit
- `Shift`: Engage Relativistic Warp
- `E` / `Enter`: Enter Planet Orbit & Dock
- `M`: Open Tactical Solar System Map & Teleportation
- `T`: Calibrate Navigation Computer & Target Body
- `O`: Flight Physics Settings
- `X` / `B`: Emergency Inertial Brake / Full Stop

### Mobile Touch
- **Analog Joystick / D-Pad**: Fluid 360-degree vector steering and throttle.
- **NITRO Button**: Hold down to engage instant nitro overdrive speed.
- **BRAKE Button**: Rapid deceleration and full stop.
- **WARP Toggle**: Relativistic cruise mode.
- **ORBIT CAPTURE**: Visual indicator to dock when within a planet's sphere of influence.

---

## Deployment Instructions

### 1. Vercel
Deploy directly via GitHub or the Vercel CLI:
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel --prod
```
The included `vercel.json` automatically configures Vite build output and SPA routing rules.

### 2. Render
1. Push the repository to GitHub.
2. In Render dashboard, click **New > Static Site** or import via Blueprint with the provided `render.yaml`.
3. Set:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### 3. Netlify
1. Connect your repository in Netlify.
2. The provided `netlify.toml` automatically configures:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **SPA Redirect**: `/*` to `/index.html` (Status 200)

### 4. Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Tech Stack & Architecture
- **Framework**: React 18+ with Vite & TypeScript
- **Styling**: Tailwind CSS with dark astronomical color palette
- **Graphics & Physics**: Custom 2D Canvas vector physics engine with Newton-Raphson orbital mechanics
- **Icons**: Lucide React
- **Author Handles**: [@blitzlabx](https://x.com/blitzlabx)
