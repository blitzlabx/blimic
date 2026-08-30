import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SpaceshipState, RadarContact, FlightSettings } from '../../types/spaceship';
import { Badge } from '../ui/Badge';
import {
  Rocket,
  Compass,
  Zap,
  Gauge,
  Target,
  Orbit,
  Sliders,
  Map,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  HandMetal,
  ShieldAlert,
} from 'lucide-react';

interface FlightControlsHUDProps {
  ship: SpaceshipState;
  bodies: CelestialBodyData[];
  radarContacts: RadarContact[];
  settings: FlightSettings;
  onSelectTarget: (bodyId: string) => void;
  onToggleAutopilot: () => void;
  onToggleWarp: () => void;
  onEnterOrbit: () => void;
  onEmergencyStop: () => void;
  onOpenTargetModal: () => void;
  onOpenMapModal: () => void;
  onOpenSettingsModal: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const FlightControlsHUD: React.FC<FlightControlsHUDProps> = ({
  ship,
  bodies,
  radarContacts,
  settings,
  onSelectTarget,
  onToggleAutopilot,
  onToggleWarp,
  onEnterOrbit,
  onEmergencyStop,
  onOpenTargetModal,
  onOpenMapModal,
  onOpenSettingsModal,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const targetBody = ship.targetBody;
  const isInsideSOI = ship.proximityBody !== null;

  if (settings.hudStyle === 'hidden' || isCollapsed) {
    return (
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {onZoomIn && (
          <button
            onClick={onZoomIn}
            className="p-2.5 rounded-xl bg-gray-950/90 border border-gray-800 text-cyan-400 hover:bg-gray-900 shadow-xl flex items-center gap-1.5 text-xs font-mono font-bold backdrop-blur-md"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}
        {onZoomOut && (
          <button
            onClick={onZoomOut}
            className="p-2.5 rounded-xl bg-gray-950/90 border border-gray-800 text-cyan-400 hover:bg-gray-900 shadow-xl flex items-center gap-1.5 text-xs font-mono font-bold backdrop-blur-md"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onOpenMapModal}
          className="p-2.5 rounded-xl bg-gray-950/90 border border-cyan-500/40 text-cyan-400 hover:bg-gray-900 shadow-xl flex items-center gap-2 text-xs font-mono font-bold backdrop-blur-md"
          title="System Map & Teleport"
        >
          <Map className="w-4 h-4" />
          <span>MAP</span>
        </button>
        <button
          onClick={onOpenSettingsModal}
          className="p-2.5 rounded-xl bg-gray-950/90 border border-gray-800 text-gray-300 hover:bg-gray-900 shadow-xl flex items-center gap-2 text-xs font-mono font-bold backdrop-blur-md"
          title="Flight Settings"
        >
          <Sliders className="w-4 h-4" />
          <span>SETTINGS</span>
        </button>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 rounded-xl bg-gray-950/90 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-900 shadow-xl backdrop-blur-md"
          title="Show HUD"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Top Left: Sleek Edge Instruments (Desktop & Tablet) */}
      <div className="hidden sm:block absolute top-4 left-4 z-20 pointer-events-none max-w-[280px] w-full">
        <div className="bg-gray-950/85 backdrop-blur-md border border-gray-800/90 rounded-2xl p-3 text-gray-200 shadow-2xl pointer-events-auto space-y-2.5">
          
          {/* Header & Quick Action Buttons */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-850">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="font-bold text-white text-xs font-display truncate">
                Kepler-X Pathfinder
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSettingsModal}
                className="p-1 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-cyan-400 transition-colors"
                title="Flight Physics & Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded-lg hover:bg-gray-850 text-gray-400 hover:text-white transition-colors"
                title="Collapse HUD"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Telemetry Numbers */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <div className="bg-gray-900/70 border border-gray-850 rounded-xl p-2">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Velocity</span>
              <span className="text-sm font-bold text-cyan-300">
                {ship.speedKms.toFixed(1)} <span className="text-[9px] text-gray-400">km/s</span>
              </span>
            </div>

            <div className="bg-gray-900/70 border border-gray-850 rounded-xl p-2">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Target</span>
              <span className="text-xs font-bold text-white truncate block">
                {targetBody ? targetBody.name : 'None'}
              </span>
            </div>
          </div>

          {/* Plasma Core & Fuel (Compact Edge Bar) */}
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                <span>Plasma Core</span>
              </span>
              <span className={ship.fuel < 20 ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                {Math.round(ship.fuel)}%
              </span>
            </div>
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className={`h-full transition-all duration-300 ${
                  ship.fuel < 20 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${ship.fuel}%` }}
              />
            </div>
          </div>

          {/* Map & Stop Quick Buttons */}
          <div className="pt-1 flex items-center gap-1.5 text-xs font-mono">
            <button
              onClick={onOpenMapModal}
              className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Map className="w-3 h-3" />
              <span>Map & Jump</span>
            </button>
            <button
              onClick={onEmergencyStop}
              className="py-1.5 px-2.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-[11px] font-bold transition-colors"
              title="Full Stop Brake"
            >
              STOP
            </button>
          </div>

        </div>
      </div>

      {/* Top Right: Tactical Radar & System Actions (Desktop & Tablet) */}
      <div className="hidden sm:flex flex-col items-end gap-2.5 absolute top-4 right-4 z-20 pointer-events-none max-w-xs w-full">
        
        {/* Navigation Action Buttons Row */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={onOpenMapModal}
            className="px-3 py-1.5 rounded-xl bg-gray-950/90 hover:bg-gray-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
          >
            <Map className="w-3.5 h-3.5" />
            <span>SOLAR MAP</span>
          </button>
          <button
            onClick={onOpenSettingsModal}
            className="px-3 py-1.5 rounded-xl bg-gray-950/90 hover:bg-gray-900 border border-gray-800 text-gray-300 text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>
        </div>

        {/* Tactical Radar Mini-Map */}
        <div className="bg-gray-950/85 backdrop-blur-md border border-gray-800/90 rounded-2xl p-2.5 shadow-2xl pointer-events-auto w-40 h-40 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[9px] font-mono text-gray-400 pb-0.5 border-b border-gray-850">
            <span>SECTOR RADAR</span>
            <span className="text-cyan-400">100 AU</span>
          </div>

          <div className="relative w-28 h-28 rounded-full border border-cyan-500/20 bg-gray-950 flex items-center justify-center overflow-hidden my-auto">
            <div className="absolute inset-2 rounded-full border border-gray-850" />
            <div className="absolute inset-6 rounded-full border border-gray-850" />
            <div className="absolute w-full h-[1px] bg-cyan-500/10" />
            <div className="absolute h-full w-[1px] bg-cyan-500/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white" />

            {radarContacts.map((c) => {
              const relX = (c.x - ship.x) * 0.045;
              const relY = (c.y - ship.y) * 0.045;
              const dist = Math.hypot(relX, relY);
              if (dist > 52) return null;

              return (
                <div
                  key={c.body.id}
                  className={`absolute rounded-full transition-all ${
                    c.isTarget
                      ? 'w-2 h-2 border border-cyan-400 animate-pulse'
                      : 'w-1.5 h-1.5'
                  }`}
                  style={{
                    backgroundColor: c.body.color,
                    left: `calc(50% + ${relX}px - 3px)`,
                    top: `calc(50% + ${relY}px - 3px)`,
                  }}
                  title={c.body.name}
                />
              );
            })}
          </div>

          <div className="text-[8px] font-mono text-gray-500">
            {radarContacts.length} BODIES IN RADAR
          </div>
        </div>

        {/* Proximity / Orbit Alert Trigger */}
        {isInsideSOI && ship.proximityBody && (
          <div className="bg-cyan-950/90 border border-cyan-400/80 rounded-2xl p-3 shadow-2xl pointer-events-auto w-full space-y-2 animate-bounce">
            <div className="flex items-center gap-1.5">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold font-mono text-white uppercase truncate">
                {ship.proximityBody.name} Orbit Captured
              </span>
            </div>
            <button
              onClick={onEnterOrbit}
              className="w-full py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-gray-950 text-xs font-bold font-mono tracking-wider transition-colors shadow-lg"
            >
              ENTER ORBIT & VISIT (E)
            </button>
          </div>
        )}

      </div>

      {/* Desktop Quick Bottom Bar */}
      <div className="hidden lg:flex items-center justify-between absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-gray-950/85 backdrop-blur-md border border-gray-800/90 rounded-xl p-2 px-3 text-xs font-mono text-gray-300 shadow-xl pointer-events-auto">
          <span className="text-cyan-400 font-bold">PILOT:</span>
          <span>[W/S] Thrust/Brake</span>
          <span>[A/D] Steer</span>
          <span>[Shift] Warp</span>
          <span>[Space] Boost</span>
          <span>[E] Orbit</span>
          <span>[T] Target</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-950/85 backdrop-blur-md border border-gray-800/90 rounded-xl p-2 px-3 shadow-xl pointer-events-auto">
          {onZoomIn && (
            <button
              onClick={onZoomIn}
              className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Zoom In Simulation (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          )}
          {onZoomOut && (
            <button
              onClick={onZoomOut}
              className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Zoom Out Simulation (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          )}
          {onResetZoom && (
            <button
              onClick={onResetZoom}
              className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-gray-800" />

          <button
            onClick={onToggleAutopilot}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
              ship.isAutopilotEngaged
                ? 'bg-cyan-500 text-gray-950 border border-cyan-400'
                : 'bg-gray-900 text-gray-300 hover:text-white border border-gray-800'
            }`}
          >
            AUTOPILOT: {ship.isAutopilotEngaged ? 'ENGAGED' : 'OFF'}
          </button>

          <button
            onClick={onToggleWarp}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
              ship.isWarping
                ? 'bg-purple-600 text-white border border-purple-400'
                : 'bg-gray-900 text-gray-300 hover:text-white border border-gray-800'
            }`}
          >
            WARP DRIVE: {ship.isWarping ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      </div>
    </>
  );
};
