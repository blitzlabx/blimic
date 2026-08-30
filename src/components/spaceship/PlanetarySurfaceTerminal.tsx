import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import {
  Rocket,
  Shield,
  Gauge,
  Compass,
  Radio,
  Wind,
  Layers,
  Thermometer,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Orbit,
  BookOpen,
} from 'lucide-react';

interface PlanetarySurfaceTerminalProps {
  body: CelestialBodyData;
  fuel: number;
  shields: number;
  samplesCollected: number;
  surveyComplete: boolean;
  onConductSurvey: () => void;
  onLeaveOrbit: () => void;
  onOpenDetailsModal?: () => void;
}

export const PlanetarySurfaceTerminal: React.FC<PlanetarySurfaceTerminalProps> = ({
  body,
  fuel,
  shields,
  samplesCollected,
  surveyComplete,
  onConductSurvey,
  onLeaveOrbit,
  onOpenDetailsModal,
}) => {
  const [isSurveying, setIsSurveying] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleSurveyClick = () => {
    setIsSurveying(true);
    setTimeout(() => {
      onConductSurvey();
      setIsSurveying(false);
    }, 1200);
  };

  const handleLaunchClick = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onLeaveOrbit();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] sm:max-h-[90vh]">
        
        {/* Terminal Header */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/20 flex items-center justify-center shrink-0 shadow-lg"
              style={{ backgroundColor: body.color }}
            >
              <Orbit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-950" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg sm:text-2xl font-bold text-white font-display truncate">
                  {body.name}
                </span>
                <Badge variant={body.id === 'sun' ? 'amber' : 'cyan'}>
                  {body.typeLabel}
                </Badge>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono text-emerald-300 whitespace-nowrap">
                  ORBIT STABLE
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-mono mt-0.5 truncate">
                Surface & Orbital Command Terminal // Pathfinder Docked
              </p>
            </div>
          </div>

          {/* Actions in Header */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenDetailsModal && (
              <button
                onClick={onOpenDetailsModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-850 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-colors"
                title="Full Planetary Dossier"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Scientific</span>
                <span>Dossier</span>
              </button>
            )}

            <button
              onClick={handleLaunchClick}
              disabled={isLaunching}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-gray-950 font-bold font-mono text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-cyan-950 shrink-0"
            >
              <Rocket className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLaunching ? 'animate-bounce' : ''}`} />
              <span>{isLaunching ? 'IGNITING...' : 'LAUNCH TO SPACE'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-5 overflow-y-auto overflow-x-hidden space-y-4 text-xs sm:text-sm text-gray-300 flex-1 min-w-0">
          
          {/* Surface Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-2.5 sm:p-3 space-y-0.5 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-wider block truncate">
                Surface Gravity
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-white block">
                {body.physical.surfaceGravityG.toFixed(2)} g
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono block truncate">
                ({body.physical.surfaceGravityMs2.toFixed(1)} m/s²)
              </span>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-2.5 sm:p-3 space-y-0.5 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-wider block truncate">
                Mean Temperature
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-cyan-300 block">
                {body.thermal.meanTempC}°C
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono block truncate">
                ({body.thermal.meanTempK} K)
              </span>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-2.5 sm:p-3 space-y-0.5 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-wider block truncate">
                Escape Velocity
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-amber-300 block">
                {body.physical.escapeVelocityKms.toFixed(1)} km/s
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono block truncate">
                Orbital Delta-V
              </span>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-2.5 sm:p-3 space-y-0.5 min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-wider block truncate">
                Atmosphere
              </span>
              <span className="text-sm sm:text-lg font-bold font-mono text-white block truncate">
                {body.atmosphere.surfacePressureBar > 0
                  ? `${body.atmosphere.surfacePressureBar} bar`
                  : 'Vacuum'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-mono block truncate">
                {body.atmosphere.hasAtmosphere ? 'Active Envelope' : 'Trace Exosphere'}
              </span>
            </div>
          </div>

          {/* Geological & Surface Scanner Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 sm:p-4 space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Geology & Terrain Scanner</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed break-words">
                {body.geologyAndSurface}
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 sm:p-4 space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Wind className="w-3.5 h-3.5 shrink-0" />
                <span>Atmospheric Spectroscopy</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed break-words">
                {body.atmosphere.description}
              </p>
              {body.atmosphere.majorGases.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {body.atmosphere.majorGases.map((gas, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-[10px] font-mono text-gray-300 whitespace-nowrap"
                    >
                      {gas.name} ({gas.percentage}%)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Surface Probe & Survey Station Action */}
          <div className="bg-gradient-to-r from-gray-900/90 via-gray-950 to-gray-900/90 border border-cyan-500/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-white font-display font-bold text-xs sm:text-sm">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Surface Reconnaissance & Drone Sampling</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-mono leading-relaxed break-words">
                {surveyComplete
                  ? 'Surface survey complete. Core telemetry logs cached and fuel reserves replenished.'
                  : 'Deploy autonomous surface lander to extract mineral samples and atmospheric telemetry.'}
              </p>
            </div>

            <button
              onClick={handleSurveyClick}
              disabled={isSurveying || surveyComplete}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider shrink-0 transition-colors ${
                surveyComplete
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-cyan-300 border border-cyan-500/50'
              }`}
            >
              {surveyComplete ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SURVEY COMPLETED (+1 SAMPLE)</span>
                </>
              ) : isSurveying ? (
                <span>SCANNING SURFACE...</span>
              ) : (
                <span>CONDUCT SURFACE SURVEY</span>
              )}
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-2.5 sm:p-4 bg-gray-900/70 border-t border-gray-800 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs font-mono text-gray-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>Ship Status: 100% Operational</span>
            <span className="hidden sm:inline-block">Samples Logged: {samplesCollected}</span>
          </div>

          <button
            onClick={handleLaunchClick}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold transition-colors self-end xs:self-center"
          >
            <span>Launch to Interplanetary Space</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

