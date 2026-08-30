import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CelestialBodyData } from '../../types/astronomy';
import {
  SpaceshipState,
  RadarContact,
  FlightMode,
  FlightSettings,
} from '../../types/spaceship';
import { SpaceshipEngine, DEFAULT_FLIGHT_SETTINGS } from '../../lib/spaceship/SpaceshipEngine';
import { FlightControlsHUD } from './FlightControlsHUD';
import { MobileFlightControls } from './MobileFlightControls';
import { PlanetarySurfaceTerminal } from './PlanetarySurfaceTerminal';
import { TacticalSystemMap } from './TacticalSystemMap';
import { FlightSettingsModal } from './FlightSettingsModal';
import { PlanetDetailModal } from '../simulation/PlanetDetailModal';
import { Badge } from '../ui/Badge';
import {
  Compass,
  X,
  Maximize2,
  Minimize2,
  Map,
  Sliders,
  Zap,
} from 'lucide-react';

interface SpaceshipSimulatorViewProps {
  bodies: CelestialBodyData[];
  onNavigateToOverview?: () => void;
  onSelectBodyForDetail?: (id: string) => void;
}

export const SpaceshipSimulatorView: React.FC<SpaceshipSimulatorViewProps> = ({
  bodies,
  onNavigateToOverview,
  onSelectBodyForDetail,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<SpaceshipEngine | null>(null);

  const [shipState, setShipState] = useState<SpaceshipState | null>(null);
  const [radarContacts, setRadarContacts] = useState<RadarContact[]>([]);
  const [flightSettings, setFlightSettings] = useState<FlightSettings>(() => {
    try {
      const saved = localStorage.getItem('blimic_flight_settings');
      if (saved) return { ...DEFAULT_FLIGHT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      // fallback
    }
    return DEFAULT_FLIGHT_SETTINGS;
  });

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [detailModalBodyId, setDetailModalBodyId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Canvas & Spaceship Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new SpaceshipEngine(canvas, bodies, flightSettings);
    engineRef.current = engine;

    engine.onStateUpdate = (ship, contacts) => {
      setShipState({ ...ship });
      setRadarContacts([...contacts]);
    };

    engine.start();

    const handleResize = () => {
      engine.handleResize();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Desktop Keyboard Controller
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        engine.setThrust(true);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        engine.setReverse(true);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        engine.setTurningLeft(true);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        engine.setTurningRight(true);
      } else if (e.key === 'n' || e.key === 'N') {
        engine.setNitro(true);
      } else if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') {
        engine.adjustZoom(0.2);
      } else if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') {
        engine.adjustZoom(-0.2);
      } else if (e.key === '0' || e.code === 'Numpad0') {
        engine.resetZoom();
      } else if (e.code === 'Space') {
        if (engine.ship.flightMode === 'landed') {
          engine.leavePlanetOrbit();
        } else {
          engine.setBoosting(true);
        }
      } else if (e.key === 'Shift') {
        engine.setWarping(true);
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        if (engine.ship.flightMode === 'interplanetary') {
          engine.enterPlanetOrbit();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (engine.ship.flightMode === 'landed') {
          engine.leavePlanetOrbit();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMapModalOpen((prev) => !prev);
      } else if (e.key === 'o' || e.key === 'O') {
        setIsSettingsModalOpen((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsTargetModalOpen((prev) => !prev);
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'b' || e.key === 'B') {
        engine.emergencyFullStop();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        engine.setThrust(false);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        engine.setReverse(false);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        engine.setTurningLeft(false);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        engine.setTurningRight(false);
      } else if (e.key === 'n' || e.key === 'N') {
        engine.setNitro(false);
      } else if (e.code === 'Space') {
        engine.setBoosting(false);
      } else if (e.key === 'Shift') {
        engine.setWarping(false);
      }
    };

    // Zoom via mouse wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      engine.adjustZoom(delta);
    };

    // Mobile Pinch-to-Zoom Touch Gestures
    let initialPinchDist: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist !== null) {
        e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (currentDist - initialPinchDist) / initialPinchDist;
        if (Math.abs(factor) > 0.03) {
          engine.adjustZoom(factor * 0.4);
          initialPinchDist = currentDist;
        }
      }
    };

    const handleTouchEnd = () => {
      initialPinchDist = null;
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      engine.destroy();
      engineRef.current = null;
    };
  }, [bodies]);

  // Update Settings
  const handleUpdateSettings = useCallback((newSettings: Partial<FlightSettings>) => {
    setFlightSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('blimic_flight_settings', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      if (engineRef.current) {
        engineRef.current.updateSettings(newSettings);
      }
      return updated;
    });
  }, []);

  const handleResetSettings = useCallback(() => {
    setFlightSettings(DEFAULT_FLIGHT_SETTINGS);
    try {
      localStorage.setItem('blimic_flight_settings', JSON.stringify(DEFAULT_FLIGHT_SETTINGS));
    } catch (e) {
      // ignore
    }
    if (engineRef.current) {
      engineRef.current.updateSettings(DEFAULT_FLIGHT_SETTINGS);
    }
  }, []);

  // Teleportation Handlers
  const handleTeleportToBody = useCallback((bodyId: string) => {
    if (engineRef.current) {
      engineRef.current.teleportToBody(bodyId);
    }
  }, []);

  const handleTeleportToCoords = useCallback((x: number, y: number, name: string) => {
    if (engineRef.current) {
      engineRef.current.initiateQuantumTeleport(x, y, name);
    }
  }, []);

  const handleEmergencyStop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.emergencyFullStop();
    }
  }, []);

  // Actions
  const handleSelectTarget = useCallback((bodyId: string) => {
    if (engineRef.current) {
      engineRef.current.setTargetPlanet(bodyId);
      setIsTargetModalOpen(false);
    }
  }, []);

  const handleToggleAutopilot = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleAutopilot();
    }
  }, []);

  const handleToggleWarp = useCallback(() => {
    if (engineRef.current) {
      const isCurrentlyWarping = engineRef.current.ship.isWarping;
      engineRef.current.setWarping(!isCurrentlyWarping);
    }
  }, []);

  const handleEnterOrbit = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.enterPlanetOrbit();
    }
  }, []);

  const handleLeaveOrbit = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.leavePlanetOrbit();
    }
  }, []);

  const handleConductSurvey = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.conductSurfaceSurvey();
    }
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        isFullscreen
          ? 'h-screen'
          : 'h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)]'
      } bg-gray-950 overflow-hidden select-none`}
    >
      {/* Flight Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {/* Teleportation / Hyperspace Warp Overlay Indicator */}
      {shipState?.teleport.isTeleporting && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-purple-950/20 backdrop-blur-[1px]">
          <div className="bg-gray-950/90 border border-purple-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-purple-300 font-bold font-mono text-sm sm:text-base">
              <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />
              <span>QUANTUM WARP TRANSIT // {shipState.teleport.targetBodyName.toUpperCase()}</span>
            </div>
            <div className="w-48 sm:w-64 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-purple-500/40">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-75"
                style={{ width: `${Math.min(100, shipState.teleport.progress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              RELATIVISTIC TUNNEL CONVERGENCE: {Math.round(shipState.teleport.progress * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Desktop HUD Telemetry Instruments & Radar */}
      {shipState && (
        <FlightControlsHUD
          ship={shipState}
          bodies={bodies}
          radarContacts={radarContacts}
          settings={flightSettings}
          onSelectTarget={handleSelectTarget}
          onToggleAutopilot={handleToggleAutopilot}
          onToggleWarp={handleToggleWarp}
          onEnterOrbit={handleEnterOrbit}
          onEmergencyStop={handleEmergencyStop}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onZoomIn={() => engineRef.current?.adjustZoom(0.25)}
          onZoomOut={() => engineRef.current?.adjustZoom(-0.25)}
          onResetZoom={() => engineRef.current?.resetZoom()}
        />
      )}

      {/* Mobile Touch Flight Controls */}
      {shipState && shipState.flightMode !== 'landed' && (
        <MobileFlightControls
          ship={shipState}
          settings={flightSettings}
          onThrust={(active) => engineRef.current?.setThrust(active)}
          onReverse={(active) => engineRef.current?.setReverse(active)}
          onTurnLeft={(active) => engineRef.current?.setTurningLeft(active)}
          onTurnRight={(active) => engineRef.current?.setTurningRight(active)}
          onNitro={(active) => engineRef.current?.setNitro(active)}
          onJoystickMove={(x, y) => engineRef.current?.setSteeringJoystick(x, y)}
          onEmergencyStop={handleEmergencyStop}
          onToggleWarp={handleToggleWarp}
          onToggleAutopilot={handleToggleAutopilot}
          onEnterOrbit={handleEnterOrbit}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          onOpenMapModal={() => setIsMapModalOpen(true)}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onZoomIn={() => engineRef.current?.adjustZoom(0.25)}
          onZoomOut={() => engineRef.current?.adjustZoom(-0.25)}
          onResetZoom={() => engineRef.current?.resetZoom()}
        />
      )}

      {/* Planetary Surface & Orbital Landing Command Terminal */}
      {shipState && shipState.flightMode === 'landed' && shipState.currentOrbitBody && (
        <PlanetarySurfaceTerminal
          body={shipState.currentOrbitBody}
          fuel={shipState.fuel}
          shields={shipState.shields}
          samplesCollected={shipState.collectedSamples}
          surveyComplete={shipState.surfaceSurveyComplete}
          onConductSurvey={handleConductSurvey}
          onLeaveOrbit={handleLeaveOrbit}
          onOpenDetailsModal={() => {
            if (shipState.currentOrbitBody) {
              setDetailModalBodyId(shipState.currentOrbitBody.id);
            }
          }}
        />
      )}

      {/* Complete Planetary Scientific Dossier Modal */}
      {detailModalBodyId && (
        <PlanetDetailModal
          bodyId={detailModalBodyId}
          bodies={bodies}
          isOpen={true}
          onClose={() => setDetailModalBodyId(null)}
          onFocusInSimulation={(bodyId) => {
            setDetailModalBodyId(null);
            if (onSelectBodyForDetail) {
              onSelectBodyForDetail(bodyId);
            }
          }}
        />
      )}

      {/* Tactical System Map Modal (Quantum Teleportation) */}
      {isMapModalOpen && shipState && (
        <TacticalSystemMap
          bodies={bodies}
          ship={shipState}
          onTeleportToBody={handleTeleportToBody}
          onTeleportToCoords={handleTeleportToCoords}
          onClose={() => setIsMapModalOpen(false)}
        />
      )}

      {/* Flight Settings Modal */}
      {isSettingsModalOpen && (
        <FlightSettingsModal
          settings={flightSettings}
          onUpdateSettings={handleUpdateSettings}
          onResetDefaults={handleResetSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Target Planet Navigation Computer Modal */}
      {isTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="p-4 sm:p-5 bg-gray-900/60 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white font-display text-base">
                  Navigation Computer // Target World
                </span>
              </div>
              <button
                onClick={() => setIsTargetModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              <p className="text-xs text-gray-400 font-mono pb-2">
                Select a celestial destination to calibrate the ship's navigation computer and autopilot warp trajectory:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bodies.map((body) => {
                  const isCurrentTarget = shipState?.targetBody?.id === body.id;
                  return (
                    <button
                      key={body.id}
                      onClick={() => handleSelectTarget(body.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isCurrentTarget
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                          : 'bg-gray-900 text-gray-300 hover:bg-gray-850 hover:text-white border-gray-800'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: body.color }}
                      />
                      <div className="truncate">
                        <span className="font-bold text-sm block font-display truncate">
                          {body.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block truncate">
                          {body.typeLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-gray-900/60 border-t border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Kepler-X Nav Computer</span>
              <button
                onClick={() => setIsTargetModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Fullscreen / Map Quick Button */}
      <button
        onClick={toggleFullscreen}
        className="hidden md:flex items-center justify-center absolute bottom-4 right-4 z-20 w-8 h-8 rounded-lg bg-gray-950/80 hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors backdrop-blur-md"
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

    </div>
  );
};
