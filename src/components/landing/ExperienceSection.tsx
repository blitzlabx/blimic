import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import { Layers, Zap, Clock, Orbit, Radio, Scale, ChevronRight } from 'lucide-react';
import { SPEED_OF_LIGHT_KMS, AU_TO_KM, formatMetricNumber } from '../../lib/astronomy/calculations';

interface ExperienceSectionProps {
  bodies: CelestialBodyData[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ bodies }) => {
  // Light Travel Interactive Calculator State
  const [originId, setOriginId] = useState('earth');
  const [targetId, setTargetId] = useState('mars');

  // Kepler's Law Slider State (AU)
  const [customAu, setCustomAu] = useState(1.0);

  const originBody = bodies.find((b) => b.id === originId) || bodies[3];
  const targetBody = bodies.find((b) => b.id === targetId) || bodies[5];

  // Calculate distance between orbital radii approximation
  const distKm = Math.abs(originBody.orbital.semiMajorAxisKm - targetBody.orbital.semiMajorAxisKm);
  const distAu = Math.abs(originBody.orbital.semiMajorAxisAu - targetBody.orbital.semiMajorAxisAu);
  const lightSeconds = distKm / SPEED_OF_LIGHT_KMS;

  const formatTransitTime = (sec: number) => {
    if (sec < 0.05) return '0.00 seconds (Immediate)';
    if (sec < 60) return `${sec.toFixed(2)} seconds`;
    const minutes = Math.floor(sec / 60);
    const remSec = Math.round(sec % 60);
    if (minutes < 60) return `${minutes}m ${remSec}s`;
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    return `${hours}h ${remMin}m`;
  };

  // Kepler calculations: P = a^(1.5)
  const calculatedPeriodYears = Math.pow(customAu, 1.5);
  const calculatedPeriodDays = calculatedPeriodYears * 365.25;
  const calculatedVelocityKms = 29.78 / Math.sqrt(customAu);

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-800/80">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto pb-12">
        <Badge variant="cyan" size="md">
          Physics Engine & Scale Architecture
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mt-3">
          The Science of Observational Modeling
        </h2>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          True astronomical scales involve immense voids where planets are microscopic grains. 
          blimic harmonizes mathematical proportionality with observational clarity.
        </p>
      </div>

      {/* 2-Column Interactive Demonstrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* WIDGET 1: Speed of Light & Radio Latency Simulator */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Interplanetary Radio Latency Simulator
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  c = 299,792.458 km/s photon transit delay
                </p>
              </div>
            </div>

            {/* Selector Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-[11px] text-gray-400 font-mono uppercase block mb-1.5">
                  Origin Station
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-500"
                >
                  {bodies.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.orbital.semiMajorAxisAu.toFixed(2)} AU)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 font-mono uppercase block mb-1.5">
                  Destination Target
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-500"
                >
                  {bodies.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.orbital.semiMajorAxisAu.toFixed(2)} AU)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Readout Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-6 font-mono text-xs">
              <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase block">Orbital Distance Gap</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {formatMetricNumber(distKm, 0)} km
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  {distAu.toFixed(3)} Astronomical Units
                </span>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-cyan-400 uppercase block">One-Way Signal Latency</span>
                <span className="text-sm font-bold text-cyan-300 mt-1 block">
                  {formatTransitTime(lightSeconds)}
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Round trip: {formatTransitTime(lightSeconds * 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 text-xs text-gray-400 font-mono">
            {originBody.name === targetBody.name ? (
              <span>Select two different worlds to calculate communication transit latency.</span>
            ) : (
              <span>
                Deep space telemetry transmitted from {originBody.name} to {targetBody.name} requires {formatTransitTime(lightSeconds)} to propagate across the interplanetary medium at the speed of light.
              </span>
            )}
          </div>
        </div>

        {/* WIDGET 2: Kepler's Harmonic Law Engine */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
                <Orbit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Keplerian Harmonic Law Engine
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  P² = a³ (Orbital Period vs Semi-Major Axis)
                </p>
              </div>
            </div>

            {/* Slider Control */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Semi-Major Axis (a):</span>
                <span className="text-amber-400 font-bold">{customAu.toFixed(2)} AU</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="45.0"
                step="0.1"
                value={customAu}
                onChange={(e) => setCustomAu(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-400">
                <span>0.2 AU (Mercury zone)</span>
                <span>5.2 AU (Jupiter)</span>
                <span>30.0 AU (Neptune)</span>
                <span>45.0 AU (Kuiper Belt)</span>
              </div>
            </div>

            {/* Calculated Output Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 font-mono text-xs">
              <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase block">Orbital Period</span>
                <span className="text-sm font-bold text-amber-300 mt-1 block">
                  {calculatedPeriodYears.toFixed(2)} Yrs
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  {formatMetricNumber(calculatedPeriodDays, 0)} days
                </span>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-gray-400 uppercase block">Orbital Velocity</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {calculatedVelocityKms.toFixed(1)} km/s
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  {(calculatedVelocityKms * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h
                </span>
              </div>

              <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 uppercase block">Solar Irradiance</span>
                <span className="text-sm font-bold text-cyan-300 mt-1 block">
                  {(1 / (customAu * customAu)).toFixed(3)}x
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Relative to Earth
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900/40 border border-gray-800/80 text-xs text-gray-400 font-mono">
            According to Keplerian orbital mechanics, as semi-major axis increases, gravitational acceleration declines, requiring planetary velocity to drop while orbital period escalates by the power of 1.5.
          </div>
        </div>

      </div>

      {/* Precision Principles 3-Card Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            1. Proportional Dynamics
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Orbital speeds and periods strictly honor relative Keplerian harmonics so inner terrestrial worlds complete multiple orbits per outer gas giant cycle.
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
            2. Real Day-Night Terminator
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Dynamic shadow calculations project day and night hemispheres relative to the central Sun at (0,0), giving planets authentic spherical lighting.
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
            3. Planetary Inclusion
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-normal">
            Pluto is intentionally rendered as the ninth displayed planetary world with its characteristic eccentric orbit and heart-shaped terrain.
          </p>
        </div>
      </div>

    </section>
  );
};
