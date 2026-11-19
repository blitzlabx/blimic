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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-subtle px-2 py-1.5 flex items-center justify-around select-none"
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
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-sm transition-colors ${
              isActive
                ? 'text-emerald-400 font-bold'
                : isSpaceship
                ? 'text-emerald-300'
                : 'text-secondary active:text-primary'
            }`}
          >
            <div
              className={`p-1 rounded-sm transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : isSpaceship
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
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