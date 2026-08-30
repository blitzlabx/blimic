// Astronomical Calculations & Formatter Utilities for blimic

export const SPEED_OF_LIGHT_KMS = 299792.458;
export const AU_TO_KM = 149597870.7;

/**
 * Solve Kepler's Equation for Eccentric Anomaly (E):
 * M = E - e * sin(E)
 * Uses Newton-Raphson iteration.
 */
export function solveKepler(M: number, e: number, tolerance = 1e-6): number {
  let E = M;
  for (let i = 0; i < 15; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tolerance) break;
  }
  return E;
}

/**
 * Calculate the true anomaly (nu) and orbital distance (r) from epoch days.
 */
export function calculateOrbitPosition(
  orbitRadiusSim: number,
  eccentricity: number,
  orbitPeriodDays: number,
  epochDays: number,
  initialPhase = 0
): { x: number; y: number; angle: number; currentRadius: number } {
  if (orbitRadiusSim === 0 || orbitPeriodDays === 0) {
    return { x: 0, y: 0, angle: 0, currentRadius: 0 };
  }

  // Mean anomaly M (radians)
  const meanMotion = (2 * Math.PI) / orbitPeriodDays;
  const M = (meanMotion * epochDays + initialPhase) % (2 * Math.PI);

  // Eccentric anomaly E
  const E = solveKepler(M, eccentricity);

  // True anomaly nu
  const sinNu = (Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E)) / (1 - eccentricity * Math.cos(E));
  const cosNu = (Math.cos(E) - eccentricity) / (1 - eccentricity * Math.cos(E));
  const nu = Math.atan2(sinNu, cosNu);

  // Current radius in sim units
  const currentRadius = (orbitRadiusSim * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(nu));

  const x = currentRadius * Math.cos(nu);
  const y = currentRadius * Math.sin(nu);

  return { x, y, angle: nu, currentRadius };
}

/**
 * Calculate light travel time from Sun in human readable string.
 */
export function calculateLightTravelTime(distanceKm: number): string {
  if (distanceKm <= 0) return '0.0 seconds';
  const seconds = distanceKm / SPEED_OF_LIGHT_KMS;

  if (seconds < 60) {
    return `${seconds.toFixed(1)} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSec = Math.round(seconds % 60);
  if (minutes < 60) {
    return `${minutes}m ${remainingSec}s`;
  }
  const hours = (seconds / 3600).toFixed(1);
  return `${hours} hours`;
}

/**
 * Calculate solar irradiance relative to Earth (Inverse-square law: 1 / AU^2).
 */
export function calculateSolarIrradiance(semiMajorAxisAu: number): number {
  if (semiMajorAxisAu <= 0) return 1;
  return 1 / (semiMajorAxisAu * semiMajorAxisAu);
}

/**
 * Format numbers with SI prefixes or engineering decimals.
 */
export function formatMetricNumber(num: number, decimals = 2): string {
  if (num === 0) return '0';
  if (Math.abs(num) >= 1e9) {
    return `${(num / 1e9).toFixed(decimals)} billion`;
  }
  if (Math.abs(num) >= 1e6) {
    return `${(num / 1e6).toFixed(decimals)} million`;
  }
  if (Math.abs(num) >= 1e3) {
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }
  if (Math.abs(num) < 0.01 && num !== 0) {
    return num.toExponential(decimals);
  }
  return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

/**
 * Format Julian Day or elapsed simulation date into standard format.
 */
export function formatSimulationEpoch(epochDays: number): {
  daysString: string;
  earthYears: string;
  julianDate: string;
} {
  const baseJulian = 2451545.0; // J2000.0
  const currentJulian = baseJulian + epochDays;
  const earthYears = (epochDays / 365.25).toFixed(2);
  const daysFormatted = Math.floor(epochDays).toLocaleString();

  return {
    daysString: `T+${daysFormatted} d`,
    earthYears: `${earthYears} Earth yrs`,
    julianDate: `JD ${currentJulian.toFixed(1)}`,
  };
}
