import React, { useState, useEffect } from 'react';
import { Compass, Orbit, Globe, BookOpen, Layers, Menu, X, Rocket } from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-150 ${
        isScrolled
          ? 'bg-canvas/95 backdrop-blur-md border-b border-subtle'
          : 'bg-canvas/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('overview')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 rounded p-1 -m-1"
              aria-label="blimic by Blitz Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-surface border border-subtle flex items-center justify-center text-emerald-400 group-hover:border-hover transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="3" className="fill-emerald-400/20" />
                  <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-primary font-display">
                    blimic
                  </span>
                  <span className="text-[11px] sm:text-xs text-secondary font-mono tracking-wider">
                    by Blitz
                  </span>
                </div>
                <span className="text-[9px] text-muted font-mono hidden sm:inline-block">
                  @blitzlabx
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface/70 border border-subtle rounded-sm px-2 py-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                    isActive
                      ? 'bg-surface-elevated text-emerald-300 border border-emerald-500/40'
                      : link.highlight
                      ? 'text-emerald-400 hover:text-emerald-200 hover:bg-surface'
                      : 'text-secondary hover:text-primary hover:bg-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.highlight && !isActive ? 'text-emerald-400' : ''}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleLinkClick('spaceship')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-bold tracking-wide transition-colors ${
                currentRoute === 'spaceship'
                  ? 'bg-emerald-500 text-canvas border border-emerald-300'
                  : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors ${
                currentRoute === 'spaceship'
                  ? 'bg-emerald-400 text-canvas'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
              }`}
              aria-label="Spaceship Flight Simulator"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Pilot</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm bg-surface border border-subtle text-secondary hover:text-primary"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-canvas/95 border-b border-subtle px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-subtle text-xs font-mono text-secondary">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
                  className={`flex items-center justify-between w-full px-3 py-3 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
                      : link.highlight
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
                      : 'text-secondary hover:bg-surface hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.highlight && (
                    <span className="px-2 py-0.5 rounded-sm bg-emerald-400 text-canvas text-[10px] font-mono font-bold">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs text-secondary font-mono">
            <span>blimic by Blitz</span>
            <span>@blitzlabx</span>
          </div>
        </div>
      )}
    </header>
  );
};