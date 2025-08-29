type TimelineItem = {
  id: string
  year: string
  title: string
  icon: 'calendar' | 'map' | 'users' | 'award'
  content: string
}

export const TIMELINE: TimelineItem[] = [
  {
    id: 'ph-1975',
    year: '1975',
    title: 'Early Mission & Beginnings in the Philippines',
    icon: 'calendar',
    content:
      'Community sources mark 1975 as the beginning of the Unification Church in the Philippines, when missionaries arrived and first centers began forming in Metro Manila.',
  },
  {
    id: 'ph-1980s',
    year: '1980s',
    title: 'Growth & Expansion',
    icon: 'map',
    content:
      'Local witnessing expanded across regions as Filipino leaders emerged. New study groups and church communities opened in key cities.',
  },
  {
    id: 'global-1994',
    year: '1994',
    title: 'HSA-UWC Renamed to FFWPU',
    icon: 'users',
    content:
      'Globally, the Holy Spirit Association for the Unification of World Christianity (HSA-UWC) adopted its current name, Family Federation for World Peace and Unification (FFWPU). The Philippines community aligned with the global identity.',
  },
  {
    id: 'ph-2019',
    year: '2019',
    title: 'Religious Freedom Victory Celebration',
    icon: 'award',
    content:
      'A thanksgiving event in Manila marked the government’s dismissal of charges related to Blessing activities—celebrated with members and leaders from across Asia.',
  },
  {
    id: 'ph-2024',
    year: '2024',
    title: 'National Unified Sunday Service',
    icon: 'users',
    content:
      'Over 800 members joined onsite/online at the Metro Manila Family Church for guidance from Asia Pacific leadership and united worship.',
  },
  {
    id: 'ph-2025',
    year: '2025',
    title: 'National Youth Leaders Convergence',
    icon: 'users',
    content:
      'Youth departments and partner orgs gathered to plan education and leadership initiatives toward a unified national youth ministry.',
  },
]
