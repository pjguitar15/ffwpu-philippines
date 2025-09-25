'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiUser, FiUsers, FiMapPin, FiMail, FiPhone, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import Link from 'next/link'

interface NetworkNode {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  church: string
  membershipCategory: string
  ageGroup: string
  spiritualChildren: NetworkNode[]
  _count?: {
    spiritualChildren: number
  }
}

interface NetworkData {
  familyTree: NetworkNode[]
  statistics: {
    totalMembers: number
    rootMembers: number
    membersWithSpiritualParents: number
    maxDepth: number
  }
}

interface NetworkTreeVisualizationProps {
  rootMemberId: string
}

export default function NetworkTreeVisualization({ rootMemberId }: NetworkTreeVisualizationProps) {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootMemberId]))

  useEffect(() => {
    fetchNetworkData()
  }, [rootMemberId])

  const fetchNetworkData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        rootId: rootMemberId
      })

      const response = await fetch(`/api/members/spiritual-family-tree?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch network data: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'API returned failure status')
      }
      
      setNetworkData(result.data)
      
      // Auto-expand root and first level
      if (result.data.familyTree.length > 0) {
        const rootNode = result.data.familyTree[0]
        const expandedSet = new Set([rootNode.id])
        rootNode.spiritualChildren.forEach((child: NetworkNode) => {
          expandedSet.add(child.id)
        })
        setExpandedNodes(expandedSet)
      }
    } catch (err) {
      console.error('Error fetching network data:', err)
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

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (membershipCategory: string, level: number) => {
    if (level === 0) return 'bg-gradient-to-br from-purple-600 to-pink-600' // Root
    if (membershipCategory.toLowerCase().includes('blessed')) return 'bg-gradient-to-br from-blue-500 to-cyan-500'
    if (membershipCategory.toLowerCase().includes('associate')) return 'bg-gradient-to-br from-green-500 to-emerald-500'
    return 'bg-gradient-to-br from-orange-500 to-yellow-500'
  }

  const getMembershipBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'blessed family':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'associate member':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pre-member':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderNetworkNode = (node: NetworkNode, level: number = 0, isLast: boolean = true) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.spiritualChildren.length > 0
    const isRoot = level === 0

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Connection Line */}
        {!isRoot && (
          <div className="w-px h-8 bg-gray-300"></div>
        )}
        
        {/* Node Card */}
        <Card className={`w-64 ${isRoot ? 'ring-2 ring-purple-500 shadow-lg' : 'shadow-md'} hover:shadow-lg transition-all duration-200 mb-4`}>
          <CardContent className="p-4">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-full ${getAvatarColor(node.membershipCategory, level)} 
                flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {getInitials(node.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${node.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate">
                    {node.fullName}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 truncate">{node.church}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge className={`text-xs ${getMembershipBadgeColor(node.membershipCategory)}`}>
                {node.membershipCategory}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {node.ageGroup}
              </Badge>
              {isRoot && (
                <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                  👑 Root
                </Badge>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              {node.email && (
                <div className="flex items-center space-x-1">
                  <FiMail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{node.email}</span>
                </div>
              )}
              {node.phone && (
                <div className="flex items-center space-x-1">
                  <FiPhone className="h-3 w-3 flex-shrink-0" />
                  <span>{node.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <FiMapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{node.church}</span>
              </div>
            </div>

            {/* Children Info and Expand Button */}
            {hasChildren && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <FiUsers className="h-3 w-3" />
                  <span>{node._count?.spiritualChildren || 0} spiritual children</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleNodeExpansion(node.id)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <FiChevronUp className="h-3 w-3" />
                  ) : (
                    <FiChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center">
            {/* Vertical line down */}
            <div className="w-px h-4 bg-gray-300"></div>
            
            {/* Horizontal line */}
            {node.spiritualChildren.length > 1 && (
              <div className="relative">
                <div className={`h-px bg-gray-300`} style={{ width: `${(node.spiritualChildren.length - 1) * 280}px` }}></div>
                {/* Vertical lines to each child */}
                <div className="absolute top-0 flex justify-between w-full">
                  {node.spiritualChildren.map((_, index) => (
                    <div key={index} className="w-px h-4 bg-gray-300"></div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Children Nodes */}
            <div className={`flex ${node.spiritualChildren.length > 1 ? 'space-x-4' : ''} items-start`}>
              {node.spiritualChildren.map((child, index) => (
                renderNetworkNode(child, level + 1, index === node.spiritualChildren.length - 1)
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading network tree...</p>
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
            <Button onClick={fetchNetworkData}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!networkData || networkData.familyTree.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No network data available for this member.</p>
        </CardContent>
      </Card>
    )
  }

  const rootNode = networkData.familyTree[0]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Showing unlimited depth levels
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const allNodes = new Set([rootNode.id])
                  const addAllChildren = (node: NetworkNode) => {
                    node.spiritualChildren.forEach(child => {
                      allNodes.add(child.id)
                      addAllChildren(child)
                    })
                  }
                  addAllChildren(rootNode)
                  setExpandedNodes(allNodes)
                }}
              >
                Expand All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExpandedNodes(new Set([rootNode.id]))}
              >
                Collapse All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Spiritual Family Network</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="overflow-x-auto overflow-y-visible">
            <div className="flex justify-center" style={{ minWidth: 'max-content', width: '100%' }}>
              {renderNetworkNode(rootNode)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"></div>
              <span>Root Leader</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
              <span>Blessed Family</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
              <span>Associate Member</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500"></div>
              <span>Other</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}