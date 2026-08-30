import React, { useState, useEffect, useCallback } from 'react';
import { CELESTIAL_BODIES, getCelestialBodyById } from './data/planets';
import { Navbar, AppRoute } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { HeroSection } from './components/landing/HeroSection';
import { SimulationViewer } from './components/simulation/SimulationViewer';
import { SpaceshipSimulatorView } from './components/spaceship/SpaceshipSimulatorView';
import { WorldExplorer } from './components/planets/WorldExplorer';
import { ExperienceSection } from './components/landing/ExperienceSection';
import { FieldGuideSection } from './components/field-guide/FieldGuideSection';
import { AboutBlitzSection } from './components/about/AboutBlitzSection';
import { Footer } from './components/navigation/Footer';

export default function App() {
  const [selectedBodyId, setSelectedBodyId] = useState<string>('earth');
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('overview');
  const [epochDays, setEpochDays] = useState<number>(0);

  // Sync route with URL hash on mount & hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validRoutes: AppRoute[] = ['overview', 'simulation', 'spaceship', 'worlds', 'physics', 'field-guide', 'about'];
      if (validRoutes.includes(hash as AppRoute)) {
        setCurrentRoute(hash as AppRoute);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateRoute = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectBody = useCallback((id: string) => {
    setSelectedBodyId(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col">
      
      {/* Fixed Header Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigateRoute={handleNavigateRoute}
        epochDays={epochDays}
      />

      {/* Main Viewport Container */}
      <main
        className={`flex-1 flex flex-col pt-16 sm:pt-20 ${
          currentRoute === 'spaceship'
            ? 'pb-0 overflow-hidden'
            : currentRoute === 'simulation'
            ? 'pb-16 lg:pb-0 overflow-hidden'
            : 'pb-16 lg:pb-0'
        }`}
      >
        
        {/* Route 1: Spaceship Pilot Flight & Planetary Visit Simulator */}
        {currentRoute === 'spaceship' && (
          <SpaceshipSimulatorView
            bodies={CELESTIAL_BODIES}
            onNavigateToOverview={() => handleNavigateRoute('overview')}
            onSelectBodyForDetail={(id) => {
              setSelectedBodyId(id);
              handleNavigateRoute('worlds');
            }}
          />
        )}

        {/* Route 2: Dedicated Solar System Simulator Mode */}
        {currentRoute === 'simulation' && (
          <div className="w-full flex-1 flex flex-col">
            <SimulationViewer
              bodies={CELESTIAL_BODIES}
              selectedBodyId={selectedBodyId}
              onSelectBody={handleSelectBody}
              isDedicatedView={true}
            />
          </div>
        )}

        {/* Route 3: Dedicated World Explorer */}
        {currentRoute === 'worlds' && (
          <div className="max-w-7xl mx-auto w-full py-6">
            <WorldExplorer
              bodies={CELESTIAL_BODIES}
              selectedBodyId={selectedBodyId}
              onSelectBody={handleSelectBody}
              onNavigateToSimulation={() => handleNavigateRoute('simulation')}
            />
          </div>
        )}

        {/* Route 4: Dedicated Scale & Kepler Physics */}
        {currentRoute === 'physics' && (
          <div className="max-w-7xl mx-auto w-full py-6">
            <ExperienceSection bodies={CELESTIAL_BODIES} />
          </div>
        )}

        {/* Route 5: Dedicated Astrophysics Field Guide */}
        {currentRoute === 'field-guide' && (
          <div className="max-w-7xl mx-auto w-full py-6">
            <FieldGuideSection
              bodies={CELESTIAL_BODIES}
              onSelectBody={(id) => {
                setSelectedBodyId(id);
                handleNavigateRoute('simulation');
              }}
            />
          </div>
        )}

        {/* Route 6: About Blitz & Architecture */}
        {currentRoute === 'about' && (
          <div className="max-w-7xl mx-auto w-full py-6">
            <AboutBlitzSection />
          </div>
        )}

        {/* Route 7: Overview (Comprehensive Cosmic Gateway) */}
        {currentRoute === 'overview' && (
          <div className="flex flex-col">
            {/* 1. Hero Landing */}
            <HeroSection
              onLaunchSimulation={() => handleNavigateRoute('simulation')}
              onPilotSpaceship={() => handleNavigateRoute('spaceship')}
              onExploreWorlds={() => handleNavigateRoute('worlds')}
              onOpenFieldGuide={() => handleNavigateRoute('field-guide')}
            />

            {/* 2. Interactive Solar System Canvas Simulation */}
            <div className="border-t border-gray-800">
              <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Interactive Solar System Simulation
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Real-time Keplerian orbital model with live epoch telemetry
                  </p>
                </div>
                <button
                  onClick={() => handleNavigateRoute('simulation')}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
                >
                  Full-Screen Sim Mode →
                </button>
              </div>
              <SimulationViewer
                bodies={CELESTIAL_BODIES}
                selectedBodyId={selectedBodyId}
                onSelectBody={handleSelectBody}
                isDedicatedView={false}
              />
            </div>

            {/* 3. Deep Planetary World Explorer & Specs Grid */}
            <WorldExplorer
              bodies={CELESTIAL_BODIES}
              selectedBodyId={selectedBodyId}
              onSelectBody={handleSelectBody}
              onNavigateToSimulation={() => handleNavigateRoute('simulation')}
            />

            {/* 4. Observational Scale & Physics Playground */}
            <ExperienceSection bodies={CELESTIAL_BODIES} />

            {/* 5. Astrophysics Field Guide & Comparative Matrix */}
            <FieldGuideSection
              bodies={CELESTIAL_BODIES}
              onSelectBody={(id) => {
                setSelectedBodyId(id);
                handleNavigateRoute('simulation');
              }}
            />

            {/* 6. About Blitz & Technical Architecture */}
            <AboutBlitzSection />
          </div>
        )}

      </main>

      {/* Global Footer (shown on overview and encyclopedia views) */}
      {currentRoute !== 'spaceship' && currentRoute !== 'simulation' && (
        <Footer onNavigateSection={(secId) => {
          if (['simulation', 'worlds', 'physics', 'field-guide', 'about'].includes(secId)) {
            handleNavigateRoute(secId as AppRoute);
          } else {
            handleNavigateRoute('overview');
          }
        }} />
      )}

      {/* Mobile Bottom Navigation Bar */}
      {currentRoute !== 'spaceship' && (
        <MobileBottomNav
          currentRoute={currentRoute}
          onNavigateRoute={handleNavigateRoute}
        />
      )}

    </div>
  );
}
