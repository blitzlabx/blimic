import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { formatSimulationEpoch, calculateLightTravelTime } from '../../lib/astronomy/calculations';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface TelemetryHUDProps {
  selectedBody: CelestialBodyData;
  epochDays: number;
  speedMultiplier: number;
  isPlaying: boolean;
  onInspectDetails: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  selectedBody,
  epochDays,
  speedMultiplier,
  isPlaying,
  onInspectDetails,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const epoch = formatSimulationEpoch(epochDays);
  const distanceKm = selectedBody.orbital.semiMajorAxisKm;
  const lightTime = calculateLightTravelTime(distanceKm);

  return (
    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none max-w-xs sm:max-w-md w-full">
      
      {/* Desktop & Tablet Full HUD */}
      <div className="hidden sm:block bg-gray-950/85 backdrop-blur-md border border-gray-800/90 rounded-2xl p-4 text-gray-200 shadow-xl pointer-events-auto">
        
        {/* Header: Target & Epoch */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 shadow-sm"
              style={{ backgroundColor: selectedBody.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight font-display">
                  {selectedBody.name}
                </span>
                <Badge variant={selectedBody.id === 'sun' ? 'amber' : 'cyan'}>
                  {selectedBody.typeLabel}
                </Badge>
              </div>
              <p className="text-[11px] text-gray-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                {selectedBody.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onInspectDetails}
            className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-gray-700/80 text-xs font-mono transition-colors shrink-0"
          >
            Data Sheet
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 text-xs font-mono">
          <div>
            <span className="text-gray-400 text-[10px] block uppercase">Solar Distance</span>
            <span className="text-gray-100 font-medium">
              {selectedBody.orbital.semiMajorAxisAu > 0
                ? `${selectedBody.orbital.semiMajorAxisAu.toFixed(3)} AU`
                : '0.000 AU (Origin)'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] block uppercase">Orbital Velocity</span>
            <span className="text-gray-100 font-medium">
              {selectedBody.orbital.averageOrbitalSpeedKms > 0
                ? `${selectedBody.orbital.averageOrbitalSpeedKms.toFixed(1)} km/s`
                : '220 km/s (Galactic)'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] block uppercase">Light Travel Time</span>
            <span className="text-cyan-300 font-medium">
              {selectedBody.id === 'sun' ? '0.00 seconds' : lightTime}
            </span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] block uppercase">Orbital Period</span>
            <span className="text-gray-100 font-medium">
              {selectedBody.orbital.orbitalPeriodDays > 0
                ? `${selectedBody.orbital.orbitalPeriodDays.toFixed(1)} days`
                : 'Static Anchor'}
            </span>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 pt-2.5 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {isPlaying ? `Rate: ${(5 * speedMultiplier).toFixed(1)} d/s` : 'Simulation Paused'}
          </span>
          <span>{epoch.julianDate}</span>
        </div>

      </div>

      {/* Mobile Compact HUD Chip (Prevents Overlap) */}
      <div className="sm:hidden bg-gray-950/90 backdrop-blur-md border border-gray-800 rounded-xl p-2 px-3 shadow-lg pointer-events-auto flex items-center justify-between gap-2 max-w-[260px]">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: selectedBody.color }}
          />
          <div className="truncate">
            <span className="font-bold text-white text-xs font-display truncate block">
              {selectedBody.name}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono truncate block">
              {selectedBody.orbital.semiMajorAxisAu > 0
                ? `${selectedBody.orbital.semiMajorAxisAu.toFixed(2)} AU`
                : 'Center'}
            </span>
          </div>
        </div>

        <button
          onClick={onInspectDetails}
          className="px-2 py-1 rounded bg-gray-900 text-cyan-300 text-[10px] font-mono border border-gray-800 shrink-0"
        >
          Details
        </button>
      </div>

    </div>
  );
};
