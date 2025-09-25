export interface MemberTableData {
  id: string
  fullName: string
  givenName: string
  familyName: string
  email?: string
  phone?: string
  church?: string
  ageGroup?: string
  blessingStatus?: string
  membershipCategory?: string
  dateOfJoining?: string
  spiritualParent?: {
    id: string
    fullName: string
  } | null
  gender?: string
  age?: number
  city?: string
  nation?: string
}

export interface MembersPagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export interface MembersFilters {
  churches: string[]
  blessingStatuses: string[]
  ageGroups: string[]
  membershipCategories: string[]
}

export interface MembersResponse {
  members: MemberTableData[]
  pagination: MembersPagination
  filters: MembersFilters
}