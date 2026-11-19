import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import { Layers, Zap, Clock, Orbit, Radio, Scale, ChevronRight } from 'lucide-react';
import { SPEED_OF_LIGHT_KMS, AU_TO_KM, formatMetricNumber } from '../../lib/astronomy/calculations';

interface ExperienceSectionProps {
  bodies: CelestialBodyData[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ bodies }) => {
  const [originId, setOriginId] = useState('earth');
  const [targetId, setTargetId] = useState('mars');
  const [customAu, setCustomAu] = useState(1.0);

  const originBody = bodies.find((b) => b.id === originId) || bodies[3];
  const targetBody = bodies.find((b) => b.id === targetId) || bodies[5];

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

  const calculatedPeriodYears = Math.pow(customAu, 1.5);
  const calculatedPeriodDays = calculatedPeriodYears * 365.25;
  const calculatedVelocityKms = 29.78 / Math.sqrt(customAu);

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-subtle">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">Physics Engine & Scale Architecture</Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-display">
            The Science of Observational Modeling
          </h2>
          <p className="text-sm text-secondary max-w-2xl mt-1">
            True astronomical scales involve immense voids where planets are microscopic grains.
            blimic harmonizes mathematical proportionality with observational clarity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* WIDGET 1 */}
        <div className="bg-surface border border-subtle rounded-sm p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-sm bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary font-display">
                  Interplanetary Radio Latency Simulator
                </h3>
                <p className="text-xs text-secondary font-mono">
                  c = 299,792.458 km/s photon transit delay
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-[11px] text-secondary font-mono uppercase block mb-1.5">
                  Origin Station
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-canvas border border-subtle rounded-sm px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-emerald-500"
                >
                  {bodies.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.orbital.semiMajorAxisAu.toFixed(2)} AU)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-secondary font-mono uppercase block mb-1.5">
                  Destination Target
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-canvas border border-subtle rounded-sm px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-emerald-500"
                >
                  {bodies.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.orbital.semiMajorAxisAu.toFixed(2)} AU)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 font-mono text-xs">
              <div className="bg-canvas border border-subtle p-3.5 rounded-sm">
                <span className="text-[10px] text-secondary uppercase block">Orbital Distance Gap</span>
                <span className="text-sm font-bold text-primary mt-1 block">
                  {formatMetricNumber(distKm, 0)} km
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  {distAu.toFixed(3)} Astronomical Units
                </span>
              </div>

              <div className="bg-canvas border border-subtle p-3.5 rounded-sm">
                <span className="text-[10px] text-emerald-400 uppercase block">One-Way Signal Latency</span>
                <span className="text-sm font-bold text-emerald-300 mt-1 block">
                  {formatTransitTime(lightSeconds)}
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  Round trip: {formatTransitTime(lightSeconds * 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-canvas border border-subtle text-xs text-secondary font-mono">
            {originBody.name === targetBody.name ? (
              <span>Select two different worlds to calculate communication transit latency.</span>
            ) : (
              <span>
                Deep space telemetry transmitted from {originBody.name} to {targetBody.name} requires {formatTransitTime(lightSeconds)} to propagate across the interplanetary medium at the speed of light.
              </span>
            )}
          </div>
        </div>

        {/* WIDGET 2 */}
        <div className="bg-surface border border-subtle rounded-sm p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-sm bg-amber-950/40 border border-amber-800/40 text-amber-400">
                <Orbit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary font-display">
                  Keplerian Harmonic Law Engine
                </h3>
                <p className="text-xs text-secondary font-mono">
                  P² = a³ (Orbital Period vs Semi-Major Axis)
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-secondary">Semi-Major Axis (a):</span>
                <span className="text-amber-400 font-bold">{customAu.toFixed(2)} AU</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="45.0"
                step="0.1"
                value={customAu}
                onChange={(e) => setCustomAu(parseFloat(e.target.value))}
                className="w-full h-2 bg-canvas rounded-sm appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-secondary">
                <span>0.2 AU (Mercury zone)</span>
                <span>5.2 AU (Jupiter)</span>
                <span>30.0 AU (Neptune)</span>
                <span>45.0 AU (Kuiper Belt)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 font-mono text-xs">
              <div className="bg-canvas border border-subtle p-3.5 rounded-sm">
                <span className="text-[10px] text-secondary uppercase block">Orbital Period</span>
                <span className="text-sm font-bold text-amber-300 mt-1 block">
                  {calculatedPeriodYears.toFixed(2)} Yrs
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  {formatMetricNumber(calculatedPeriodDays, 0)} days
                </span>
              </div>

              <div className="bg-canvas border border-subtle p-3.5 rounded-sm">
                <span className="text-[10px] text-secondary uppercase block">Orbital Velocity</span>
                <span className="text-sm font-bold text-primary mt-1 block">
                  {calculatedVelocityKms.toFixed(1)} km/s
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  {(calculatedVelocityKms * 3600).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h
                </span>
              </div>

              <div className="bg-canvas border border-subtle p-3.5 rounded-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] text-secondary uppercase block">Solar Irradiance</span>
                <span className="text-sm font-bold text-emerald-300 mt-1 block">
                  {(1 / (customAu * customAu)).toFixed(3)}x
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  Relative to Earth
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-canvas border border-subtle text-xs text-secondary font-mono">
            According to Keplerian orbital mechanics, as semi-major axis increases, gravitational acceleration declines, requiring planetary velocity to drop while orbital period escalates by the power of 1.5.
          </div>
        </div>
      </div>
    </section>
  );
};