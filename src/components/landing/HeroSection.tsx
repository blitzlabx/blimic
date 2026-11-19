import React from 'react';
import { Orbit, Compass, ArrowDown, Rocket, Globe } from 'lucide-react';
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
    <section id="hero" className="relative min-h-[85vh] sm:min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hairline grid backdrop */}
      <div className="absolute inset-0 cosmic-grid pointer-events-none -z-10" />
      {/* Subtle radial fade to hide grid edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0c0d0e_75%)] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full">
        {/* Sub-header Brand Badge */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="emerald">blimic by Blitz</Badge>
          <span className="text-secondary text-xs font-mono">/</span>
          <Badge variant="slate">blitzlabx</Badge>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-secondary bg-surface px-2 py-0.5 border border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Keplerian Physics Engine
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary font-display max-w-4xl leading-[1.1]">
          Explore the Solar System with mathematical precision.
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-secondary max-w-2xl leading-relaxed">
          blimic is an interactive cosmic simulation delivering accurate orbital mechanics,
          planetary telemetry, deep comparative astrophysics, and a full interplanetary spaceship flight simulator.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          {onPilotSpaceship && (
            <button
              onClick={onPilotSpaceship}
              className="btn-primary"
            >
              <Rocket className="w-4 h-4" />
              <span>Pilot Spaceship Simulator</span>
            </button>
          )}

          <button
            onClick={onLaunchSimulation}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-surface hover:bg-surface-elevated text-emerald-300 border border-emerald-500/40 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 w-full sm:w-auto"
          >
            <Orbit className="w-4 h-4" />
            <span>Launch Solar Sim</span>
          </button>

          <button
            onClick={onExploreWorlds}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-surface hover:bg-surface-elevated text-secondary border border-subtle hover:border-hover font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 w-full sm:w-auto"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Planetary Catalog</span>
          </button>

          <button
            onClick={onOpenFieldGuide}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-transparent hover:bg-surface text-secondary hover:text-primary text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 w-full sm:w-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Field Guide</span>
          </button>
        </div>

        {/* Technical Metric Indicators */}
        <div className="mt-14 pt-8 border-t border-subtle grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-primary">9 Worlds</div>
            <div className="text-xs text-secondary font-mono mt-1">Mercury to Pluto + Moon</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">60 FPS</div>
            <div className="text-xs text-secondary font-mono mt-1">Physics & Flight Engine</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">1 Central Star</div>
            <div className="text-xs text-secondary font-mono mt-1">Sol (G2V Main Sequence)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">J2000.0</div>
            <div className="text-xs text-secondary font-mono mt-1">Astronomical Epoch Standard</div>
          </div>
        </div>

      </div>

      {/* Down Indicator */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onLaunchSimulation}
          className="flex flex-col items-center gap-1.5 text-xs text-secondary hover:text-emerald-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          aria-label="Scroll to simulation"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest">Interactive Simulation</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};