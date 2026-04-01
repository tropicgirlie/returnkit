/**
 * Dublin & surrounding area definitions for crèche directory.
 *
 * Each area has:
 *  - label: display name shown to users
 *  - districts: Dublin postal district numbers included (for admin reference)
 *  - examples: well-known neighbourhood names
 *  - centre: approximate lat/lng for geolocation matching
 */

export interface AreaDefinition {
  id: string;
  label: string;
  districts: string[];
  examples: string[];
  centre: { lat: number; lng: number };
}

export const AREAS: AreaDefinition[] = [
  {
    id: 'central',
    label: 'City Centre',
    districts: ['D1', 'D2', 'D4 (part)', 'D7 (part)', 'D8 (part)'],
    examples: ['D1', 'D2', 'Temple Bar', 'Smithfield', 'Portobello'],
    centre: { lat: 53.349, lng: -6.263 },
  },
  {
    id: 'inner-south',
    label: 'Inner South Dublin',
    districts: ['D4', 'D6', 'D6W', 'D8', 'D14'],
    examples: ['Ranelagh', 'Rathmines', 'Ballsbridge', 'Rathgar', 'Dundrum', 'Donnybrook'],
    centre: { lat: 53.322, lng: -6.262 },
  },
  {
    id: 'inner-north',
    label: 'Inner North Dublin',
    districts: ['D3', 'D5', 'D7', 'D9', 'D11', 'D13'],
    examples: ['Drumcondra', 'Glasnevin', 'Raheny', 'Clontarf', 'Phibsboro', 'Artane'],
    centre: { lat: 53.371, lng: -6.245 },
  },
  {
    id: 'west-suburbs',
    label: 'West Dublin',
    districts: ['D15', 'D20', 'D22', 'D24'],
    examples: ['Blanchardstown', 'Lucan', 'Clondalkin', 'Palmerstown', 'Tallaght', 'Adamstown'],
    centre: { lat: 53.33, lng: -6.39 },
  },
  {
    id: 'coastal-commuter',
    label: 'Coastal & Commuter',
    districts: [],
    examples: ['Malahide', 'Howth', 'Swords', 'Dún Laoghaire', 'Dalkey', 'Bray', 'Greystones'],
    centre: { lat: 53.36, lng: -6.13 },
  },
  {
    id: 'kildare',
    label: 'Kildare',
    districts: [],
    examples: ['Naas', 'Celbridge', 'Maynooth', 'Leixlip', 'Newbridge'],
    centre: { lat: 53.22, lng: -6.67 },
  },
  {
    id: 'meath',
    label: 'Meath',
    districts: [],
    examples: ['Navan', 'Ashbourne', 'Dunshaughlin', 'Ratoath', 'Trim'],
    centre: { lat: 53.55, lng: -6.68 },
  },
  {
    id: 'wicklow',
    label: 'Wicklow',
    districts: [],
    examples: ['Bray', 'Greystones', 'Wicklow Town', 'Arklow', 'Blessington'],
    centre: { lat: 53.14, lng: -6.10 },
  },
];

/** Flat list of area labels for dropdowns */
export const AREA_LABELS = AREAS.map((a) => a.label);

/** Lookup area definition by label */
export function getAreaByLabel(label: string): AreaDefinition | undefined {
  return AREAS.find((a) => a.label === label);
}

/** Find the nearest area to a given lat/lng from a list of available area labels */
export function findNearestArea(
  lat: number,
  lng: number,
  availableLabels: string[],
): string | null {
  let nearest: string | null = null;
  let minDist = Infinity;

  for (const label of availableLabels) {
    const area = getAreaByLabel(label);
    if (!area) continue;
    const d = Math.sqrt(
      (lat - area.centre.lat) ** 2 + (lng - area.centre.lng) ** 2,
    );
    if (d < minDist) {
      minDist = d;
      nearest = label;
    }
  }

  // Also check against all AREAS (not just those with listings) for better UX
  if (!nearest) {
    for (const area of AREAS) {
      const d = Math.sqrt(
        (lat - area.centre.lat) ** 2 + (lng - area.centre.lng) ** 2,
      );
      if (d < minDist) {
        minDist = d;
        nearest = area.label;
      }
    }
  }

  return nearest;
}
