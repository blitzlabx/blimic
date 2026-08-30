import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Planet3DPreview } from '../ui/Planet3DPreview';
import { Badge } from '../ui/Badge';
import {
  X,
  Target,
  Globe,
  Compass,
  Layers,
  Thermometer,
  Wind,
  Orbit,
  Zap,
  Info,
  Calendar,
  Sparkles,
  ChevronRight,
  Shield,
  Sun,
  Activity,
} from 'lucide-react';
import { formatMetricNumber, calculateLightTravelTime } from '../../lib/astronomy/calculations';

interface PlanetDetailModalProps {
  body?: CelestialBodyData | null;
  bodyId?: string | null;
  bodies?: CelestialBodyData[];
  isOpen: boolean;
  onClose: () => void;
  onFocusInSimulation: (bodyId: string) => void;
}

export const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({
  body: propBody,
  bodyId,
  bodies,
  isOpen,
  onClose,
  onFocusInSimulation,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'physical' | 'orbital' | 'atmosphere' | 'missions'>('overview');

  const body = propBody || (bodyId && bodies ? bodies.find((b) => b.id === bodyId) : null);

  if (!isOpen || !body) return null;

  const lightTime = calculateLightTravelTime(body.orbital.semiMajorAxisKm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      {/* Background Click to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] sm:max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-gray-800/80 bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-4 h-4 rounded-full border border-white/20 shrink-0"
              style={{ backgroundColor: body.color }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold text-white font-display truncate">
                  {body.name}
                </h2>
                <Badge variant={body.id === 'sun' ? 'amber' : 'cyan'}>
                  {body.typeLabel}
                </Badge>
                {body.id === 'pluto' && (
                  <Badge variant="rose">9th Displayed World</Badge>
                )}
                {body.id === 'earth' && (
                  <Badge variant="emerald">Home World</Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{body.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onFocusInSimulation(body.id);
                onClose();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-semibold font-mono tracking-wide transition-colors"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Center In Sim</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2.5 pb-2 border-b border-gray-800/60 bg-gray-950 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'physical', label: 'Physical Specs', icon: Layers },
            { id: 'orbital', label: 'Orbital Telemetry', icon: Orbit },
            { id: 'atmosphere', label: 'Atmosphere & Thermal', icon: Wind },
            { id: 'missions', label: 'Space Missions', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-800 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-3 sm:p-6 overflow-y-auto overflow-x-hidden space-y-5 flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Visual Showcase & Hero Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                <div className="flex flex-col items-center justify-center md:border-r md:border-gray-800/80 pr-0 md:pr-4">
                  <Planet3DPreview body={body} size={160} />
                  <span className="text-[11px] text-gray-400 font-mono mt-2">
                    Axial Tilt: {body.axialTilt}°
                  </span>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-base font-bold text-white font-display">Planetary Profile</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-normal">
                    {body.overview}
                  </p>
                  
                  {/* Key Fast Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                      <span className="text-[10px] text-gray-400 font-mono uppercase block">Equatorial Diameter</span>
                      <span className="text-sm font-bold font-mono text-white">
                        {formatMetricNumber(body.physical.equatorialDiameterKm, 0)} km
                      </span>
                    </div>
                    <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800">
                      <span className="text-[10px] text-gray-400 font-mono uppercase block">Surface Gravity</span>
                      <span className="text-sm font-bold font-mono text-cyan-400">
                        {body.physical.surfaceGravityMs2} m/s² ({body.physical.surfaceGravityG}g)
                      </span>
                    </div>
                    <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-gray-400 font-mono uppercase block">Mean Temperature</span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        {body.thermal.meanTempC}°C ({body.thermal.meanTempK} K)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Home World Earth Data */}
              {body.earthSpecial && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-display text-sm">
                    <Globe className="w-4 h-4" />
                    <span>Home World Terrestrial Environment</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {body.earthSpecial.biosphereDescription}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                    <div className="bg-gray-950/60 p-3 rounded-lg border border-emerald-900/50">
                      <span className="text-emerald-400 font-bold block mb-1">Ocean & Hydrosphere</span>
                      <span className="text-gray-300">
                        {body.earthSpecial.waterCoveragePercentage}% liquid water surface coverage with deep hydrothermal circulation.
                      </span>
                    </div>
                    <div className="bg-gray-950/60 p-3 rounded-lg border border-emerald-900/50">
                      <span className="text-emerald-400 font-bold block mb-1">Earth-Moon Tidal Torque</span>
                      <span className="text-gray-300">
                        {body.earthSpecial.lunarInteraction}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Solar Physics Data */}
              {body.sunSpecial && (
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-display text-sm">
                    <Sun className="w-4 h-4" />
                    <span>Thermonuclear Stellar Dynamics</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-gray-950/60 p-2.5 rounded-lg border border-amber-900/50">
                      <span className="text-gray-400 block text-[10px]">Spectral Class</span>
                      <span className="text-amber-300 font-bold">{body.sunSpecial.spectralType}</span>
                    </div>
                    <div className="bg-gray-950/60 p-2.5 rounded-lg border border-amber-900/50">
                      <span className="text-gray-400 block text-[10px]">Core Temperature</span>
                      <span className="text-amber-300 font-bold">15,000,000°C</span>
                    </div>
                    <div className="bg-gray-950/60 p-2.5 rounded-lg border border-amber-900/50">
                      <span className="text-gray-400 block text-[10px]">Solar Cycle</span>
                      <span className="text-amber-300 font-bold">{body.sunSpecial.solarCycleYears} Years</span>
                    </div>
                    <div className="bg-gray-950/60 p-2.5 rounded-lg border border-amber-900/50">
                      <span className="text-gray-400 block text-[10px]">Stellar Age</span>
                      <span className="text-amber-300 font-bold">{body.sunSpecial.ageBillionYears} Billion Yrs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Astronomical Facts */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Notable Scientific Facts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {body.keyFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-xs text-gray-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geology & Internal Structure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                    Geology & Surface Features
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {body.geologyAndSurface}
                  </p>
                </div>
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                    Internal Structure & Layers
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {body.internalStructure}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PHYSICAL SPECIFICATIONS */}
          {activeTab === 'physical' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Equatorial Diameter</span>
                  <span className="text-base font-bold text-white">
                    {formatMetricNumber(body.physical.equatorialDiameterKm, 1)} km
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    Mean Radius: {formatMetricNumber(body.physical.meanRadiusKm, 1)} km
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Mass</span>
                  <span className="text-base font-bold text-white">
                    {body.physical.massKg.toExponential(4)} kg
                  </span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">
                    {body.physical.massEarths} × Earth Mass
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Volume</span>
                  <span className="text-base font-bold text-white">
                    {body.physical.volumeEarths} × Earth Volume
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Mean Density</span>
                  <span className="text-base font-bold text-white">
                    {body.physical.meanDensityGcm3} g/cm³
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {body.physical.meanDensityGcm3 < 1 ? 'Floats in water' : 'Denser than water'}
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Surface Gravity</span>
                  <span className="text-base font-bold text-cyan-300">
                    {body.physical.surfaceGravityMs2} m/s²
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {body.physical.surfaceGravityG}g Earth Equivalent
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Escape Velocity</span>
                  <span className="text-base font-bold text-amber-300">
                    {body.physical.escapeVelocityKms} km/s
                  </span>
                </div>
              </div>

              {/* Earth Comparative Multiplier Bar */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-3 font-mono">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Relative Scale vs Earth Benchmark
                </h4>
                
                {/* Mass Ratio */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Mass relative to Earth</span>
                    <span className="text-cyan-300 font-bold">{body.physical.massEarths}x</span>
                  </div>
                  <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(2, (Math.log10(body.physical.massEarths + 0.001) + 3) * 16.6))}%` }}
                    />
                  </div>
                </div>

                {/* Gravity Ratio */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Surface Gravity (1.0 = 1g)</span>
                    <span className="text-amber-300 font-bold">{body.physical.surfaceGravityG}g</span>
                  </div>
                  <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (body.physical.surfaceGravityG / 3) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORBITAL TELEMETRY */}
          {activeTab === 'orbital' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Semi-Major Axis</span>
                  <span className="text-base font-bold text-white">
                    {body.orbital.semiMajorAxisAu.toFixed(3)} AU
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {formatMetricNumber(body.orbital.semiMajorAxisKm, 0)} km
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Orbital Period</span>
                  <span className="text-base font-bold text-cyan-300">
                    {body.orbital.orbitalPeriodDays.toFixed(2)} days
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {body.orbital.orbitalPeriodYears.toFixed(3)} Earth Years
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Average Orbital Speed</span>
                  <span className="text-base font-bold text-white">
                    {body.orbital.averageOrbitalSpeedKms} km/s
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {(body.orbital.averageOrbitalSpeedKms * 3600).toLocaleString()} km/h
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Orbital Eccentricity</span>
                  <span className="text-base font-bold text-white">
                    {body.eccentricity}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    {body.eccentricity < 0.05 ? 'Nearly circular' : 'Noticeably elliptical'}
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Orbital Inclination</span>
                  <span className="text-base font-bold text-white">
                    {body.inclination}°
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    Relative to ecliptic plane
                  </span>
                </div>

                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase">Axial Tilt</span>
                  <span className="text-base font-bold text-amber-300">
                    {body.axialTilt}°
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    Rotational obliquity
                  </span>
                </div>
              </div>

              {/* Natural Satellites Overview */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                    Natural Satellites & Moon System
                  </h4>
                  <Badge variant="cyan">{body.moons.count} Confirmed Moons</Badge>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  {body.moons.description}
                </p>
                {body.moons.notableMoons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {body.moons.notableMoons.map((moon, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-gray-950 border border-gray-800 text-xs font-mono text-gray-300"
                      >
                        {moon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ATMOSPHERE & THERMAL */}
          {activeTab === 'atmosphere' && (
            <div className="space-y-5">
              
              {/* Thermal Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-cyan-400 block uppercase">Minimum Temperature</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {body.thermal.minTempC}°C
                  </span>
                  <span className="text-xs text-gray-400 block">{body.thermal.minTempK} K</span>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-amber-400 block uppercase">Mean Temperature</span>
                  <span className="text-lg font-bold text-amber-300">
                    {body.thermal.meanTempC}°C
                  </span>
                  <span className="text-xs text-gray-400 block">{body.thermal.meanTempK} K</span>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 p-3.5 rounded-xl">
                  <span className="text-[10px] text-rose-400 block uppercase">Maximum Temperature</span>
                  <span className="text-lg font-bold text-rose-300">
                    {body.thermal.maxTempC}°C
                  </span>
                  <span className="text-xs text-gray-400 block">{body.thermal.maxTempK} K</span>
                </div>
              </div>

              {/* Atmospheric Composition */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                    Atmospheric Gas Composition
                  </h4>
                  <span className="text-xs font-mono text-gray-400">
                    Surface Pressure: {body.atmosphere.surfacePressureBar} bar
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  {body.atmosphere.description}
                </p>

                {body.atmosphere.majorGases.length > 0 ? (
                  <div className="space-y-3 font-mono pt-2">
                    {body.atmosphere.majorGases.map((gas, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-200">
                            {gas.name} ({gas.symbol})
                          </span>
                          <span className="text-cyan-300 font-bold">{gas.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(2, gas.percentage)}%`,
                              backgroundColor: gas.color || '#38bdf8',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono text-gray-400">
                    Tenuous surface boundary exosphere (near vacuum conditions).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: HISTORICAL MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                Historic Spacecraft Encounters & Orbital Missions
              </h4>

              <div className="space-y-3">
                {body.explorationHistory.map((mission, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white font-display text-sm sm:text-base">
                          {mission.name}
                        </span>
                        <Badge variant="slate">{mission.agency}</Badge>
                        <Badge variant="cyan">{mission.type}</Badge>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-normal">
                        {mission.significance}
                      </p>
                    </div>

                    <div className="text-xs font-mono text-gray-400 sm:text-right shrink-0">
                      Launch: {mission.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800/80 bg-gray-900/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>Light Distance:</span>
            <span className="text-cyan-300 font-semibold">{lightTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onFocusInSimulation(body.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold font-mono tracking-wide transition-colors flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Center in Simulation</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
