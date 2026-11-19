import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import { formatMetricNumber } from '../../lib/astronomy/calculations';
import { Layers, ArrowUpDown } from 'lucide-react';

interface ComparativeMatrixTableProps {
  bodies: CelestialBodyData[];
  onSelectBody: (id: string) => void;
}

export const ComparativeMatrixTable: React.FC<ComparativeMatrixTableProps> = ({
  bodies,
  onSelectBody,
}) => {
  const [sortKey, setSortKey] = useState<string>('order');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedBodies = [...bodies].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'order') diff = a.orderFromSun - b.orderFromSun;
    else if (sortKey === 'name') diff = a.name.localeCompare(b.name);
    else if (sortKey === 'diameter') diff = a.physical.equatorialDiameterKm - b.physical.equatorialDiameterKm;
    else if (sortKey === 'mass') diff = a.physical.massEarths - b.physical.massEarths;
    else if (sortKey === 'gravity') diff = a.physical.surfaceGravityG - b.physical.surfaceGravityG;
    else if (sortKey === 'distance') diff = a.orbital.semiMajorAxisAu - b.orbital.semiMajorAxisAu;
    else if (sortKey === 'period') diff = a.orbital.orbitalPeriodDays - b.orbital.orbitalPeriodDays;
    else if (sortKey === 'temp') diff = a.thermal.meanTempC - b.thermal.meanTempC;
    else if (sortKey === 'moons') diff = a.moons.count - b.moons.count;
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="bg-surface border border-subtle rounded-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas/40">
        <div>
          <h3 className="text-base font-bold text-primary font-display">
            Planetary Parameter Comparison Matrix
          </h3>
          <p className="text-xs text-secondary font-mono">
            Direct benchmark of physical and orbital metrics relative to terrestrial units
          </p>
        </div>
        <Badge variant="emerald">11 Bodies Indexed</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-subtle bg-canvas/60 text-secondary select-none">
              <th onClick={() => handleSort('order')} className="p-3.5 pl-4 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>World</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('diameter')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Diameter (km)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('mass')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Mass (Earths)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('gravity')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Gravity (g)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('distance')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Distance (AU)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('period')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Period (Days)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('temp')} className="p-3.5 cursor-pointer hover:text-primary">
                <div className="flex items-center gap-1">
                  <span>Mean Temp (°C)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th onClick={() => handleSort('moons')} className="p-3.5 pr-4 cursor-pointer hover:text-primary text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>Moons</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {sortedBodies.map((b) => (
              <tr
                key={b.id}
                onClick={() => onSelectBody(b.id)}
                className="hover:bg-canvas/60 cursor-pointer transition-colors"
              >
                <td className="p-3 pl-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="font-bold text-primary font-display text-sm">{b.name}</span>
                    <span className="text-[10px] text-secondary">({b.typeLabel})</span>
                  </div>
                </td>
                <td className="p-3 text-secondary">
                  {formatMetricNumber(b.physical.equatorialDiameterKm, 0)}
                </td>
                <td className="p-3 text-secondary">
                  {b.physical.massEarths.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                </td>
                <td className="p-3 text-emerald-300 font-bold">
                  {b.physical.surfaceGravityG}g
                </td>
                <td className="p-3 text-secondary">
                  {b.orbital.semiMajorAxisAu > 0 ? b.orbital.semiMajorAxisAu.toFixed(3) : '0.000'}
                </td>
                <td className="p-3 text-secondary">
                  {b.orbital.orbitalPeriodDays > 0
                    ? formatMetricNumber(b.orbital.orbitalPeriodDays, 1)
                    : 'Origin'}
                </td>
                <td className="p-3 text-amber-300">
                  {b.thermal.meanTempC}°C
                </td>
                <td className="p-3 pr-4 text-right text-secondary font-bold">
                  {b.moons.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};