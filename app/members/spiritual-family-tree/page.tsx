import { Metadata } from 'next'
import SpiritualParentsOverview from '@/components/members/SpiritualParentsOverview'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiArrowLeft, FiUsers } from 'react-icons/fi'
import LeftNavigation from '@/components/layout/LeftNavigation'

export const metadata: Metadata = {
  title: 'Spiritual Leaders Network - FFWPU Philippines',
  description: 'Explore our spiritual leaders and their influence network within the church community',
}

export default function SpiritualFamilyTreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LeftNavigation />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Link href="/members">
                <Button variant="outline" size="sm">
                  <FiArrowLeft className="h-4 w-4 mr-2" />
                  Back to Members
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Spiritual Leaders Network</h1>
              <p className="text-gray-600">
                Discover our spiritual leaders and their influence within the church community
              </p>
            </div>
          </div>

          {/* Overview Component */}
          <SpiritualParentsOverview />
        </div>
      </div>
    </div>
  )
}