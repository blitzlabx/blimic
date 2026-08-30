import React from 'react';
import { Orbit, Compass, ArrowDown, Rocket, Shield, Globe } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface HeroSectionProps {
  onLaunchSimulation: () => void;
  onExploreWorlds: () => void;
  onOpenFieldGuide: () => void;
  onPilotSpaceship?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchSimulation,
  onExploreWorlds,
  onOpenFieldGuide,
  onPilotSpaceship,
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 cosmic-grid overflow-hidden">
      {/* Subtle Astronomical Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-950/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Orbit Rings Watermark Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 -z-10">
        <div className="w-[500px] h-[500px] rounded-full border border-gray-700/60" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-gray-800/80" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-gray-900" />
      </div>

      <div className="max-w-5xl mx-auto w-full">
        {/* Sub-header Brand Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <Badge variant="cyan" size="md">
            blimic by Blitz
          </Badge>
          <span className="text-gray-400 text-xs font-mono">/</span>
          <Badge variant="slate" size="md">
            blitzlabx
          </Badge>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-gray-400 bg-gray-900/80 px-2.5 py-1 rounded border border-gray-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Keplerian Physics Engine
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display max-w-4xl leading-[1.1]">
          Explore the Solar System with mathematical precision.
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed">
          blimic is an interactive cosmic simulation delivering accurate orbital mechanics, 
          planetary telemetry, deep comparative astrophysics, and a full interplanetary spaceship flight simulator.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          {onPilotSpaceship && (
            <button
              onClick={onPilotSpaceship}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-gray-950 font-bold font-mono text-sm tracking-wide transition-all shadow-lg shadow-cyan-950/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 w-full sm:w-auto"
            >
              <Rocket className="w-4 h-4" />
              <span>Pilot Spaceship Simulator</span>
            </button>
          )}

          <button
            onClick={onLaunchSimulation}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 font-semibold text-sm tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 w-full sm:w-auto"
          >
            <Orbit className="w-4 h-4" />
            <span>Launch Solar Sim</span>
          </button>

          <button
            onClick={onExploreWorlds}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 text-gray-300 border border-gray-800 font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 w-full sm:w-auto"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Planetary Catalog</span>
          </button>

          <button
            onClick={onOpenFieldGuide}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-gray-900 text-gray-400 hover:text-gray-200 text-sm font-mono transition-colors w-full sm:w-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Field Guide</span>
          </button>
        </div>

        {/* Technical Metric Indicators */}
        <div className="mt-14 pt-8 border-t border-gray-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">9 Worlds</div>
            <div className="text-xs text-gray-400 font-mono mt-1">Mercury to Pluto + Moon</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">60 FPS</div>
            <div className="text-xs text-gray-400 font-mono mt-1">Physics & Flight Engine</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">1 Central Star</div>
            <div className="text-xs text-gray-400 font-mono mt-1">Sol (G2V Main Sequence)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">J2000.0</div>
            <div className="text-xs text-gray-400 font-mono mt-1">Astronomical Epoch Standard</div>
          </div>
        </div>

      </div>

      {/* Down Indicator */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onLaunchSimulation}
          className="flex flex-col items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none"
          aria-label="Scroll to simulation"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest">Interactive Simulation</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
