'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FiChevronDown, FiChevronRight, FiUser, FiUsers, FiMail, FiMapPin, FiSearch } from 'react-icons/fi'
import Link from 'next/link'

interface FamilyTreeNode {
  id: string
  fullName: string
  email: string | null
  church: string
  membershipCategory: string
  ageGroup: string
  spiritualChildren: FamilyTreeNode[]
  _count?: {
    spiritualChildren: number
  }
}

interface FamilyTreeData {
  familyTree: FamilyTreeNode[]
  statistics: {
    totalMembers: number
    rootMembers: number
    membersWithSpiritualParents: number
    maxDepth: number
  }
}

interface SpiritualFamilyTreeProps {
  maxDepth?: number
  rootMemberId?: string
}

export default function SpiritualFamilyTree({ maxDepth = 3, rootMemberId }: SpiritualFamilyTreeProps) {
  const [familyTreeData, setFamilyTreeData] = useState<FamilyTreeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFamilyTree()
  }, [maxDepth, rootMemberId])

  const fetchFamilyTree = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching family tree with maxDepth:', maxDepth)
      
      const params = new URLSearchParams({
        maxDepth: maxDepth.toString()
      })
      
      if (rootMemberId) {
        params.append('rootId', rootMemberId)
      }

      const url = `/api/members/spiritual-family-tree?${params}`
      console.log('Fetching from URL:', url)
      
      const response = await fetch(url)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`Failed to fetch family tree data: ${response.status}`)
      }

      const result = await response.json()
      console.log('API Result:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'API returned failure status')
      }
      
      setFamilyTreeData(result.data)
      
      // Auto-expand first level if we have a small number of root members
      if (result.data.familyTree.length <= 5) {
        const firstLevelIds = result.data.familyTree.map((node: FamilyTreeNode) => node.id)
        setExpandedNodes(new Set(firstLevelIds))
      }
    } catch (err) {
      console.error('Error fetching family tree:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getMembershipBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'blessed family':
        return 'bg-blue-100 text-blue-800'
      case 'associate member':
        return 'bg-green-100 text-green-800'
      case 'pre-member':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAgeGroupBadgeColor = (ageGroup: string) => {
    switch (ageGroup.toLowerCase()) {
      case 'youth':
        return 'bg-purple-100 text-purple-800'
      case 'adult':
        return 'bg-indigo-100 text-indigo-800'
      case 'senior':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filterNodes = (nodes: FamilyTreeNode[], searchTerm: string): FamilyTreeNode[] => {
    if (!searchTerm) return nodes

    return nodes.filter(node => {
      const matchesSearch = node.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.church.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (node.email && node.email.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const hasMatchingChildren = node.spiritualChildren.length > 0 && 
                                 filterNodes(node.spiritualChildren, searchTerm).length > 0

      return matchesSearch || hasMatchingChildren
    }).map(node => ({
      ...node,
      spiritualChildren: filterNodes(node.spiritualChildren, searchTerm)
    }))
  }

  const renderNode = (node: FamilyTreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.spiritualChildren.length > 0
    const marginLeft = level * 24

    return (
      <div key={node.id} className="mb-2">
        <Card className="relative" style={{ marginLeft: `${marginLeft}px` }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNodeExpansion(node.id)}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? (
                      <FiChevronDown className="h-4 w-4" />
                    ) : (
                      <FiChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                {!hasChildren && <div className="w-6 h-6" />}
                
                <div className="flex items-center space-x-2">
                  <FiUser className="h-4 w-4 text-gray-500" />
                  <Link href={`/profile/${node.id}`}>
                    <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {node.fullName}
                    </span>
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <Badge variant="outline" className="text-xs">
                    <FiUsers className="h-3 w-3 mr-1" />
                    {node._count?.spiritualChildren || 0}
                  </Badge>
                )}
                <Badge className={`text-xs ${getMembershipBadgeColor(node.membershipCategory)}`}>
                  {node.membershipCategory}
                </Badge>
                <Badge className={`text-xs ${getAgeGroupBadgeColor(node.ageGroup)}`}>
                  {node.ageGroup}
                </Badge>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FiMapPin className="h-3 w-3" />
                <span>{node.church}</span>
              </div>
              {node.email && (
                <div className="flex items-center space-x-1">
                  <FiMail className="h-3 w-3" />
                  <span>{node.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.spiritualChildren.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading family tree...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchFamilyTree}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!familyTreeData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No family tree data available.</p>
        </CardContent>
      </Card>
    )
  }

  const filteredNodes = filterNodes(familyTreeData.familyTree, searchTerm)

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FiUsers className="h-5 w-5" />
            <span>Spiritual Family Tree Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {familyTreeData.statistics.totalMembers}
              </div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {familyTreeData.statistics.rootMembers}
              </div>
              <div className="text-sm text-gray-600">Root Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {familyTreeData.statistics.membersWithSpiritualParents}
              </div>
              <div className="text-sm text-gray-600">With Spiritual Parents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {familyTreeData.statistics.maxDepth}
              </div>
              <div className="text-sm text-gray-600">Max Depth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, church, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setExpandedNodes(new Set(filteredNodes.map(node => node.id)))}
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              onClick={() => setExpandedNodes(new Set())}
            >
              Collapse All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Family Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Family Tree</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No members found matching your search.' : 'No family tree data available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNodes.map(node => renderNode(node))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}