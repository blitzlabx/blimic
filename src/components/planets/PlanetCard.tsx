import React from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Planet3DPreview } from '../ui/Planet3DPreview';
import { Badge } from '../ui/Badge';
import { Target, Info } from 'lucide-react';
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
      className={`group relative flex flex-col justify-between bg-surface border rounded-sm p-4 sm:p-5 transition-colors ${
        isSelected
          ? 'border-emerald-500/60 bg-surface-elevated'
          : 'border-subtle hover:border-hover hover:bg-surface-elevated'
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
              <h3 className="text-lg font-bold text-primary font-display group-hover:text-emerald-300 transition-colors">
                {body.name}
              </h3>
            </div>
            <p className="text-xs text-secondary font-mono mt-0.5">{body.subtitle}</p>
          </div>

          <Badge variant={body.id === 'sun' ? 'amber' : body.id === 'pluto' ? 'rose' : 'emerald'}>
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
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 pb-3 border-t border-subtle">
          <div>
            <span className="text-[10px] text-muted uppercase block">Diameter</span>
            <span className="text-secondary font-medium">
              {formatMetricNumber(body.physical.equatorialDiameterKm, 0)} km
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted uppercase block">Distance</span>
            <span className="text-secondary font-medium">
              {body.orbital.semiMajorAxisAu > 0 ? `${body.orbital.semiMajorAxisAu.toFixed(2)} AU` : '0.00 AU'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted uppercase block">Gravity</span>
            <span className="text-emerald-400 font-medium">
              {body.physical.surfaceGravityG}g ({body.physical.surfaceGravityMs2} m/s²)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-muted uppercase block">Moons</span>
            <span className="text-secondary font-medium">
              {body.moons.count} {body.moons.count === 1 ? 'Moon' : 'Moons'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-subtle">
        <button
          onClick={onInspect}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm bg-surface hover:bg-surface-elevated text-secondary hover:text-primary border border-subtle text-xs font-mono transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Data Sheet</span>
        </button>

        <button
          onClick={onSimulate}
          className="flex items-center justify-center p-2 rounded-sm bg-emerald-950/40 hover:bg-emerald-500 text-emerald-400 hover:text-canvas border border-emerald-500/30 text-xs font-mono transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          title="Center and view in simulation"
          aria-label={`Simulate ${body.name}`}
        >
          <Target className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};