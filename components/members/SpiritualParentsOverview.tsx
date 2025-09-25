'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FiSearch, FiUsers, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import Link from 'next/link'

interface SpiritualParentOverview {
  id: string
  fullName: string
  email: string | null
  church: string
  membershipCategory: string
  ageGroup: string
  totalDownlines: number
  directChildren: number
}

interface OverviewData {
  spiritualParents: SpiritualParentOverview[]
  statistics: {
    totalMembers: number
    totalSpiritualParents: number
    totalWithSpiritualParents: number
    averageDownlines: number
  }
  pagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
    limit: number
  }
}

export default function SpiritualParentsOverview() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [displayedParents, setDisplayedParents] = useState<SpiritualParentOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 6

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setDisplayedParents([])
        setCurrentPage(1)
      }
      setError(null)
      
      const response = await fetch(`/api/members/spiritual-parents?page=${page}&limit=${itemsPerPage}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch overview data: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'API returned failure status')
      }
      
      setOverviewData(result.data)
      
      if (isLoadMore) {
        setDisplayedParents(prev => [...prev, ...result.data.spiritualParents])
      } else {
        setDisplayedParents(result.data.spiritualParents)
      }
      
      setHasMore(result.data.pagination?.hasMore || false)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching overview:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchOverviewData(currentPage + 1, true)
    }
  }

  const getColorForParent = (index: number, totalDownlines: number) => {
    // Color based on influence level
    if (totalDownlines >= 20) return 'bg-gradient-to-br from-purple-500 to-pink-500'
    if (totalDownlines >= 10) return 'bg-gradient-to-br from-blue-500 to-cyan-500'
    if (totalDownlines >= 5) return 'bg-gradient-to-br from-green-500 to-emerald-500'
    if (totalDownlines >= 2) return 'bg-gradient-to-br from-orange-500 to-yellow-500'
    return 'bg-gradient-to-br from-gray-400 to-gray-500'
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRankTitle = (totalDownlines: number) => {
    if (totalDownlines >= 20) return '🏆 Master Leader'
    if (totalDownlines >= 10) return '⭐ Senior Leader'
    if (totalDownlines >= 5) return '🌟 Team Leader'
    if (totalDownlines >= 2) return '📈 Active Leader'
    return '👤 New Leader'
  }

  const filteredParents = displayedParents.filter(parent =>
    parent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.church.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spiritual leaders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={() => fetchOverviewData()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!overviewData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {overviewData.statistics.totalSpiritualParents}
            </div>
            <div className="text-sm text-gray-600">Spiritual Leaders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {overviewData.statistics.totalWithSpiritualParents}
            </div>
            <div className="text-sm text-gray-600">Have Mentors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {overviewData.statistics.averageDownlines}
            </div>
            <div className="text-sm text-gray-600">Avg. Downlines</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {overviewData.statistics.totalMembers}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search spiritual leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Spiritual Parents Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FiUsers className="h-5 w-5" />
            <span>Spiritual Leaders Network</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredParents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No spiritual leaders found matching your search.' : 'No spiritual leaders available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredParents.map((parent, index) => (
                <Link key={parent.id} href={`/members/spiritual-family-tree/${parent.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      {/* Avatar Circle */}
                      <div className="relative mx-auto mb-4">
                        <div 
                          className={`w-20 h-20 rounded-full ${getColorForParent(index, parent.totalDownlines)} 
                            flex items-center justify-center text-white font-bold text-lg shadow-lg
                            group-hover:shadow-xl transition-shadow duration-200`}
                        >
                          {getInitials(parent.fullName)}
                        </div>
                        {/* Downline Count Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border-2 border-white">
                          <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {parent.totalDownlines}
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {parent.fullName}
                      </h3>

                      {/* Rank Title */}
                      <div className="text-sm font-medium text-gray-600 mb-3">
                        {getRankTitle(parent.totalDownlines)}
                      </div>

                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Direct:</span>
                          <span className="font-medium">{parent.directChildren}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total:</span>
                          <span className="font-medium text-blue-600">{parent.totalDownlines}</span>
                        </div>
                      </div>

                      {/* Church Badge */}
                      <Badge variant="outline" className="mt-3 text-xs">
                        {parent.church}
                      </Badge>

                      {/* View Tree Button */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-xs text-blue-600 flex items-center justify-center space-x-1">
                          <span>View Family Tree</span>
                          <FiArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {!searchTerm && hasMore && (
            <div className="text-center mt-6">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="px-6 py-2"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading more...
                  </>
                ) : (
                  'Load More Leaders'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Leadership Levels</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <span>Master Leader (20+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
              <span>Senior Leader (10-19)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
              <span>Team Leader (5-9)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500"></div>
              <span>Active Leader (2-4)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
              <span>New Leader (1)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}