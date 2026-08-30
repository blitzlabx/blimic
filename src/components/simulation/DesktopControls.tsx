import React from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SimulationSettings } from '../../types/simulation';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Target,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesktopControlsProps {
  settings: SimulationSettings;
  bodies: CelestialBodyData[];
  selectedBodyId: string | null;
  onUpdateSettings: (newSettings: Partial<SimulationSettings>) => void;
  onSelectBody: (id: string) => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusSelected: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const DesktopControls: React.FC<DesktopControlsProps> = ({
  settings,
  bodies,
  selectedBodyId,
  onUpdateSettings,
  onSelectBody,
  onResetView,
  onZoomIn,
  onZoomOut,
  onFocusSelected,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const speedPresets = [0.25, 0.5, 1, 2, 5, 10, 25, 50];

  return (
    <div className="hidden md:flex flex-col gap-2 absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
      
      {/* Planetary Quick Selector Bar */}
      <div className="flex items-center justify-center gap-1.5 bg-gray-950/90 backdrop-blur-md border border-gray-800/90 rounded-xl p-1.5 px-3 shadow-xl max-w-4xl mx-auto w-full overflow-x-auto pointer-events-auto">
        <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wider mr-1 shrink-0">
          Focus:
        </span>
        {bodies.map((body) => {
          const isSelected = selectedBodyId === body.id;
          return (
            <button
              key={body.id}
              onClick={() => onSelectBody(body.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: body.color }}
              />
              <span>{body.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Control Deck */}
      <div className="flex items-center justify-between bg-gray-950/90 backdrop-blur-md border border-gray-800/90 rounded-xl p-2.5 px-4 shadow-xl max-w-4xl mx-auto w-full pointer-events-auto">
        
        {/* Left: Playback & Speed */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateSettings({ isPlaying: !settings.isPlaying })}
            className={`flex items-center justify-center w-9 h-9 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              settings.isPlaying
                ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-gray-950'
            }`}
            title={settings.isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            aria-label={settings.isPlaying ? 'Pause' : 'Play'}
          >
            {settings.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-0.5">
            {speedPresets.map((speed) => (
              <button
                key={speed}
                onClick={() => onUpdateSettings({ speedMultiplier: speed })}
                className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                  settings.speedMultiplier === speed
                    ? 'bg-gray-800 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Layer & Visual Toggles */}
        <div className="flex items-center gap-1.5 border-x border-gray-800/80 px-3">
          {/* Orbits Toggle */}
          <button
            onClick={() => onUpdateSettings({ showOrbits: !settings.showOrbits })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              settings.showOrbits
                ? 'bg-gray-800 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800'
            }`}
            title="Toggle Orbital Paths"
          >
            <span>Orbits</span>
          </button>

          {/* Labels Toggle */}
          <button
            onClick={() => onUpdateSettings({ showLabels: !settings.showLabels })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              settings.showLabels
                ? 'bg-gray-800 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800'
            }`}
            title="Toggle Body Labels"
          >
            <span>Labels</span>
          </button>

          {/* Asteroid Belt Toggle */}
          <button
            onClick={() => onUpdateSettings({ showAsteroidBelt: !settings.showAsteroidBelt })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              settings.showAsteroidBelt
                ? 'bg-gray-800 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800'
            }`}
            title="Toggle Asteroid Belt"
          >
            <span>Asteroids</span>
          </button>

          {/* Habitable Zone Toggle */}
          <button
            onClick={() => onUpdateSettings({ showHabitableZone: !settings.showHabitableZone })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              settings.showHabitableZone
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800'
            }`}
            title="Toggle Habitable Goldilocks Zone"
          >
            <span>Habitable Zone</span>
          </button>

          {/* Enhanced Scale Toggle */}
          <button
            onClick={() => onUpdateSettings({ enhancedScale: !settings.enhancedScale })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              settings.enhancedScale
                ? 'bg-gray-800 text-amber-300 border border-amber-500/30'
                : 'text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800'
            }`}
            title="Toggle Enhanced Visual Planet Size Mode"
          >
            <span>Enhanced Scale</span>
          </button>
        </div>

        {/* Right: Camera Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onFocusSelected}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 border border-gray-800 transition-colors"
            title="Center Camera on Target"
            aria-label="Focus Target"
          >
            <Target className="w-4 h-4" />
          </button>

          <button
            onClick={onZoomIn}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 border border-gray-800 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={onZoomOut}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 border border-gray-800 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={onResetView}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 border border-gray-800 transition-colors"
            title="Reset Camera View"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-cyan-400 border border-gray-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
