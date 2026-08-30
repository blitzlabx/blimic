import React from 'react';
import { Orbit, Rocket, Globe, BookOpen, Layers } from 'lucide-react';
import { AppRoute } from './Navbar';

interface MobileBottomNavProps {
  currentRoute: AppRoute;
  onNavigateRoute: (route: AppRoute) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigateRoute,
}) => {
  const items: { id: AppRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Home', icon: Orbit },
    { id: 'simulation', label: 'Solar Sim', icon: Orbit },
    { id: 'spaceship', label: 'Pilot', icon: Rocket },
    { id: 'worlds', label: 'Worlds', icon: Globe },
    { id: 'field-guide', label: 'Guide', icon: BookOpen },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-lg border-t border-gray-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom select-none"
      aria-label="Mobile Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.id;
        const isSpaceship = item.id === 'spaceship';

        return (
          <button
            key={item.id}
            onClick={() => onNavigateRoute(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-400 font-bold'
                : isSpaceship
                ? 'text-cyan-300'
                : 'text-gray-400 active:text-gray-200'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : isSpaceship
                  ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                  : ''
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono mt-0.5 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
