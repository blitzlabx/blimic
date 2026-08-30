import React, { useState, useMemo } from 'react';
import { CelestialBodyData, WorldSortOption, WorldFilterType } from '../../types/astronomy';
import { PlanetCard } from './PlanetCard';
import { PlanetDetailModal } from '../simulation/PlanetDetailModal';
import { Search, SlidersHorizontal, Orbit, Compass, Globe, Sparkles, Filter } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface WorldExplorerProps {
  bodies: CelestialBodyData[];
  selectedBodyId: string;
  onSelectBody: (id: string) => void;
  onNavigateToSimulation: () => void;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({
  bodies,
  selectedBodyId,
  onSelectBody,
  onNavigateToSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<WorldFilterType>('all');
  const [sortBy, setSortBy] = useState<WorldSortOption>('order');
  const [inspectBody, setInspectBody] = useState<CelestialBodyData | null>(null);

  // Filter and Sort Pipeline
  const filteredBodies = useMemo(() => {
    let result = [...bodies];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.typeLabel.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.atmosphere.majorGases.some((g) => g.name.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (filterType === 'rocky') {
      result = result.filter((b) => b.type === 'rocky-planet');
    } else if (filterType === 'gas-giant') {
      result = result.filter((b) => b.type === 'gas-giant');
    } else if (filterType === 'ice-giant') {
      result = result.filter((b) => b.type === 'ice-giant');
    } else if (filterType === 'dwarf') {
      result = result.filter((b) => b.type === 'dwarf-planet');
    } else if (filterType === 'star-moon') {
      result = result.filter((b) => b.type === 'star' || b.type === 'moon');
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'order') {
        return a.orderFromSun - b.orderFromSun;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'diameter') {
        return b.physical.equatorialDiameterKm - a.physical.equatorialDiameterKm;
      }
      if (sortBy === 'distance') {
        return a.orbital.semiMajorAxisKm - b.orbital.semiMajorAxisKm;
      }
      if (sortBy === 'orbitalPeriod') {
        return a.orbital.orbitalPeriodDays - b.orbital.orbitalPeriodDays;
      }
      if (sortBy === 'gravity') {
        return b.physical.surfaceGravityMs2 - a.physical.surfaceGravityMs2;
      }
      if (sortBy === 'moons') {
        return b.moons.count - a.moons.count;
      }
      return 0;
    });

    return result;
  }, [bodies, searchQuery, filterType, sortBy]);

  const filterButtons: { id: WorldFilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All Bodies', count: bodies.length },
    { id: 'rocky', label: 'Rocky Terrestrial', count: bodies.filter((b) => b.type === 'rocky-planet').length },
    { id: 'gas-giant', label: 'Gas Giants', count: bodies.filter((b) => b.type === 'gas-giant').length },
    { id: 'ice-giant', label: 'Ice Giants', count: bodies.filter((b) => b.type === 'ice-giant').length },
    { id: 'dwarf', label: 'Dwarf Planets', count: bodies.filter((b) => b.type === 'dwarf-planet').length },
    { id: 'star-moon', label: 'Star & Moons', count: bodies.filter((b) => b.type === 'star' || b.type === 'moon').length },
  ];

  return (
    <section id="worlds" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-gray-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Astrophysics Catalog</Badge>
            <span className="text-xs text-gray-400 font-mono">11 Planetary Objects</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Planetary Worlds & Celestial Bodies
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mt-1">
            Search, filter, and inspect detailed atmospheric, physical, and orbital metrics for the Sun and all nine worlds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="slate">{filteredBodies.length} Displayed</Badge>
        </div>
      </div>

      {/* Control Bar: Search, Filter Tabs, Sort Dropdown */}
      <div className="mt-8 space-y-4">
        
        {/* Top Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search planet, atmosphere, or characteristics..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider shrink-0">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as WorldSortOption)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="order">Order from Sun</option>
              <option value="name">Alphabetical Name</option>
              <option value="diameter">Equatorial Diameter</option>
              <option value="distance">Solar Distance (AU)</option>
              <option value="orbitalPeriod">Orbital Period</option>
              <option value="gravity">Surface Gravity</option>
              <option value="moons">Moons Count</option>
            </select>
          </div>

        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {filterButtons.map((btn) => {
            const isActive = filterType === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold'
                    : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 hover:bg-gray-850 border border-gray-800'
                }`}
              >
                <span>{btn.label}</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-950 text-[10px] text-gray-400 font-mono">
                  {btn.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Planet Cards Grid */}
      {filteredBodies.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBodies.map((body) => (
            <PlanetCard
              key={body.id}
              body={body}
              isSelected={selectedBodyId === body.id}
              onSelect={() => onSelectBody(body.id)}
              onInspect={() => setInspectBody(body)}
              onSimulate={() => {
                onSelectBody(body.id);
                onNavigateToSimulation();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center py-16 bg-gray-950 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 font-mono text-sm">
            No celestial bodies match "{searchQuery}" in the selected category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400 text-xs font-mono hover:bg-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Detail Modal for Inspected Planet */}
      <PlanetDetailModal
        body={inspectBody}
        isOpen={inspectBody !== null}
        onClose={() => setInspectBody(null)}
        onFocusInSimulation={(id) => {
          onSelectBody(id);
          onNavigateToSimulation();
        }}
      />

    </section>
  );
};
