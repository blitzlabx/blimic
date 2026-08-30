export interface FieldGuideArticle {
  id: string;
  category: 'rocky-worlds' | 'gas-giants' | 'ice-giants' | 'dwarf-planets' | 'orbital-mechanics' | 'solar-physics';
  categoryLabel: string;
  title: string;
  subtitle: string;
  readingTimeMinutes: number;
  summary: string;
  tags: string[];
  sections: {
    heading: string;
    content: string;
  }[];
  keyTakeaways: string[];
}

export const FIELD_GUIDE_ARTICLES: FieldGuideArticle[] = [
  {
    id: 'orbital-mechanics-kepler',
    category: 'orbital-mechanics',
    categoryLabel: 'Orbital Mechanics',
    title: 'Keplerian Orbits and Planetary Motion',
    subtitle: 'How three mathematical laws govern every orbit in the Solar System',
    readingTimeMinutes: 6,
    summary: 'Johannes Kepler formulated the three fundamental laws of planetary motion between 1609 and 1619, transforming our geometric understanding of celestial gravity before Isaac Newton formulated universal gravitation.',
    tags: ['Kepler Laws', 'Eccentricity', 'Orbital Velocity', 'Gravitation'],
    sections: [
      {
        heading: 'Law 1: The Law of Ellipses',
        content: 'Every planet moves along an elliptical orbit with the Sun situated at one of the two foci. The degree of stretching is measured by eccentricity (e). While Earth orbit is nearly circular (e = 0.0167), Mercury (e = 0.2056) and Pluto (e = 0.2488) trace noticeably elongated ellipses.',
      },
      {
        heading: 'Law 2: The Law of Equal Areas',
        content: 'A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time. Consequently, planets accelerate as they approach perihelion (closest distance) and decelerate as they climb toward aphelion (farthest distance).',
      },
      {
        heading: 'Law 3: The Harmonic Law (Harmonies of the World)',
        content: 'The square of the orbital period (P) of a planet is directly proportional to the cube of the semi-major axis (a) of its orbit (P^2 = a^3 when P is in Earth years and a is in astronomical units). This mathematical relation dictates why inner worlds like Mercury complete years in 88 days while distant Neptune requires nearly 165 Earth years.',
      },
    ],
    keyTakeaways: [
      'Orbits are elliptical, not perfect circles.',
      'Planetary speed is dynamic, peaking at closest solar approach.',
      'Orbital duration scales exponentially with solar distance according to P^2 = a^3.',
    ],
  },
  {
    id: 'planetary-atmospheres',
    category: 'rocky-worlds',
    categoryLabel: 'Planetary Science',
    title: 'Comparative Atmospheres: From Vacuum to Supercritical Fluids',
    subtitle: 'Why Mercury has almost no air while Venus crushes titanium landers',
    readingTimeMinutes: 7,
    summary: 'Atmospheric evolution across the Solar System is dictated by escape velocity, surface gravity, solar irradiance, and core magnetospheres.',
    tags: ['Atmospheres', 'Greenhouse Effect', 'Magnetospheres', 'Volatiles'],
    sections: [
      {
        heading: 'Thermal Escape and Jeans Parameter',
        content: 'Whether a planet retains an atmosphere depends on its surface escape velocity relative to the average thermal speed of gas molecules. Light gases like hydrogen and helium escape rapidly from small, warm terrestrial planets but are permanently bound to massive cold gas giants.',
      },
      {
        heading: 'The Runaway Greenhouse: Venus vs Earth',
        content: 'Early Venus and Earth likely possessed comparable volatile inventories. However, Venus closer solar distance triggered ocean evaporation; water vapor acted as a potent greenhouse gas, elevating temperatures until crustal carbonates baked out into dense atmospheric CO2, creating a permanent 92-bar furnace.',
      },
      {
        heading: 'Atmospheric Stripping and Magnetospheres',
        content: 'Earth geodynamo creates a robust magnetosphere that deflects solar wind particles. Mars, having lost its core dynamo ~4 billion years ago, suffered direct ion sputtering that stripped away more than 90% of its early dense atmosphere.',
      },
    ],
    keyTakeaways: [
      'Atmospheric retention is a balance between gravity and thermal molecular velocity.',
      'Magnetospheres are essential shields preventing solar wind sputtering.',
      'Venus demonstrates the catastrophic endpoint of unchecked greenhouse runaway.',
    ],
  },
  {
    id: 'gas-and-ice-giants',
    category: 'gas-giants',
    categoryLabel: 'Giant Planets',
    title: 'The Great Architectural Divide: Gas Giants vs Ice Giants',
    subtitle: 'Why Jupiter and Saturn differ fundamentally from Uranus and Neptune',
    readingTimeMinutes: 5,
    summary: 'While historically grouped together as Jovian planets, modern astrophysics distinguishes true Gas Giants from Ice Giants based on internal composition and condensation temperatures during early planetary accretion.',
    tags: ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Metallic Hydrogen'],
    sections: [
      {
        heading: 'Gas Giants: Pure Hydrogen-Helium Envelopes',
        content: 'Jupiter and Saturn accumulated enormous gaseous envelopes directly from the solar nebula before it dissipated. Below their cloudy upper layers, pressures exceed millions of atmospheres, forcing hydrogen into an electrically conductive liquid metallic state that generates colossal magnetic dynamos.',
      },
      {
        heading: 'Ice Giants: Volatile Mantles and Extreme Tilts',
        content: 'Uranus and Neptune accreted later or in thinner peripheral regions of the proto-planetary disk. Over 65% of their mass consists of supercritical fluid ices (water, ammonia, and methane) rather than pure metallic hydrogen. Their magnetic fields are oddly tilted and offset from their cores.',
      },
      {
        heading: 'Planetary Rings and Roche Limits',
        content: 'All four giant planets possess ring systems. When comets or icy moons stray within the Roche limit (where tidal gravitational shear exceeds the body internal self-gravity), they are pulverized into orbiting debris sheets like Saturn iconic rings.',
      },
    ],
    keyTakeaways: [
      'Gas giants are dominated by metallic hydrogen; ice giants by water-ammonia-methane mantle soups.',
      'Metallic hydrogen acts as a conductive quantum fluid generating extreme planetary magnetic dynamos.',
      'Planetary rings represent remnants of shattered moons pulverized within the Roche limit.',
    ],
  },
  {
    id: 'kuiper-belt-and-pluto',
    category: 'dwarf-planets',
    categoryLabel: 'Outer Frontiers',
    title: 'The Kuiper Belt and Pluto Dynamic Landscape',
    subtitle: 'The discovery of the third cosmic zone and the 9th world geology',
    readingTimeMinutes: 6,
    summary: 'Beyond the orbit of Neptune lies the Kuiper Belt, a vast circumstellar disc of primordial icy planetesimals, cometary cores, and dwarf planets including Pluto.',
    tags: ['Pluto', 'Kuiper Belt', 'New Horizons', 'Cryovolcanism'],
    sections: [
      {
        heading: 'The Architecture of the Outer Realm',
        content: 'Extending from 30 AU (Neptune orbit) to approximately 55 AU, the Kuiper Belt represents the frozen remnants of the solar nebula. Thousands of worlds orbit in this frozen twilight, many locked into mean-motion resonances with Neptune.',
      },
      {
        heading: 'Pluto as a Geologically Vibrant World',
        content: 'When New Horizons arrived at Pluto in July 2015, it overturned the assumption that distant icy bodies are dead. Instead, Pluto revealed active nitrogen glaciers churning in convective cells (Sputnik Planitia), cryovolcanoes like Wright Mons, and floating water-ice mountains.',
      },
      {
        heading: 'Binary Dynamics: The Pluto-Charon System',
        content: 'Pluto and Charon form a true double planet: their center of mass (barycenter) lies outside Pluto surface in open space. Both bodies are mutually tidally locked, facing one another indefinitely like synchronized orbital dancers.',
      },
    ],
    keyTakeaways: [
      'The Kuiper Belt represents a third planetary realm preserving pristine solar nebula chemistry.',
      'Pluto maintains active geology powered by volatile nitrogen, methane, and carbon monoxide ice cycles.',
      'Pluto and Charon orbit a common barycenter situated outside Pluto surface.',
    ],
  },
  {
    id: 'solar-engine-fusion',
    category: 'solar-physics',
    categoryLabel: 'Solar Physics',
    title: 'The Solar Engine: Thermonuclear Fusion and the Heliosphere',
    subtitle: 'How 600 million tons of hydrogen fusion per second shapes interplanetary space',
    readingTimeMinutes: 5,
    summary: 'The Sun core reaches 15 million Kelvin, driving proton-proton chain fusion that radiates light, drives the solar wind, and inflates the protective heliosphere.',
    tags: ['Sun', 'Fusion', 'Solar Wind', 'Heliosphere', 'Space Weather'],
    sections: [
      {
        heading: 'Proton-Proton Chain Reaction',
        content: 'In the core of the Sun, gravitational confinement fuses 600 million tons of hydrogen into helium every second. A fraction (0.7%) of mass converts directly into energy via E = mc^2, releasing high-energy gamma rays that slowly diffuse outward through the radiative zone.',
      },
      {
        heading: 'The 11-Year Solar Magnetic Cycle',
        content: 'Differential rotation (equator spinning faster than poles) twists the Sun magnetic flux lines like rubber bands. When these lines snap and reconnect, they produce solar flares, coronal mass ejections, and geomagnetic storms on Earth.',
      },
      {
        heading: 'The Heliosphere Boundary',
        content: 'The solar wind blows supersonic plasma out past 120 AU, creating the termination shock and heliopause where solar influence yields to the interstellar medium.',
      },
    ],
    keyTakeaways: [
      'The Sun converts 4.26 million metric tons of mass into pure energy every second.',
      'Solar magnetic cycles dictate space weather and satellite operational security.',
      'The heliosphere shields the entire Solar System from destructive interstellar cosmic rays.',
    ],
  },
];
