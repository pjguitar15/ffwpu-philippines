import { Leader } from '@/types/church-leaders.type'

export const LEADERS: Leader[] = [
  // ─────────────────────────────────────────
  // National (sorted by order)
  // ─────────────────────────────────────────
  {
    name: 'Rev. Ronnie Sodusta',
    title: 'National Leader / Regional Director',
    photoUrl: '/leaders/ronnie-sodusta.png',
    level: 'National',
    tag: 'Head Office',
    order: 1,
  },
  {
    name: 'Ms. Maraia Aparece',
    title: 'National Secretary',
    photoUrl: '/leaders/maraia-aparece.png',
    level: 'National',
    tag: 'Head Office',
    order: 2,
  },
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Secretary General',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'National',
    tag: 'Head Office',
    order: 3,
  },

  // ─────────────────────────────────────────
  // Departments (sorted per org slide)
  // (Board/Finance items appear first)
  // ─────────────────────────────────────────
  {
    name: 'Mrs. Kinu Nuyana',
    title: 'Finance Director (Finance Committee)',
    photoUrl: '/leaders/kinu-nuyana.png',
    level: 'Department',
    tag: 'Finance',
    order: 0.5,
  },
  {
    name: 'Mrs. Kinu Nuyana',
    title: 'Accounting Department Director',
    photoUrl: '/leaders/kinu-nuyana.png',
    level: 'Department',
    tag: 'Accounting',
    order: 0.6,
  },
  {
    name: 'Mrs. Shirley Vergara',
    title: 'Church Nurturing, Tithes & Offerings Department Director',
    photoUrl: '/leaders/shirley-vergara.png',
    level: 'Department',
    tag: 'Tithes & Offerings / Women',
    order: 0.7,
  },

  {
    name: 'Mary Grace A. Carumba',
    title: 'Director, Database Management & Membership Department',
    photoUrl: '/leaders/mary-grace-carumba.png',
    level: 'Department',
    tag: 'Membership / Data',
    order: 1,
  },
  {
    name: 'Angelito Cainday',
    title: 'Director, Church Growth Department',
    photoUrl: '/leaders/angelito-cainday.png',
    level: 'Department',
    tag: 'Growth',
    order: 2,
  },
  {
    name: 'Venus Agustin',
    title:
      'Director, General Affairs & PR Department (UPF Philippines Regional Director)',
    photoUrl: '/leaders/venus-agustin.png',
    level: 'Department',
    tag: 'PR / UPF',
    order: 3,
  },
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Director, Administrative Department',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'Department',
    tag: 'Administration',
    order: 4,
  },
  {
    name: 'Catherine Gregorio',
    title: 'Director, Blessed Family Department',
    photoUrl: '/leaders/catherine-gregorio.png',
    level: 'Department',
    tag: 'BFD',
    order: 5,
  },
  {
    name: 'Jun Young Teves',
    title: 'Director, Youth / Future Generation Department',
    photoUrl: '/leaders/jun-young-teves.png',
    level: 'Department',
    tag: 'Youth',
    order: 6,
  },
  {
    name: 'Edgar Tanate',
    title: 'Head, Education, Spirituality & Leadership Development Department',
    photoUrl: '/leaders/edgar-tanate.png',
    level: 'Department',
    tag: 'Education',
    order: 7,
  },

  // ─────────────────────────────────────────
  // Areas (1 → 5)
  // ─────────────────────────────────────────
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Area 1 Leader • NCR & Central Luzon',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'Area',
    tag: 'Area 1',
    order: 1,
  },
  {
    name: 'Rene T. Lansangan',
    title: 'Area 2 Leader • Northern Luzon',
    photoUrl: '/leaders/rene-lansangan.png',
    level: 'Area',
    tag: 'Area 2',
    order: 2,
  },
  {
    name: 'Rev. Froilan Matbagan',
    title: 'Area 3 Leader • Southern Luzon',
    photoUrl: '/leaders/froilan-matbagan.jpg',
    level: 'Area',
    tag: 'Area 3',
    order: 3,
  },
  {
    name: 'Angelito Cainday',
    title: 'Area 4 Leader • Visayas',
    photoUrl: '/leaders/angelito-cainday.png',
    level: 'Area',
    tag: 'Area 4',
    order: 4,
  },
  {
    name: 'Mrs. Nobue Caballero',
    title: 'Area 5 Leader • Mindanao',
    photoUrl: '/leaders/nobue-caballero.png',
    level: 'Area',
    tag: 'Area 5',
    order: 5,
  },

  // ─────────────────────────────────────────
  // Regions / Local Churches (ordered inside each Area)
  // ─────────────────────────────────────────

  // AREA 1 → NCR, R3
  {
    name: 'Rev. John Rhodbert Gregorio',
    title: 'Metro Manila Church',
    photoUrl: '/leaders/john-rhodbert-gregorio.png',
    level: 'Region',
    tag: 'NCR',
    order: 1, // within Area 1
  },
  {
    name: 'Rev. Froilan Ramos',
    title: 'Cabanatuan Church',
    photoUrl: '/leaders/froilan-ramos.png',
    level: 'Region',
    tag: 'R3',
    order: 2, // within Area 1
  },

  // AREA 2 → R1, R2, CAR
  {
    name: 'Blessie Belle T. Ramos',
    title: 'La Union Church',
    photoUrl: '/leaders/blessie-ramos.png',
    level: 'Region',
    tag: 'R1',
    order: 1, // within Area 2
  },
  {
    name: 'Rene T. Lansangan',
    title: 'Cauayan Church',
    photoUrl: '/leaders/rene-lansangan.png',
    level: 'Region',
    tag: 'R2',
    order: 2, // within Area 2
  },
  {
    name: 'Rev. Concepcion “Connie” Gawec',
    title: 'Baguio Church',
    photoUrl: '/leaders/concepcion-gawec.png',
    level: 'Region',
    tag: 'CAR',
    order: 3, // within Area 2
  },

  // AREA 3 → R4A, R4A, R4B, R5
  {
    name: 'Rev. Froilan Matbagan',
    title: 'Antipolo Church',
    photoUrl: '/leaders/froilan-matbagan.jpg',
    level: 'Region',
    tag: 'R4A',
    order: 1, // within Area 3
  },
  {
    name: 'Rev. Reynaldo Estoce',
    title: 'Cavite Church',
    photoUrl: '/leaders/reynaldo-estoce.png',
    level: 'Region',
    tag: 'R4A',
    order: 2, // within Area 3
  },
  {
    name: 'Rev. Leopoldo Uba',
    title: 'Puerto Princesa Church',
    photoUrl: '/leaders/leopoldo-uba.png',
    level: 'Region',
    tag: 'R4B',
    order: 3, // within Area 3
  },
  {
    name: 'Rev. Ariel Villafuerte',
    title: 'Legazpi Church',
    photoUrl: '/leaders/ariel-villafuerte.png',
    level: 'Region',
    tag: 'R5',
    order: 4, // within Area 3
  },

  // AREA 4 → R6, R7, R8
  {
    name: 'Rev. Carlo Niño Bartolo',
    title: 'Iloilo Church',
    photoUrl: '/leaders/carlo-bartolo.png',
    level: 'Region',
    tag: 'R6',
    order: 1, // within Area 4
  },
  {
    name: 'Rev. Romel Pinson',
    title: 'Cebu Church',
    photoUrl: '/leaders/romel-pinson.png',
    level: 'Region',
    tag: 'R7',
    order: 2, // within Area 4
  },
  {
    name: 'Rev. Editha Cipriano',
    title: 'Leyte Church',
    photoUrl: '/leaders/editha-cipriano.png',
    level: 'Region',
    tag: 'R8',
    order: 3, // within Area 4
  },

  // AREA 5 → R9, R10, (R11 Davao—tbd), R12, R13
  {
    name: 'Rev. Elsa Catbay',
    title: 'Zamboanga Church',
    photoUrl: '/leaders/elsa-catbay.png',
    level: 'Region',
    tag: 'R9',
    order: 1, // within Area 5
  },
  {
    name: 'Rev. Sylvia Deapera',
    title: 'Cagayan de Oro Church',
    photoUrl: '/leaders/sylvia-deapera.png',
    level: 'Region',
    tag: 'R10',
    order: 2, // within Area 5
  },
  // R11 Davao — leader not confirmed in sources; add when known.
  {
    name: 'Rev. John C. Bastol',
    title: 'General Santos (SOCSKSARGEN) Church',
    photoUrl: '/leaders/john-bastol.png',
    level: 'Region',
    tag: 'R12',
    order: 3, // within Area 5
  },
  {
    name: 'Rev. Percy Apas',
    title: 'Butuan Church',
    photoUrl: '/leaders/percinita-apas.png',
    level: 'Region',
    tag: 'R13',
    order: 4, // within Area 5
  },
]
