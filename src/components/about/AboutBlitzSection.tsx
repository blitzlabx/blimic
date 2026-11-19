import React from 'react';
import { Badge } from '../ui/Badge';
import { Compass, Orbit, Code2, Cpu, ShieldCheck, Terminal, Globe2 } from 'lucide-react';

export const AboutBlitzSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-subtle">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">blimic by Blitz</Badge>
            <span className="text-xs text-secondary font-mono">@blitzlabx</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-display">
            Engine Architecture & Creator Note
          </h2>
          <p className="text-sm text-secondary max-w-2xl mt-1">
            blimic was engineered by Blitz to bring research-grade orbital mechanics and minimal design to cosmic exploration.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-subtle rounded-sm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-sm bg-canvas border border-subtle flex items-center justify-center text-emerald-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-primary font-display">
                Built by Blitz
              </h3>
              <p className="text-xs font-mono text-emerald-400">
                Digital Lab: blitzlabx
              </p>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              blimic is an independent astronomy software project focused on visual precision, numerical integrity, and intuitive scientific tooling.
            </p>
          </div>

          <div className="p-4 rounded-sm bg-canvas border border-subtle space-y-2 text-xs font-mono">
            <div className="flex justify-between text-secondary">
              <span>Creator / Studio:</span>
              <span className="text-primary">Blitz</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Public Handle:</span>
              <span className="text-emerald-400">blitzlabx</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Build Framework:</span>
              <span className="text-primary">Vite + Canvas</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface border border-subtle rounded-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-primary font-display">
              Technical Principles & Engine Specs
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-canvas border border-subtle rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Orbit className="w-4 h-4" />
                <span>Keplerian Newton-Raphson Solver</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Rather than simplified circular approximations, planetary positions are determined by solving Kepler's Transcendental Equation for eccentric anomaly iteratively with sub-milliradian convergence.
              </p>
            </div>

            <div className="bg-canvas border border-subtle rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                <Code2 className="w-4 h-4" />
                <span>Zero-Overhead 2D Canvas</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Rendered with pure HTML5 Canvas running at a continuous 60 FPS without multi-megabyte 3D engine overhead, ensuring smooth performance on low-power mobile devices.
              </p>
            </div>

            <div className="bg-canvas border border-subtle rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Terminal className="w-4 h-4" />
                <span>J2000.0 Standard Epoch</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Time calculations anchor to the international standard astronomical epoch (January 1, 2000, 12:00 TT), providing consistent orbital longitude references.
              </p>
            </div>

            <div className="bg-canvas border border-subtle rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Pure Scientific Dataset</span>
              </div>
              <p className="text-secondary leading-relaxed">
                Atmospheric gas percentages, gravitational constants, orbital elements, and historic spacecraft logs verified against planetary science research baselines.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-subtle text-xs font-mono text-secondary">
            <span>blimic by Blitz</span>
            <span>All systems nominal</span>
          </div>
        </div>
      </div>
    </section>
  );
};