import React, { useState } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SimulationSettings } from '../../types/simulation';
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Target,
  SlidersHorizontal,
  X,
  Layers,
  ChevronUp,
  ChevronDown,
  Info,
  Globe,
} from 'lucide-react';

interface MobileControlsProps {
  settings: SimulationSettings;
  bodies: CelestialBodyData[];
  selectedBody: CelestialBodyData;
  onUpdateSettings: (newSettings: Partial<SimulationSettings>) => void;
  onSelectBody: (id: string) => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusSelected: () => void;
  onOpenDetails: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  settings,
  bodies,
  selectedBody,
  onUpdateSettings,
  onSelectBody,
  onResetView,
  onZoomIn,
  onZoomOut,
  onFocusSelected,
  onOpenDetails,
}) => {
  const [isPlanetDrawerOpen, setIsPlanetDrawerOpen] = useState(false);
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);

  return (
    <div className="md:hidden flex flex-col gap-1.5 absolute bottom-2 left-2 right-2 z-30 pointer-events-none">
      
      {/* 1. Compact Planet Quick Strip (Horizontal Scrollable, strictly single line) */}
      <div className="flex items-center gap-1.5 bg-canvas/90 backdrop-blur-md border border-subtle rounded-xl p-1.5 px-2 overflow-x-auto pointer-events-auto scrollbar-none max-w-full">
        {bodies.map((body) => {
          const isSelected = selectedBody.id === body.id;
          return (
            <button
              key={body.id}
              onClick={() => onSelectBody(body.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-colors ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold'
                  : 'bg-surface text-secondary border border-subtle'
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

      {/* 2. Main Mobile Command Dock (Single Compact Bar) */}
      <div className="flex items-center justify-between bg-canvas/95 backdrop-blur-lg border border-subtle rounded-xl p-2 px-2.5 shadow-2xl pointer-events-auto w-full gap-1.5">
        
        {/* Left: Play/Pause Button */}
        <button
          onClick={() => onUpdateSettings({ isPlaying: !settings.isPlaying })}
          className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
            settings.isPlaying
              ? 'bg-surface text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-500 text-canvas font-bold'
          }`}
          aria-label={settings.isPlaying ? 'Pause' : 'Play'}
        >
          {settings.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Speed Selector Chips */}
        <div className="flex items-center bg-surface border border-subtle rounded-lg p-0.5 shrink-0">
          {[1, 5, 25].map((speed) => (
            <button
              key={speed}
              onClick={() => onUpdateSettings({ speedMultiplier: speed })}
              className={`px-2 py-1.5 rounded text-xs font-mono ${
                settings.speedMultiplier === speed
                  ? 'bg-surface-elevated text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-secondary'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Center/Right Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onFocusSelected}
            className="w-8 h-8 rounded-lg bg-surface text-emerald-400 flex items-center justify-center border border-subtle"
            title="Focus Target"
            aria-label="Focus Target"
          >
            <Target className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onZoomIn}
            className="w-8 h-8 rounded-lg bg-surface text-primary flex items-center justify-center border border-subtle"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onZoomOut}
            className="w-8 h-8 rounded-lg bg-surface text-primary flex items-center justify-center border border-subtle"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsLayerDrawerOpen(!isLayerDrawerOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              isLayerDrawerOpen
                ? 'bg-emerald-500 text-canvas border-emerald-400'
                : 'bg-surface text-primary border-subtle'
            }`}
            title="Settings & Overlays"
            aria-label="Overlays"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenDetails}
            className="px-2 py-1.5 rounded-lg bg-emerald-500 text-canvas text-xs font-bold font-mono tracking-tight shrink-0"
          >
            Info
          </button>
        </div>

      </div>

      {/* Layer Settings Bottom Sheet Modal */}
      {isLayerDrawerOpen && (
        <div className="bg-canvas/95 border border-subtle rounded-xl p-3.5 shadow-2xl backdrop-blur-xl pointer-events-auto space-y-2.5 max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 border-b border-subtle">
            <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              Visual Overlays
            </span>
            <button
              onClick={() => setIsLayerDrawerOpen(false)}
              className="text-secondary hover:text-primary p-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
            <button
              onClick={() => onUpdateSettings({ showOrbits: !settings.showOrbits })}
              className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                settings.showOrbits
                  ? 'bg-surface-elevated text-emerald-300 border-emerald-500/40'
                  : 'bg-surface text-secondary border-subtle'
              }`}
            >
              <span>Orbits</span>
              <span className="text-[10px]">{settings.showOrbits ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showLabels: !settings.showLabels })}
              className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                settings.showLabels
                  ? 'bg-surface-elevated text-emerald-300 border-emerald-500/40'
                  : 'bg-surface text-secondary border-subtle'
              }`}
            >
              <span>Labels</span>
              <span className="text-[10px]">{settings.showLabels ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showAsteroidBelt: !settings.showAsteroidBelt })}
              className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                settings.showAsteroidBelt
                  ? 'bg-surface-elevated text-emerald-300 border-emerald-500/40'
                  : 'bg-surface text-secondary border-subtle'
              }`}
            >
              <span>Asteroids</span>
              <span className="text-[10px]">{settings.showAsteroidBelt ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showHabitableZone: !settings.showHabitableZone })}
              className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                settings.showHabitableZone
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-surface text-secondary border-subtle'
              }`}
            >
              <span>Goldilocks</span>
              <span className="text-[10px]">{settings.showHabitableZone ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
