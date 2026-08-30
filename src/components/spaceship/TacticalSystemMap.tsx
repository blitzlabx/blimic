import React, { useState, useMemo } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SpaceshipState } from '../../types/spaceship';
import { Badge } from '../ui/Badge';
import {
  Compass,
  Zap,
  X,
  Target,
  LocateFixed,
  Layers,
  ArrowRight,
  Crosshair,
} from 'lucide-react';

interface TacticalSystemMapProps {
  bodies: CelestialBodyData[];
  ship: SpaceshipState;
  onTeleportToBody: (bodyId: string) => void;
  onTeleportToCoords: (x: number, y: number, name: string) => void;
  onClose: () => void;
}

export const TacticalSystemMap: React.FC<TacticalSystemMapProps> = ({
  bodies,
  ship,
  onTeleportToBody,
  onTeleportToCoords,
  onClose,
}) => {
  const [selectedBodyId, setSelectedBodyId] = useState<string>(ship.targetBody?.id || 'mars');
  const [customWaypoint, setCustomWaypoint] = useState<{ x: number; y: number } | null>(null);

  const selectedBody = useMemo(() => {
    return bodies.find((b) => b.id === selectedBodyId) || bodies[0];
  }, [bodies, selectedBodyId]);

  // Calculate distance from ship to selected body (approximate sim units to AU / km)
  const distanceEstimate = useMemo(() => {
    if (customWaypoint) {
      const dx = customWaypoint.x - ship.x;
      const dy = customWaypoint.y - ship.y;
      const distSim = Math.hypot(dx, dy);
      const au = (distSim / 350).toFixed(2);
      const km = Math.round((distSim / 350) * 149597870).toLocaleString();
      return { au, km, name: `Sector (${Math.round(customWaypoint.x)}, ${Math.round(customWaypoint.y)})` };
    }
    const bodyRadius = selectedBody.simOrbitRadius * 1.6;
    const dx = bodyRadius - ship.x;
    const dy = -ship.y;
    const distSim = Math.hypot(dx, dy);
    const au = (distSim / 350).toFixed(2);
    const km = Math.round((distSim / 350) * 149597870).toLocaleString();
    return { au, km, name: selectedBody.name };
  }, [selectedBody, customWaypoint, ship.x, ship.y]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - svgRect.left;
    const clickY = e.clientY - svgRect.top;

    // Convert SVG coordinates to simulation space (center 0,0)
    const scale = 1400 / svgRect.width;
    const simX = (clickX - svgRect.width / 2) * scale;
    const simY = (clickY - svgRect.height / 2) * scale;

    setCustomWaypoint({ x: Math.round(simX), y: Math.round(simY) });
  };

  const handleExecuteJump = () => {
    if (customWaypoint) {
      onTeleportToCoords(customWaypoint.x, customWaypoint.y, `Custom Waypoint [${customWaypoint.x}, ${customWaypoint.y}]`);
    } else {
      onTeleportToBody(selectedBody.id);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-3 sm:p-4 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white font-display text-sm sm:text-base truncate">
                  Quantum Navigation & System Map
                </span>
                <Badge variant="cyan">Teleport Vector Ready</Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-mono truncate">
                Tap any world or coordinate sector to initiate quantum warp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors shrink-0 ml-2"
            aria-label="Close system map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map View & Sidebar Container */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 overflow-y-auto lg:overflow-hidden min-h-0">
          
          {/* Interactive Solar Map SVG Canvas */}
          <div className="lg:col-span-2 relative bg-gray-950/90 p-2 sm:p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-800/80 overflow-hidden select-none shrink-0 min-h-[220px] sm:min-h-[320px] lg:min-h-0">
            <svg
              viewBox="-700 -700 1400 1400"
              className="w-full h-full max-h-[300px] sm:max-h-[440px] cursor-crosshair touch-none"
              onClick={handleMapClick}
            >
              {/* Grid Lattice */}
              <defs>
                <pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="1" />
                </pattern>
                <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              <rect x="-700" y="-700" width="1400" height="1400" fill="url(#map-grid)" />

              {/* Orbit Rings */}
              {bodies.map((b) => {
                if (b.id === 'sun' || b.id === 'moon') return null;
                const r = b.simOrbitRadius * 1.6;
                const isSelected = selectedBodyId === b.id && !customWaypoint;
                return (
                  <circle
                    key={`orbit-${b.id}`}
                    cx="0"
                    cy="0"
                    r={r}
                    fill="none"
                    stroke={isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.15)'}
                    strokeWidth={isSelected ? '2' : '1'}
                    strokeDasharray={isSelected ? 'none' : '4, 4'}
                  />
                );
              })}

              {/* Asteroid Belt */}
              <circle
                cx="0"
                cy="0"
                r="580"
                fill="none"
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="12"
                strokeDasharray="2, 6"
              />

              {/* Sun */}
              <circle cx="0" cy="0" r="36" fill="url(#sun-glow)" />
              <circle cx="0" cy="0" r="16" fill="#fbbf24" />
              <text x="0" y="32" fill="#fbbf24" fontSize="18" textAnchor="middle" fontFamily="monospace">
                SUN
              </text>

              {/* Planets */}
              {bodies.map((b) => {
                if (b.id === 'sun' || b.id === 'moon') return null;
                const r = b.simOrbitRadius * 1.6;
                // Place static markers along orbit
                const angle = (b.simOrbitRadius * 0.05) % (Math.PI * 2);
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                const isSelected = selectedBodyId === b.id && !customWaypoint;

                return (
                  <g
                    key={`planet-${b.id}`}
                    className="cursor-pointer transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBodyId(b.id);
                      setCustomWaypoint(null);
                    }}
                  >
                    {isSelected && (
                      <circle
                        cx={px}
                        cy={py}
                        r="24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="3, 3"
                      />
                    )}
                    <circle
                      cx={px}
                      cy={py}
                      r={Math.max(6, b.simRadius * 0.8)}
                      fill={b.color}
                    />
                    <text
                      x={px}
                      y={py + 18}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize="14"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {b.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* Spaceship Current Location Marker */}
              <g transform={`translate(${ship.x}, ${ship.y})`}>
                <circle cx="0" cy="0" r="14" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                <polygon points="0,-8 6,6 -6,6" fill="#22c55e" />
                <text x="0" y="-14" fill="#22c55e" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  KEPLER-X (YOU)
                </text>
              </g>

              {/* Custom Waypoint Marker if clicked */}
              {customWaypoint && (
                <g transform={`translate(${customWaypoint.x}, ${customWaypoint.y})`}>
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3, 3" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#c084fc" strokeWidth="1.5" />
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="#c084fc" strokeWidth="1.5" />
                  <text x="0" y="24" fill="#c084fc" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    WAYPOINT TARGET
                  </text>
                </g>
              )}
            </svg>

            {/* Map Controls Watermark */}
            <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 font-mono bg-gray-900/80 px-2 py-1 rounded border border-gray-800">
              CLICK CANVAS TO SET COORDINATE WAYPOINT
            </div>
          </div>

          {/* Destination Selector & Quantum Jump Terminal */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between bg-gray-900/40 space-y-3 sm:space-y-4 min-h-0">
            
            {/* Quick World Selectors */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-gray-400">
                <span>SELECT DESTINATION WORLD:</span>
                {customWaypoint && (
                  <button
                    onClick={() => setCustomWaypoint(null)}
                    className="text-cyan-400 hover:underline text-xs"
                  >
                    Clear Waypoint
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 max-h-[140px] sm:max-h-[180px] overflow-y-auto pr-1">
                {bodies.map((b) => {
                  const isSelected = selectedBodyId === b.id && !customWaypoint;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBodyId(b.id);
                        setCustomWaypoint(null);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-semibold shadow-sm shadow-cyan-500/20'
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border-gray-800'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      <span className="truncate">{b.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Target Readout */}
            <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                <span className="text-gray-400">Target Vector:</span>
                <span className="text-white font-bold text-sm truncate max-w-[180px]">
                  {distanceEstimate.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Distance:</span>
                <span className="text-cyan-400 font-bold">{distanceEstimate.au} AU</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Physical Range:</span>
                <span className="text-gray-300">{distanceEstimate.km} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Transit Mode:</span>
                <span className="text-emerald-400 font-semibold">Instant Quantum Warp</span>
              </div>
            </div>

            {/* Teleport Trigger Button - Placed cleanly down below options without overlaying */}
            <div className="space-y-1.5 pt-2 pb-1">
              <button
                onClick={handleExecuteJump}
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-gray-950 font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-gray-950 shrink-0" />
                <span>INITIATE QUANTUM WARP JUMP</span>
              </button>
              <p className="text-[10px] text-gray-400 text-center font-mono">
                Locks quantum coordinates and initiates relativistic warp cruise
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
