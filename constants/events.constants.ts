// constants/events.constants.ts
export const AREAS = [
  'Nationwide',
  'Area 1',
  'Area 2',
  'Area 3',
  'Area 4',
  'Area 5',
] as const
export type Area = (typeof AREAS)[number]

export const REGIONS = [
  'NCR',
  'R1',
  'R2',
  'R3',
  'R4A',
  'R4B',
  'R5',
  'R6',
  'R7',
  'R8',
  'R9',
  'R10',
  'R11',
  'R12',
  'R13',
] as const
export type Region = (typeof REGIONS)[number]

export const CHURCHES = [
  'Metro Manila Family Church',
  'Antipolo Family Church',
  'Cagayan de Oro Church',
  'Iloilo Church',
  'Legaspi Church',
  'Baguio Church',
  'Davao Church',
  'La Union Church',
  'Cauayan Family Church/Region 2',
  'Puerto Princesa Church',
  'Gen. Santos Church',
  'Cebu Family Church',
  'Cavite Church',
] as const

export const AREA_REGION_MAP: Record<Area, readonly Region[]> = {
  Nationwide: REGIONS,
  'Area 1': ['NCR', 'R3'],
  'Area 2': ['R1', 'R2'],
  'Area 3': ['R4A', 'R4B', 'R5'],
  'Area 4': ['R6', 'R7', 'R8'],
  'Area 5': ['R9', 'R10', 'R11', 'R12', 'R13'],
} as const

// ✅ Region → Churches
export const REGION_CHURCHES: Record<Region, readonly string[]> = {
  NCR: ['Metro Manila Family Church'],
  R1: ['La Union Church', 'Baguio Church'], // (Baguio in Area 2 on your chart)
  R2: ['Cauayan Family Church/Region 2'],
  R3: ['Cabanatuan Church'], // add Cabanatuan if you want
  R4A: ['Antipolo Family Church', 'Cavite Church'],
  R4B: ['Puerto Princesa Church'],
  R5: ['Legaspi Church'],
  R6: ['Iloilo Church'],
  R7: ['Cebu Family Church'],
  R8: ['Leyte Church'], // add Leyte Church if you want
  R9: ['Zamboanga Church'], // add Zamboanga Church if you want
  R10: ['Cagayan de Oro Church'],
  R11: ['Davao Church'],
  R12: ['Gen. Santos Church'],
  R13: ['Butuan Church'], // add Butuan Church if you want
} as const
