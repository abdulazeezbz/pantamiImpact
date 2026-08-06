import projectData from '../assets/project.json';

// OpenStreetMap Nominatim API Geocoding Helper
export async function fetchOSMGeocode(locationQuery) {
  try {
    if (!locationQuery) return null;

    const queryStr = locationQuery.toLowerCase().includes('gombe')
      ? locationQuery
      : `${locationQuery}, Gombe State, Nigeria`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PantamiImpactTracker/1.0',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const firstResult = data[0]; // Choose 1st result as requested
      return {
        latitude: parseFloat(firstResult.lat),
        longitude: parseFloat(firstResult.lon),
        displayName: firstResult.display_name,
      };
    }
  } catch (error) {
    console.log('OSM Geocoding fetch error:', error);
  }
  return null;
}

// Landmark Geocoding Database for Gombe State (Fallback)
const LANDMARK_COORDINATES = [
  { keys: ['kashere', 'federal university kashere'], coords: { latitude: 9.7719, longitude: 10.9576 } },
  { keys: ['kaltungo', 'tula wange', 'polytechnic kaltungo'], coords: { latitude: 9.8167, longitude: 11.3083 } },
  { keys: ['nafada', 'islamic studies nafada'], coords: { latitude: 11.0964, longitude: 11.3325 } },
  { keys: ['dukku', 'hashidu'], coords: { latitude: 10.8238, longitude: 10.7721 } },
  { keys: ['bajoga', 'polytechnic bajoga', 'fggc bajoga'], coords: { latitude: 10.8500, longitude: 11.4333 } },
  { keys: ['billiri', 'college of education billiri'], coords: { latitude: 9.8655, longitude: 11.2267 } },
  { keys: ['pantami', 'bolari', 'herwagana', 'gandu'], coords: { latitude: 10.2980, longitude: 11.1645 } },
  { keys: ['airport', 'lawanti'], coords: { latitude: 10.2650, longitude: 11.1820 } },
  { keys: ['teaching hospital', 'flossy'], coords: { latitude: 10.2915, longitude: 11.1620 } },
  { keys: ['university', 'gsu'], coords: { latitude: 10.3012, longitude: 11.1710 } },
  { keys: ['new market', 'main market'], coords: { latitude: 10.2785, longitude: 11.1550 } },
  { keys: ['fce', 'federal college of education'], coords: { latitude: 10.2942, longitude: 11.1685 } },
  { keys: ['horticultural', 'dadin kowa'], coords: { latitude: 10.3080, longitude: 11.4920 } },
  { keys: ['kolmani'], coords: { latitude: 10.1200, longitude: 10.8000 } },
  { keys: ['housing', 'western bye-pass'], coords: { latitude: 10.2750, longitude: 11.1450 } },
  { keys: ['highway', 'billiri-kaltungo'], coords: { latitude: 9.9500, longitude: 11.2000 } },
  { keys: ['deba', 'yamaltu'], coords: { latitude: 10.2100, longitude: 11.3800 } },
  { keys: ['kwami', 'malam sidi'], coords: { latitude: 10.4200, longitude: 11.2200 } },
  { keys: ['balanga', 'talasse'], coords: { latitude: 9.9600, longitude: 11.6800 } },
  { keys: ['shongom', 'boh'], coords: { latitude: 9.6800, longitude: 11.2300 } },
];

function geocodeLocation(locationStr = '', titleStr = '', explicitLat, explicitLng) {
  const loc = (locationStr + ' ' + titleStr).toLowerCase().trim();

  // If explicit non-default latitude and longitude exist, use them
  if (
    explicitLat !== undefined &&
    explicitLat !== null &&
    explicitLng !== undefined &&
    explicitLng !== null &&
    (Math.abs(explicitLat - 10.2897) > 0.001 || Math.abs(explicitLng - 11.1711) > 0.001)
  ) {
    return { latitude: Number(explicitLat), longitude: Number(explicitLng) };
  }

  // If location is generic Gombe State / Gombe, place directly at Gombe State Middle
  if (
    loc === 'gombe state' ||
    loc === 'gombe, gombe state' ||
    loc === 'gombe' ||
    loc === 'gombe state implementation framework'
  ) {
    return { latitude: 10.2897, longitude: 11.1711 };
  }

  // Search landmark database by location and title
  for (const item of LANDMARK_COORDINATES) {
    if (item.keys.some((key) => loc.includes(key))) {
      return {
        latitude: item.coords.latitude,
        longitude: item.coords.longitude,
      };
    }
  }

  // Default Gombe State Middle
  return { latitude: 10.2897, longitude: 11.1711 };
}

// Helper to format currency
export function formatCost(costNaira) {
  if (!costNaira || costNaira <= 0) return 'Cost: Undisclosed / Sponsored';
  return `Cost: ₦${Number(costNaira).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
}

// Derive category from project details
export function getCategoryForProject(project) {
  const title = (project.title || '').toLowerCase();
  const desc = (project.description || '').toLowerCase();

  if (title.includes('broadband') || desc.includes('broadband') || title.includes('fiber') || title.includes('wic') || title.includes('highway') || title.includes('estate') || title.includes('housing') || title.includes('networ') || title.includes('connectivity')) {
    return 'Infrastructure';
  }
  if (title.includes('health') || desc.includes('hospital') || desc.includes('medical') || title.includes('nnpc medical') || title.includes('outreach') || desc.includes('nursing')) {
    return 'Health Care';
  }
  if (title.includes('hub') || title.includes('digital') || title.includes('innovation') || title.includes('cbt') || title.includes('etc') || title.includes('nitda') || title.includes('ncc') || title.includes('galaxy') || title.includes('techpreneurship') || title.includes('ict') || title.includes('virtual library')) {
    return 'ICT & Innovation';
  }
  if (title.includes('university') || title.includes('college') || title.includes('school') || title.includes('polytechnic') || title.includes('learning') || title.includes('teacher') || title.includes('training') || title.includes('laptop') || title.includes('academy')) {
    return 'Education';
  }
  return 'Governance & Community';
}

// Load ALL 242 projects directly from project.json with vertical UP (North) offset for duplicate coordinates
function buildProjectsWithTopOffset() {
  const locationOccurrences = new Map();

  return (projectData.project_details || []).map((p, idx) => {
    const cat = getCategoryForProject(p);
    const baseCoords = geocodeLocation(p.location, p.title, p.latitude, p.longitude);

    // Create location key rounded to 4 decimal places
    const locKey = `${baseCoords.latitude.toFixed(4)}_${baseCoords.longitude.toFixed(4)}`;
    const count = locationOccurrences.get(locKey) || 0;
    locationOccurrences.set(locKey, count + 1);

    let finalLat = baseCoords.latitude;
    let finalLng = baseCoords.longitude;

    // Shift strictly UP (North) of the original pin by ~6 meters per overlapping pin
    if (count > 0) {
      const stepMeters = 6; // 6 meters UP per stacked item
      const offsetLatDegrees = (count * stepMeters) / 111000;
      finalLat += offsetLatDegrees;
    }

    return {
      id: String(p.project_number || idx + 1),
      project_number: p.project_number || idx + 1,
      title: p.title,
      description: p.description || 'Legacy project executed in Gombe State.',
      cost: formatCost(p.cost_naira),
      rawCost: p.cost_naira || 0,
      status: p.status || 'Completed',
      parastatal: p.parastatal || 'Federal Govt',
      year: p.year || 2022,
      location: p.location || 'Gombe State',
      notes: p.notes || null,
      coordinates: {
        latitude: Number(finalLat.toFixed(6)),
        longitude: Number(finalLng.toFixed(6)),
      },
      category: cat,
      tags: [cat, p.parastatal || 'ICT'],
    };
  });
}

export const ALL_PROJECTS = buildProjectsWithTopOffset();

// Calculate real total spend dynamically from project.json
const realTotalSpendSum = ALL_PROJECTS.reduce((sum, p) => sum + (p.rawCost || 0), 0);
const formattedRealTotalSpend = `₦${(realTotalSpendSum / 1000000000).toFixed(1)}B+`;

export const CATEGORIES = [
  'All',
  'ICT & Innovation',
  'Infrastructure',
  'Health Care',
  'Education',
  'Governance & Community',
];

export const SUMMARY_STATS = {
  totalProjects: `${ALL_PROJECTS.length}`,
  totalSpend: formattedRealTotalSpend,
  rawTotalSpendSum: realTotalSpendSum,
  startYear: '2016',
  endYear: '2023',
  timeFrame: '2016 – 2023',
  summaryText: projectData.summary,
};

export const INFO_CONTENT = {
  profile: {
    name: 'Prof. Isa Ali Ibrahim (Pantami)',
    titles: 'CON, PhD, FCIIS, FBCS, FNCS',
    role: 'Former Minister of Communications & Digital Economy',
    tenures: [
      'Director-General/CEO, NITDA (2016 – 2019)',
      'Minister of Communications & Digital Economy (2019 – 2023)',
      'Chairman, UN ITU World Summit on Information Society (WSIS 2022)',
    ],
    honor: 'Majidadin Daular Usmaniyya (Sultanate of Sokoto)',
  },
  keyMetrics: [
    { label: 'ICT GDP Contribution', value: '18.44%', subtext: 'Fastest-growing economy sector in 2020' },
    { label: 'Revenue Growth', value: '594%', subtext: 'Increase in sector revenue generation by 2022' },
    { label: 'National Projects', value: '4,366', subtext: 'Projects & programmes executed nationally' },
    { label: 'Gombe Sited Projects', value: `${ALL_PROJECTS.length}`, subtext: 'Regional hub & state legacy interventions' },
  ],
  legislativeActs: [
    'Nigeria Start-Up Act, 2022',
    'Nigeria Data Protection Act, 2023',
  ],
  zonalHeadquarters: [
    { name: 'NITDA North-East Zonal Office', cost: '₦318,169,671.00', status: 'Completed (2022)' },
    { name: 'NCC Permanent Zonal Office', cost: '₦397,182,887.92', status: 'Completed (2022)' },
    { name: 'Galaxy Backbone Zonal Office', cost: '₦408,383,229.78', status: 'Completed (2021)' },
    { name: 'NIGCOMSAT Regional Office', cost: 'Commissioned', status: 'Completed (2020)' },
  ],
};
