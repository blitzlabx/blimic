import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import { SimulationSettings } from '../../types/simulation';
import { SolarSimulationEngine } from '../../lib/simulation/SolarEngine';
import { DesktopControls } from './DesktopControls';
import { MobileControls } from './MobileControls';
import { TelemetryHUD } from './TelemetryHUD';
import { PlanetDetailModal } from './PlanetDetailModal';
import { getCelestialBodyById } from '../../data/planets';

interface SimulationViewerProps {
  bodies: CelestialBodyData[];
  selectedBodyId: string;
  onSelectBody: (id: string) => void;
  isDedicatedView?: boolean;
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({
  bodies,
  selectedBodyId,
  onSelectBody,
  isDedicatedView = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SolarSimulationEngine | null>(null);

  const [epochDays, setEpochDays] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [settings, setSettings] = useState<SimulationSettings>({
    isPlaying: true,
    speedMultiplier: 1.0,
    showOrbits: true,
    showLabels: true,
    showTrails: false,
    showHabitableZone: true,
    showAsteroidBelt: true,
    showKuiperBelt: true,
    showMoonOrbit: true,
    enhancedScale: true,
    gridOverlay: true,
    soundEnabled: false,
  });

  const selectedBody = getCelestialBodyById(selectedBodyId) || bodies[3];

  // Initialize Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new SolarSimulationEngine(canvas, bodies, settings);
    engineRef.current = engine;

    engine.onTargetSelect = (bodyId) => {
      if (bodyId) {
        onSelectBody(bodyId);
        engine.focusBody(bodyId);
      }
    };

    engine.onEpochUpdate = (days) => {
      setEpochDays(days);
    };

    engine.start();

    const handleWindowResize = () => {
      engine.handleResize();
    };
    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [bodies]);

  // Sync settings with engine
  const handleUpdateSettings = useCallback((newSettings: Partial<SimulationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (engineRef.current) {
        engineRef.current.updateSettings(updated);
      }
      return updated;
    });
  }, []);

  // Center / Focus Body
  const handleFocusSelected = useCallback(() => {
    if (engineRef.current && selectedBodyId) {
      engineRef.current.focusBody(selectedBodyId);
    }
  }, [selectedBodyId]);

  // Select body handler
  const handleSelectBody = useCallback((id: string) => {
    onSelectBody(id);
    if (engineRef.current) {
      engineRef.current.focusBody(id);
    }
  }, [onSelectBody]);

  // Camera Actions
  const handleResetView = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetView();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.zoomIn();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.zoomOut();
    }
  }, []);

  // Fullscreen Handler
  const handleToggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (engineRef.current) {
        setTimeout(() => engineRef.current?.handleResize(), 100);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <section
      id="simulation"
      ref={containerRef}
      className={`relative w-full bg-gray-950 border-y border-gray-800/80 overflow-hidden select-none ${
        isDedicatedView
          ? 'h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]'
          : 'h-[75vh] sm:h-[82vh] lg:h-[88vh]'
      }`}
      aria-label="Interactive Solar System Simulation"
    >
      {/* HTML5 Canvas Surface */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Real-time Telemetry HUD (Desktop & Tablet) */}
      <TelemetryHUD
        selectedBody={selectedBody}
        epochDays={epochDays}
        speedMultiplier={settings.speedMultiplier}
        isPlaying={settings.isPlaying}
        onInspectDetails={() => setIsDetailModalOpen(true)}
      />

      {/* Desktop Simulation Control Deck */}
      <DesktopControls
        settings={settings}
        bodies={bodies}
        selectedBodyId={selectedBodyId}
        onUpdateSettings={handleUpdateSettings}
        onSelectBody={handleSelectBody}
        onResetView={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFocusSelected={handleFocusSelected}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Mobile Touch Control Dock (Compact & Screen Contained) */}
      <MobileControls
        settings={settings}
        bodies={bodies}
        selectedBody={selectedBody}
        onUpdateSettings={handleUpdateSettings}
        onSelectBody={handleSelectBody}
        onResetView={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFocusSelected={handleFocusSelected}
        onOpenDetails={() => setIsDetailModalOpen(true)}
      />

      {/* Comprehensive Planet Detail Modal / Drawer */}
      <PlanetDetailModal
        body={selectedBody}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onFocusInSimulation={handleFocusSelected}
      />
    </section>
  );
};
