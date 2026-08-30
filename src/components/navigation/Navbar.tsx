import React, { useState, useEffect } from 'react';
import { Compass, Orbit, Globe, BookOpen, Layers, Menu, X, Rocket, Sparkles } from 'lucide-react';
import { formatSimulationEpoch } from '../../lib/astronomy/calculations';

export type AppRoute = 'overview' | 'simulation' | 'spaceship' | 'worlds' | 'physics' | 'field-guide' | 'about';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigateRoute: (route: AppRoute) => void;
  epochDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigateRoute,
  epochDays,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const epoch = formatSimulationEpoch(epochDays);

  const navLinks: { id: AppRoute; label: string; icon: React.ComponentType<{ className?: string }>; highlight?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: Orbit },
    { id: 'simulation', label: 'Solar Sim', icon: Orbit },
    { id: 'spaceship', label: 'Spaceship Pilot', icon: Rocket, highlight: true },
    { id: 'worlds', label: 'Worlds', icon: Globe },
    { id: 'physics', label: 'Scale & Physics', icon: Layers },
    { id: 'field-guide', label: 'Field Guide', icon: BookOpen },
    { id: 'about', label: 'About Blitz', icon: Compass },
  ];

  const handleLinkClick = (route: AppRoute) => {
    onNavigateRoute(route);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-gray-950/90 backdrop-blur-md border-b border-gray-800/80 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-gray-950/95 via-gray-950/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1 -m-1"
              aria-label="blimic by Blitz Home"
            >
              {/* Minimal SVG Orbit Mark */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-900 border border-gray-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/60 transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="3" className="fill-cyan-400/20" />
                  <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
                </svg>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                    blimic
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-400 font-mono tracking-wider">
                    by Blitz
                  </span>
                </div>
                <span className="text-[9px] text-gray-400 font-mono hidden sm:inline-block">
                  @blitzlabx
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-900/70 border border-gray-800/80 rounded-full px-3 py-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive
                      ? 'bg-gray-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : link.highlight
                      ? 'text-cyan-400 hover:text-cyan-200 hover:bg-gray-800/60'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight && !isActive ? 'text-cyan-400' : ''}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Pilot Spaceship Trigger */}
            <button
              onClick={() => handleLinkClick('spaceship')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all shadow-md ${
                currentRoute === 'spaceship'
                  ? 'bg-cyan-500 text-gray-950 border border-cyan-300'
                  : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Spaceship Pilot</span>
            </button>
          </div>

          {/* Mobile Right Bar: Quick Pilot button + Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('spaceship')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                currentRoute === 'spaceship'
                  ? 'bg-cyan-400 text-gray-950'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}
              aria-label="Spaceship Flight Simulator"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Pilot</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-950/95 border-b border-gray-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              blimic System Navigation
            </span>
            <span>{epoch.julianDate}</span>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : link.highlight
                      ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.highlight && (
                    <span className="px-2 py-0.5 rounded bg-cyan-400 text-gray-950 text-[10px] font-mono font-bold">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>blimic by Blitz</span>
            <span>@blitzlabx</span>
          </div>
        </div>
      )}
    </header>
  );
};
