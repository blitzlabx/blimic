import React from 'react';
import { FlightSettings, ControlScheme, CameraPerspective, HudStyle } from '../../types/spaceship';
import { Badge } from '../ui/Badge';
import {
  Settings,
  X,
  Sliders,
  Gamepad2,
  Gauge,
  Eye,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';

interface FlightSettingsModalProps {
  settings: FlightSettings;
  onUpdateSettings: (newSettings: Partial<FlightSettings>) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const FlightSettingsModal: React.FC<FlightSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gray-900/70 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white font-display text-base block">
                Flight Controls & Simulation Preferences
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Calibrate steering sensitivity, throttle damping, and HUD visibility
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs font-mono">
          
          {/* 1. Control Scheme Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                Mobile / Touch Control Scheme
              </span>
              <Badge variant="cyan">{settings.controlScheme.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'joystick', label: 'Analog Stick', desc: 'Omnidirectional thumbstick' },
                { id: 'dpad', label: 'Split D-Pad', desc: 'Tactile directional buttons' },
                { id: 'direct', label: 'Direct Steer', desc: 'Turn towards touch point' },
                { id: 'keyboard', label: 'PC Keys Only', desc: 'WASD & Arrow Keys' },
              ].map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => onUpdateSettings({ controlScheme: scheme.id as ControlScheme })}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    settings.controlScheme === scheme.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 hover:text-gray-200 border-gray-800'
                  }`}
                >
                  <span className="font-bold text-xs">{scheme.label}</span>
                  <span className="text-[10px] text-gray-400 leading-tight mt-1">{scheme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Speed & Throttle Multiplier */}
          <div className="space-y-2 pt-2 border-t border-gray-850">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                Ship Velocity & Throttle Sensitivity
              </span>
              <span className="text-cyan-400 font-bold">
                {(settings.speedMultiplier * 100).toFixed(0)}% Speed
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 0.45, label: 'Precision Docking', desc: '0.45x for easiest landing' },
                { val: 0.65, label: 'Balanced (Default)', desc: '0.65x smooth interplanetary' },
                { val: 1.0, label: 'Cruiser', desc: '1.0x standard rapid transit' },
                { val: 1.35, label: 'Hyperspeed', desc: '1.35x extreme velocity' },
              ].map((lvl) => (
                <button
                  key={lvl.val}
                  onClick={() => onUpdateSettings({ speedMultiplier: lvl.val })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    Math.abs(settings.speedMultiplier - lvl.val) < 0.05
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 border-gray-800'
                  }`}
                >
                  <div className="text-xs">{lvl.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Steering Sensitivity Slider */}
          <div className="space-y-2 pt-2 border-t border-gray-850">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider">
                Steering Turn Sensitivity
              </span>
              <span className="text-cyan-400 font-bold">
                {(settings.turnSensitivity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.4"
              step="0.05"
              value={settings.turnSensitivity}
              onChange={(e) => onUpdateSettings({ turnSensitivity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Gentle & Stable (0.4x)</span>
              <span>Smooth (0.8x)</span>
              <span>Twitch / Fast (1.4x)</span>
            </div>
          </div>

          {/* 4. Planetary Auto-Deceleration & Gravitational Assist */}
          <div className="p-3.5 bg-gray-900/60 border border-gray-800 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5 max-w-[78%]">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Brake In Planetary Gravity Wells</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">
                Automatically slows down the spaceship upon entering a planet's sphere of influence so you can dock with ease.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoBrakeNearPlanets: !settings.autoBrakeNearPlanets })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.autoBrakeNearPlanets ? 'bg-emerald-500' : 'bg-gray-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoBrakeNearPlanets ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Inertial Space Damping Assist */}
          <div className="space-y-2 pt-2 border-t border-gray-850">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider">
                Inertial Flight Stabilization
              </span>
              <Badge variant="neutral">{settings.spaceDamping.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'assisted', label: 'High Stability', desc: 'Auto-brakes drift when coasting' },
                { id: 'standard', label: 'Orbital Drag', desc: 'Gentle space resistance' },
                { id: 'drift', label: 'Zero-G Inertia', desc: 'Pure Newtonian drift' },
              ].map((damp) => (
                <button
                  key={damp.id}
                  onClick={() => onUpdateSettings({ spaceDamping: damp.id as 'assisted' | 'standard' | 'drift' })}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    settings.spaceDamping === damp.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 border-gray-800'
                  }`}
                >
                  <div className="text-xs">{damp.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{damp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. HUD Layout & Screen Obstruction Setting */}
          <div className="space-y-2 pt-2 border-t border-gray-850">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                HUD Layout (Unblock Screen)
              </span>
              <Badge variant="cyan">{settings.hudStyle.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Sleek Edge HUD', desc: 'Clean layout, zero center obstruction' },
                { id: 'minimal', label: 'Minimalist Tape', desc: 'Thin top bar only' },
                { id: 'hidden', label: 'Hidden (Cinematic)', desc: '100% unobstructed view' },
              ].map((hud) => (
                <button
                  key={hud.id}
                  onClick={() => onUpdateSettings({ hudStyle: hud.id as HudStyle })}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    settings.hudStyle === hud.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 border-gray-800'
                  }`}
                >
                  <div className="text-xs">{hud.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{hud.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 7. Camera Perspective */}
          <div className="space-y-2 pt-2 border-t border-gray-850">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Camera Perspective & FOV
              </span>
              <Badge variant="cyan">{settings.cameraMode.replace('_', ' ').toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'third_person', label: 'Third Person', desc: 'Standard 1.0x camera' },
                { id: 'close_chase', label: 'Close Cockpit', desc: '1.4x zoom near ship' },
                { id: 'wide_sector', label: 'Wide Sector', desc: '0.65x panoramic view' },
              ].map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => onUpdateSettings({ cameraMode: cam.id as CameraPerspective })}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    settings.cameraMode === cam.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-850 border-gray-800'
                  }`}
                >
                  <div className="text-xs">{cam.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{cam.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/80 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Recommended Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold transition-colors"
          >
            Apply & Fly
          </button>
        </div>

      </div>
    </div>
  );
};
