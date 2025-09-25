import { Metadata } from 'next'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiArrowLeft, FiUser } from 'react-icons/fi'
import NetworkTreeVisualization from '@/components/members/NetworkTreeVisualization'
import LeftNavigation from '@/components/layout/LeftNavigation'

interface NetworkTreePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: NetworkTreePageProps): Promise<Metadata> {
  await dbConnect()
  
  const member = await Member.findById(params.id).lean()
  
  if (!member) {
    return {
      title: 'Spiritual Leader Not Found'
    }
  }

  return {
    title: `${member.fullName} - Spiritual Family Network`,
    description: `Explore ${member.fullName}'s spiritual family network and downline structure`
  }
}

export default async function NetworkTreePage({ params }: NetworkTreePageProps) {
  await dbConnect()

  const rootMember = await Member.findById(params.id).lean()

  if (!rootMember) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <LeftNavigation currentMemberId={params.id} />
      <div className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Header */}
          <div className="mb-6">
            {/* Back Button Row */}
            <div className="flex items-center justify-between mb-4">
              <Link href="/members/spiritual-family-tree">
                <Button variant="outline" size="sm">
                  <FiArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <FiUser className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            {/* Title Row */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {rootMember.fullName}'s Network
              </h1>
              <p className="text-gray-600">
                Spiritual family tree and downline structure
              </p>
            </div>
          </div>

          {/* Network Tree Visualization */}
          <NetworkTreeVisualization rootMemberId={params.id} />
        </div>
      </div>
    </div>
  )
}