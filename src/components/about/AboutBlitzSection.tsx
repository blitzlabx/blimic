import React from 'react';
import { Badge } from '../ui/Badge';
import { Compass, Orbit, Code2, Cpu, ShieldCheck, Terminal, Globe2 } from 'lucide-react';

export const AboutBlitzSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-800/80">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-gray-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">blimic by Blitz</Badge>
            <span className="text-xs text-gray-400 font-mono">@blitzlabx</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Engine Architecture & Creator Note
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mt-1">
            blimic was engineered by Blitz to bring research-grade orbital mechanics and minimal design to cosmic exploration.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Blitz Creator Identity */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700/80 flex items-center justify-center text-cyan-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">
                Built by Blitz
              </h3>
              <p className="text-xs font-mono text-cyan-400">
                Digital Lab: blitzlabx
              </p>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              blimic is an independent astronomy software project focused on visual precision, numerical integrity, and intuitive scientific tooling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-gray-400">
              <span>Creator / Studio:</span>
              <span className="text-white">Blitz</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Public Handle:</span>
              <span className="text-cyan-400">blitzlabx</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Build Framework:</span>
              <span className="text-white">Next.js + Canvas</span>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specs */}
        <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Technical Principles & Engine Specs
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold">
                <Orbit className="w-4 h-4" />
                <span>Keplerian Newton-Raphson Solver</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Rather than simplified circular approximations, planetary positions are determined by solving Kepler's Transcendental Equation for eccentric anomaly iteratively with sub-milliradian convergence.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                <Code2 className="w-4 h-4" />
                <span>Zero-Overhead 2D Canvas</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Rendered with pure HTML5 Canvas running at a continuous 60 FPS without multi-megabyte 3D engine overhead, ensuring smooth performance on low-power mobile devices.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Terminal className="w-4 h-4" />
                <span>J2000.0 Standard Epoch</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Time calculations anchor to the international standard astronomical epoch (January 1, 2000, 12:00 TT), providing consistent orbital longitude references.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Pure Scientific Dataset</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Atmospheric gas percentages, gravitational constants, orbital elements, and historic spacecraft logs verified against planetary science research baselines.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 text-xs font-mono text-gray-400">
            <span>blimic by Blitz</span>
            <span>All systems nominal</span>
          </div>
        </div>

      </div>

    </section>
  );
};
