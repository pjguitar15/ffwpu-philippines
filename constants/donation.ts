// Centralized donation-related data for reuse across components/pages.
// Feel free to adjust wording or replace placeholder images later.

export type BankAccount = {
  bank: string
  name: string
  accountNumber: string
  branch: string
  note?: string
  logo?: string // path to logo image (PNG)
}

export const bankAccounts: BankAccount[] = [
  {
    bank: 'BPI',
    name: 'FFWPU Philippines',
    accountNumber: '0000-1234-56',
    branch: 'BGC Branch',
    note: 'Include: Tithe / Offering / Project',
    logo: '/bpi-logo.png',
  },
  {
    bank: 'BDO',
    name: 'FFWPU Philippines',
    accountNumber: '1234-5678-90',
    branch: 'MOA Branch',
    note: 'Send receipt for proper acknowledgment',
    logo: '/bdo-logo.svg',
  },
  {
    bank: 'GCash',
    name: 'FFWPU Philippines',
    accountNumber: '0917-000-0000',
    branch: 'Mobile Wallet',
    note: 'Use notes field for purpose',
    logo: '/gcash-logo.png',
  },
]

export const donationSteps: { short: string; detail: string }[] = [
  {
    short: 'Prepare in prayer',
    detail:
      'Quietly reflect. Determine your tithe (first 10%) or special offering with a heart of gratitude before Heaven.',
  },
  {
    short: 'Set the first portion aside',
    detail:
      'Allocate your tithe immediately when income arrives. This sanctifies the remainder and creates clear stewardship.',
  },
  {
    short: 'Choose a giving channel',
    detail:
      'Use a bank transfer, GCash, or in‑person offering. Label the transfer: Tithe / Thanksgiving / Mission / Youth / Media.',
  },
  {
    short: 'Record & share (optional)',
    detail:
      'Take a receipt or screenshot. You may send it to the finance ministry for transparent accounting & gratitude reply.',
  },
  {
    short: 'Offer a concluding prayer',
    detail:
      'Express thanksgiving and invite Heaven\'s guidance for wise, providential use of all resources entrusted to the community.',
  },
]

export type GivingBenefit = {
  title: string
  desc: string
  image: string // placeholder path
}

export const givingBenefits: GivingBenefit[] = [
  {
    title: 'Express True Love',
    desc: 'Giving becomes a vertical and horizontal channel of heart—aligning with Heaven and serving brothers and sisters.',
    image: '/family-worship.png',
  },
  {
    title: 'Empower Ministries',
    desc: 'Media, education, youth, national witnessing, and relief missions are fueled by consistent offerings.',
    image: '/youth-fellowship.png',
  },
  {
    title: 'Practice Stewardship',
    desc: 'Returning the first portion sanctifies the rest and trains a lifestyle of gratitude, discipline, and responsibility.',
    image: '/peaceful-family-prayer.png',
  },
  {
    title: 'Protect Providence',
    desc: 'Stable resources shield against disruption and allow long-term vision planning with faith and clarity.',
    image: '/disaster-relief-volunteers.png',
  },
  {
    title: 'Align with Heaven',
    desc: 'Tithing places God first tangibly and invites guidance and blessing over your household economy.',
    image: '/peaceful-meditation-prayer.png',
  },
  {
    title: 'Build Cheon Il Guk Culture',
    desc: 'A giving culture expresses ownership, heart of filial piety, and co-creation of a Heavenly society.',
    image: '/community-service-volunteers.png',
  },
]
