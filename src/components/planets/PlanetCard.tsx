import React from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Planet3DPreview } from '../ui/Planet3DPreview';
import { Badge } from '../ui/Badge';
import { Target, Info, ArrowUpRight } from 'lucide-react';
import { formatMetricNumber } from '../../lib/astronomy/calculations';

interface PlanetCardProps {
  body: CelestialBodyData;
  isSelected: boolean;
  onSelect: () => void;
  onInspect: () => void;
  onSimulate: () => void;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({
  body,
  isSelected,
  onSelect,
  onInspect,
  onSimulate,
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between bg-gray-950/80 border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
        isSelected
          ? 'border-cyan-500/80 bg-gray-900/60 shadow-lg shadow-cyan-950/30'
          : 'border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/40'
      }`}
    >
      {/* Card Header: Name & Badges */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: body.color }}
              />
              <h3 className="text-lg font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                {body.name}
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{body.subtitle}</p>
          </div>

          <Badge variant={body.id === 'sun' ? 'amber' : body.id === 'pluto' ? 'rose' : 'cyan'}>
            {body.typeLabel}
          </Badge>
        </div>

        {/* 3D Visual Centerpiece */}
        <div className="my-4 flex items-center justify-center py-2">
          <div className="relative cursor-pointer" onClick={onInspect}>
            <Planet3DPreview body={body} size={110} />
          </div>
        </div>

        {/* High Density Metric Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 pb-3 border-t border-gray-800/60">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Diameter</span>
            <span className="text-gray-200 font-medium">
              {formatMetricNumber(body.physical.equatorialDiameterKm, 0)} km
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Distance</span>
            <span className="text-gray-200 font-medium">
              {body.orbital.semiMajorAxisAu > 0 ? `${body.orbital.semiMajorAxisAu.toFixed(2)} AU` : '0.00 AU'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Gravity</span>
            <span className="text-cyan-400 font-medium">
              {body.physical.surfaceGravityG}g ({body.physical.surfaceGravityMs2} m/s²)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Moons</span>
            <span className="text-gray-200 font-medium">
              {body.moons.count} {body.moons.count === 1 ? 'Moon' : 'Moons'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-800/60">
        <button
          onClick={onInspect}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-mono transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Data Sheet</span>
        </button>

        <button
          onClick={onSimulate}
          className="flex items-center justify-center p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-gray-950 border border-cyan-500/30 text-xs font-mono transition-colors"
          title="Center and view in simulation"
          aria-label={`Simulate ${body.name}`}
        >
          <Target className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
