import React, { useRef, useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SpaceshipState, FlightSettings } from '../../types/spaceship';
import {
  Rocket,
  Zap,
  Target,
  Orbit,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Compass,
  Map,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  HandMetal,
} from 'lucide-react';

interface MobileFlightControlsProps {
  ship: SpaceshipState;
  settings: FlightSettings;
  onThrust: (active: boolean) => void;
  onReverse: (active: boolean) => void;
  onTurnLeft: (active: boolean) => void;
  onTurnRight: (active: boolean) => void;
  onNitro: (active: boolean) => void;
  onJoystickMove: (x: number, y: number) => void;
  onEmergencyStop: () => void;
  onToggleWarp: () => void;
  onToggleAutopilot: () => void;
  onEnterOrbit: () => void;
  onOpenTargetModal: () => void;
  onOpenMapModal: () => void;
  onOpenSettingsModal: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const MobileFlightControls: React.FC<MobileFlightControlsProps> = ({
  ship,
  settings,
  onThrust,
  onReverse,
  onTurnLeft,
  onTurnRight,
  onNitro,
  onJoystickMove,
  onEmergencyStop,
  onToggleWarp,
  onToggleAutopilot,
  onEnterOrbit,
  onOpenTargetModal,
  onOpenMapModal,
  onOpenSettingsModal,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false);

  const isInsideSOI = ship.proximityBody !== null;

  // Touch Virtual Joystick Logic (with explicit preventDefault to avoid scrolling the page)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingJoystick(true);
    updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDraggingJoystick) return;
    updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingJoystick(false);
    setJoystickPos({ x: 0, y: 0 });
    onJoystickMove(0, 0);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2 - 8;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setJoystickPos({ x: dx, y: dy });
    onJoystickMove(dx / maxRadius, dy / maxRadius);
  };

  return (
    <div className="lg:hidden flex flex-col justify-between absolute inset-0 z-20 pointer-events-none p-2 sm:p-3 overflow-hidden select-none touch-none overscroll-none">
      
      {/* Top Mobile Flight Telemetry Bar (Ultra-compact & translucent) */}
      <div className="w-full flex items-center justify-between bg-gray-950/75 backdrop-blur-md border border-cyan-500/20 rounded-xl p-1.5 px-2.5 shadow-lg pointer-events-auto mt-0.5 sm:mt-1 touch-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <div className="truncate flex items-baseline gap-1.5">
            <span className="text-xs font-bold text-white font-mono truncate">
              {ship.speedKms.toFixed(0)} <span className="text-[9px] text-gray-400 font-normal">km/s</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono truncate hidden sm:inline">
              Target: {ship.targetBody ? ship.targetBody.name : 'Free Space'}
            </span>
          </div>
        </div>

        {/* Quick Toolbar (Map, Zoom +/-, Settings, Stop) */}
        <div className="flex items-center gap-1 shrink-0">
          {onZoomIn && (
            <button
              onClick={onZoomIn}
              className="p-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-cyan-400 active:bg-gray-800 transition-colors"
              title="Zoom In Simulation"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          )}
          {onZoomOut && (
            <button
              onClick={onZoomOut}
              className="p-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-cyan-400 active:bg-gray-800 transition-colors"
              title="Zoom Out Simulation"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onOpenMapModal}
            className="p-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 active:bg-cyan-900 transition-colors flex items-center gap-1 font-mono text-[10px] font-bold px-2"
            title="System Map & Teleport"
          >
            <Map className="w-3 h-3" />
            <span>MAP</span>
          </button>
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 rounded-lg bg-gray-900/80 border border-gray-800 text-gray-300 active:bg-gray-800 transition-colors"
            title="Flight Settings"
            aria-label="Flight Settings"
          >
            <Sliders className="w-3 h-3" />
          </button>
          <button
            onClick={onEmergencyStop}
            className="px-2 py-1 rounded-lg bg-red-950/70 border border-red-800/80 text-red-300 active:bg-red-900 text-[10px] font-mono font-bold"
          >
            STOP
          </button>
        </div>
      </div>

      {/* Proximity / Orbit Capture Floating Alert (Mobile) */}
      {isInsideSOI && ship.proximityBody && (
        <div className="mx-auto w-full max-w-xs bg-cyan-950/90 border border-cyan-400/70 rounded-xl p-2 shadow-2xl pointer-events-auto flex items-center justify-between gap-2 touch-none backdrop-blur-sm">
          <div className="min-w-0">
            <span className="text-xs font-bold font-mono text-white block truncate">
              {ship.proximityBody.name} Orbit Captured
            </span>
            <span className="text-[9px] text-cyan-300 font-mono block truncate">
              Gravitational vector locked
            </span>
          </div>
          <button
            onClick={onEnterOrbit}
            className="px-2.5 py-1 rounded-lg bg-cyan-400 active:bg-cyan-500 text-gray-950 font-bold font-mono text-[11px] tracking-wider shrink-0 shadow-md"
          >
            ENTER
          </button>
        </div>
      )}

      {/* Bottom Controls Deck (Positioned cleanly at bottom corners) */}
      <div className="w-full flex items-end justify-between gap-2 pb-2 sm:pb-3 px-1 pointer-events-none touch-none">
        
        {/* Left: Joystick or Split D-Pad */}
        {settings.controlScheme === 'dpad' ? (
          <div className="grid grid-cols-3 gap-1 bg-gray-950/75 p-1.5 rounded-xl border border-cyan-500/20 backdrop-blur-md pointer-events-auto touch-none shadow-xl">
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); onThrust(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onThrust(false); }}
              onMouseDown={() => onThrust(true)}
              onMouseUp={() => onThrust(false)}
              className="w-9 h-9 rounded-lg bg-gray-900/90 active:bg-cyan-500 active:text-gray-950 text-cyan-400 border border-gray-800 flex items-center justify-center font-bold touch-none select-none"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); onTurnLeft(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onTurnLeft(false); }}
              onMouseDown={() => onTurnLeft(true)}
              onMouseUp={() => onTurnLeft(false)}
              className="w-9 h-9 rounded-lg bg-gray-900/90 active:bg-cyan-500 active:text-gray-950 text-cyan-400 border border-gray-800 flex items-center justify-center font-bold touch-none select-none"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); onReverse(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onReverse(false); }}
              onMouseDown={() => onReverse(true)}
              onMouseUp={() => onReverse(false)}
              className="w-9 h-9 rounded-lg bg-gray-900/90 active:bg-cyan-500 active:text-gray-950 text-amber-400 border border-gray-800 flex items-center justify-center font-bold touch-none select-none"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onTouchStart={(e) => { e.preventDefault(); onTurnRight(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onTurnRight(false); }}
              onMouseDown={() => onTurnRight(true)}
              onMouseUp={() => onTurnRight(false)}
              className="w-9 h-9 rounded-lg bg-gray-900/90 active:bg-cyan-500 active:text-gray-950 text-cyan-400 border border-gray-800 flex items-center justify-center font-bold touch-none select-none"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Analog Joystick (Compact & Translucent) */
          <div
            ref={joystickBaseRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-950/60 border border-cyan-500/30 flex items-center justify-center pointer-events-auto backdrop-blur-sm shadow-xl touch-none select-none"
          >
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 border border-white/40 shadow-md flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                transition: isDraggingJoystick ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              <Compass className="w-4 h-4 text-gray-950" />
            </div>
            <span className="absolute top-1 text-[7px] font-mono text-gray-500">N</span>
            <span className="absolute bottom-1 text-[7px] font-mono text-gray-500">S</span>
            <span className="absolute left-1 text-[7px] font-mono text-gray-500">W</span>
            <span className="absolute right-1 text-[7px] font-mono text-gray-500">E</span>
          </div>
        )}

        {/* Right: Action Buttons (Compact HUD controls) */}
        <div className="flex flex-col gap-1.5 pointer-events-auto touch-none select-none">
          
          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={onToggleWarp}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold border transition-colors shadow-md touch-none select-none ${
                ship.isWarping
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-gray-950/80 text-purple-300 border-purple-500/40 active:bg-purple-950'
              }`}
            >
              WARP
            </button>

            <button
              onPointerDown={(e) => { e.preventDefault(); onReverse(true); }}
              onPointerUp={(e) => { e.preventDefault(); onReverse(false); }}
              onPointerCancel={() => onReverse(false)}
              onTouchStart={(e) => { e.preventDefault(); onReverse(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onReverse(false); }}
              onMouseDown={() => onReverse(true)}
              onMouseUp={() => onReverse(false)}
              onMouseLeave={() => onReverse(false)}
              className="px-2.5 py-1.5 rounded-lg bg-gray-950/80 border border-amber-500/40 text-amber-300 active:bg-amber-500 active:text-gray-950 font-mono text-[10px] font-bold shadow-md touch-none select-none"
            >
              BRAKE
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* NITRO Boost Button */}
            <button
              onPointerDown={(e) => { e.preventDefault(); onNitro(true); }}
              onPointerUp={(e) => { e.preventDefault(); onNitro(false); }}
              onPointerCancel={() => onNitro(false)}
              onTouchStart={(e) => { e.preventDefault(); onNitro(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onNitro(false); }}
              onMouseDown={() => onNitro(true)}
              onMouseUp={() => onNitro(false)}
              onMouseLeave={() => onNitro(false)}
              className={`flex items-center justify-center gap-1 px-3 h-10 rounded-xl font-bold font-mono text-[11px] tracking-wider transition-all shadow-lg select-none touch-none ${
                ship.isNitroActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-gray-950 scale-95 ring-2 ring-orange-400'
                  : 'bg-gradient-to-r from-orange-600/90 to-amber-600/90 border border-orange-400/40 text-white active:scale-95'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              <span>NITRO</span>
            </button>

            {/* Main Thrust Action */}
            <button
              onPointerDown={(e) => { e.preventDefault(); onThrust(true); }}
              onPointerUp={(e) => { e.preventDefault(); onThrust(false); }}
              onPointerCancel={() => onThrust(false)}
              onTouchStart={(e) => { e.preventDefault(); onThrust(true); }}
              onTouchEnd={(e) => { e.preventDefault(); onThrust(false); }}
              onMouseDown={() => onThrust(true)}
              onMouseUp={() => onThrust(false)}
              onMouseLeave={() => onThrust(false)}
              className="flex-1 flex items-center justify-center gap-1 h-10 px-3.5 rounded-xl bg-cyan-500 active:bg-cyan-400 text-gray-950 font-bold font-mono text-xs tracking-wider shadow-lg shadow-cyan-950/40 select-none touch-none"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>THRUST</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
