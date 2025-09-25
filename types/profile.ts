export interface UserData {
  id: string
  email: string
  isEmailVerified: boolean
  lastLoginAt?: string
}

export interface MemberData {
  id: string
  fullName: string
  givenName: string
  familyName: string
  dateOfBirth: string
  ageGroup: string
  homeChurch: string
  position: string
  gender?: string
  age?: number
  email?: string
  phone?: string
  continent?: string
  region?: string
  nation?: string
  city?: string
  church?: string
  membershipCategory?: string
  dateOfJoining?: string
  blessingStatus?: string
  blessedChild?: string
  blessedYear?: number
  nameOfSpouse?: string
  spiritualParent?: {
    id: string
    fullName: string
    givenName: string
    familyName: string
    email?: string
    phone?: string
    church?: string
  } | null
  registeredAt?: string
  registeredBy?: string
  note?: string
}