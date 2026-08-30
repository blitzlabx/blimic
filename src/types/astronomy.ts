export type CelestialType = 
  | 'star'
  | 'rocky-planet'
  | 'gas-giant'
  | 'ice-giant'
  | 'dwarf-planet'
  | 'moon';

export interface AtmosphereGas {
  name: string;
  symbol: string;
  percentage: number;
  color: string;
}

export interface SpaceMission {
  name: string;
  agency: string;
  year: number;
  type: 'flyby' | 'orbiter' | 'lander' | 'rover' | 'sample-return';
  significance: string;
}

export interface CelestialBodyData {
  id: string;
  name: string;
  subtitle: string;
  type: CelestialType;
  typeLabel: string;
  orderFromSun: number; // 0 for Sun, 1 for Mercury, ..., 9 for Pluto, -1 for Moon
  color: string;
  accentColor: string;
  secondaryColor?: string;
  
  // Visual Simulation Scales (scaled for optimal visual clarity)
  simRadius: number; // in simulation units
  simOrbitRadius: number; // in simulation units
  simOrbitSpeed: number; // relative angular velocity multiplier
  simRotationPeriod: number; // hours (negative for retrograde)
  axialTilt: number; // degrees
  eccentricity: number; // orbital eccentricity
  inclination: number; // orbital inclination degrees
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  ringTextureAlpha?: number;

  // Real Astronomical Metrics
  physical: {
    meanRadiusKm: number;
    equatorialDiameterKm: number;
    massKg: number;
    massEarths: number;
    volumeEarths: number;
    meanDensityGcm3: number;
    surfaceGravityMs2: number;
    surfaceGravityG: number;
    escapeVelocityKms: number;
    flattening: number;
  };
  
  orbital: {
    semiMajorAxisAu: number;
    semiMajorAxisKm: number;
    perihelionAu: number;
    aphelionAu: number;
    orbitalPeriodDays: number;
    orbitalPeriodYears: number;
    averageOrbitalSpeedKms: number;
    synodicPeriodDays?: number;
  };

  rotational: {
    siderealRotationPeriodHours: number;
    lengthOfDayHours: number;
    axialTiltDeg: number;
    rotationDirection: 'prograde' | 'retrograde';
  };

  thermal: {
    minTempC: number;
    meanTempC: number;
    maxTempC: number;
    minTempK: number;
    meanTempK: number;
    maxTempK: number;
  };

  atmosphere: {
    hasAtmosphere: boolean;
    surfacePressureBar: number;
    description: string;
    majorGases: AtmosphereGas[];
  };

  moons: {
    count: number;
    notableMoons: string[];
    description: string;
  };

  summary: string;
  overview: string;
  geologyAndSurface: string;
  internalStructure: string;
  magneticFieldAndRadiation: string;
  explorationHistory: SpaceMission[];
  keyFacts: string[];
  
  // Specific to Earth
  earthSpecial?: {
    biosphereDescription: string;
    magnetosphereDetails: string;
    waterCoveragePercentage: number;
    lunarInteraction: string;
    humanObservationStatus: string;
  };

  // Specific to Sun
  sunSpecial?: {
    spectralType: string;
    coreTemperatureC: number;
    surfaceTemperatureC: number;
    luminosityWatts: number;
    ageBillionYears: number;
    solarCycleYears: number;
    layers: string[];
  };
}

export type WorldSortOption = 
  | 'order'
  | 'name'
  | 'diameter'
  | 'distance'
  | 'orbitalPeriod'
  | 'gravity'
  | 'moons';

export type WorldFilterType = 
  | 'all'
  | 'rocky'
  | 'gas-giant'
  | 'ice-giant'
  | 'dwarf'
  | 'star-moon';
