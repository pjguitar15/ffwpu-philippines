'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  FiSearch, 
  FiFilter, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLoader,
  FiHeart,
  FiUsers,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MemberTableData, MembersResponse } from '@/types/members'
import MembersTableSkeleton from './MembersTableSkeleton'

interface MembersTableProps {
  initialData: MembersResponse
}

export default function MembersTable({ initialData }: MembersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<MembersResponse>(initialData)
  const [loading, setLoading] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
  
  // Search and filter states
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [church, setChurch] = useState(searchParams.get('church') || '')
  const [blessingStatus, setBlessingStatus] = useState(searchParams.get('blessingStatus') || '')
  const [ageGroup, setAgeGroup] = useState(searchParams.get('ageGroup') || '')
  const [membershipCategory, setMembershipCategory] = useState(searchParams.get('membershipCategory') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'fullName')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

  // Fetch data function
  const fetchData = async (params: Record<string, string> = {}) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search,
        church: church === 'all' ? '' : church,
        blessingStatus: blessingStatus === 'all' ? '' : blessingStatus,
        ageGroup: ageGroup === 'all' ? '' : ageGroup,
        membershipCategory: membershipCategory === 'all' ? '' : membershipCategory,
        sortBy,
        sortOrder,
        ...params
      })

      const response = await fetch(`/api/members?${queryParams}`)
      if (response.ok) {
        const newData = await response.json()
        setData(newData)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle member row click
  const handleMemberClick = async (memberId: string) => {
    setNavigatingTo(memberId)
    setTimeout(() => {
      router.push(`/profile/${memberId}`)
    }, 300)
  }

  // Handle sorting
  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(newOrder)
    fetchData({ sortBy: field, sortOrder: newOrder, page: '1' })
    setCurrentPage(1)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchData({ page: page.toString() })
  }

  // Handle search/filter changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchData({ page: '1' })
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [search, church, blessingStatus, ageGroup, membershipCategory])

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />
  }

  const getBlessingStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>
    
    if (status === 'Blessed') {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <FiHeart className="h-3 w-3" />
          {status}
        </Badge>
      )
    }
    
    if (status === 'Single') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <FiUser className="h-3 w-3" />
          {status}
        </Badge>
      )
    }
    
    if (status === 'Engaged') {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <FiUsers className="h-3 w-3" />
          {status}
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <FiUser className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUsers className="h-5 w-5" />
            Members Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={church || undefined} onValueChange={(value) => setChurch(value || '')}>
              <SelectTrigger>
                <SelectValue placeholder="All Churches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Churches</SelectItem>
                {data.filters.churches.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={blessingStatus || undefined} onValueChange={(value) => setBlessingStatus(value || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Blessing Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {data.filters.blessingStatuses.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ageGroup || undefined} onValueChange={(value) => setAgeGroup(value || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                {data.filters.ageGroups.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={membershipCategory || undefined} onValueChange={(value) => setMembershipCategory(value || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {data.filters.membershipCategories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      {loading ? (
        <MembersTableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th 
                      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('fullName')}
                    >
                      <div className="flex items-center gap-2">
                        <FiUser className="h-4 w-4" />
                        Full Name
                        {getSortIcon('fullName')}
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        Email
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('church')}
                    >
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4" />
                        Church
                        {getSortIcon('church')}
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <FiHeart className="h-4 w-4" />
                        Status
                      </div>
                    </th>
                    <th 
                      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('ageGroup')}
                    >
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4" />
                        Age Group
                        {getSortIcon('ageGroup')}
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium">Spiritual Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.members.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => handleMemberClick(member.id)}
                      className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {navigatingTo === member.id && (
                            <FiLoader className="h-4 w-4 animate-spin text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium">{member.fullName}</div>
                            <div className="text-sm text-gray-500">
                              {member.membershipCategory}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{member.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{member.church || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getBlessingStatusBadge(member.blessingStatus)}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{member.ageGroup}</Badge>
                      </td>
                      <td className="p-4">
                        {member.spiritualParent ? (
                          <span className="text-sm text-blue-600 hover:text-blue-800">
                            {member.spiritualParent.fullName}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} to{' '}
              {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)} of{' '}
              {data.pagination.totalCount} members
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={!data.pagination.hasPrevPage}
              >
                <FiChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                disabled={!data.pagination.hasPrevPage}
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                disabled={!data.pagination.hasNextPage}
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.pagination.totalPages)}
                disabled={!data.pagination.hasNextPage}
              >
                <FiChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}