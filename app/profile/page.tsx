'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiHeart,
  FiUsers,
  FiLogOut,
  FiSettings,
  FiCamera
} from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// FFWPU member data with only the required fields
const mockMemberData = {
  // Required fields only
  id: 'PH-MNL-2024-001',
  continent: 'Asia',
  region: 'Southeast Asia',
  nation: 'Philippines',
  church: 'Manila Family Church',
  city: 'Manila',
  givenName: 'Juan Carlos',
  familyName: 'Dela Cruz',
  fullName: 'Juan Carlos Dela Cruz',
  gender: 'Male',
  dateOfBirth: '1990-03-15',
  age: 35,
  ageGroup: 'Adult (30-50)',
  blessedChild: 'Yes',
  blessingStatus: 'Blessed',
  email: 'test@test.com',
  phone: '+63 912 345 6789',
  blessedYear: 2015,
  nameOfSpouse: 'Maria Elena Santos Dela Cruz',
  dateOfJoining: '2022-01-15',
  spiritualParent: 'Rev. Pedro & Mrs. Carmen Rodriguez',
  registeredAt: 'Manila Family Church',
  registeredBy: 'Rev. Maria Santos',
  membershipCategory: 'Blessed Family',
  note: 'Active in community service and youth ministry'
}

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileImage, setProfileImage] = useState('/ffwpu-ph-logo.webp')
  const [memberData, setMemberData] = useState(mockMemberData)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
      fetchMemberData()
    }
  }, [router])

  const fetchMemberData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/member')
      const result = await response.json()
      
      if (result.success && result.data) {
        setMemberData(result.data)
      } else {
        console.error('Failed to fetch member data:', result.error)
        // Keep using mock data as fallback
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
      // Keep using mock data as fallback
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isLoggedIn || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/ffwpu-ph-logo.webp"
              alt="FFWPU Philippines"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold text-lg text-gray-900">FFWPU Philippines</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <FiSettings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <FiLogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header - Social Media Style */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <FiCamera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-white pb-4">
                  <h1 className="text-3xl font-bold mb-2">
                    {memberData.givenName} {memberData.familyName}
                  </h1>
                  <p className="text-blue-100 text-lg mb-2">
                    {memberData.membershipCategory} • {memberData.church}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-blue-100">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      Joined {new Date(memberData.dateOfJoining).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {memberData.blessingStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal & Location Info */}
          <div className="space-y-6">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUser className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Full Name:</span>
                    <span className="text-sm ml-2">{memberData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Given Name:</span>
                    <span className="text-sm ml-2">{memberData.givenName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Family Name:</span>
                    <span className="text-sm ml-2">{memberData.familyName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Gender:</span>
                    <span className="text-sm ml-2">{memberData.gender}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    <span className="text-sm ml-2">{memberData.age} years</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Age Group:</span>
                    <span className="text-sm ml-2">{memberData.ageGroup}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <FiMail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{memberData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{memberData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Born {new Date(memberData.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location & Church Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiMapPin className="h-5 w-5" />
                  Location & Church
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Continent:</span>
                    <span className="text-sm ml-2">{memberData.continent}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Region:</span>
                    <span className="text-sm ml-2">{memberData.region}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nation:</span>
                    <span className="text-sm ml-2">{memberData.nation}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">City:</span>
                    <span className="text-sm ml-2">{memberData.city}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Church:</span>
                    <span className="text-sm ml-2">{memberData.church}</span>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Blessing & Family Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiHeart className="h-5 w-5" />
                  Blessing & Family
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Blessed Child:</span>
                    <Badge variant={memberData.blessedChild === 'Yes' ? 'default' : 'secondary'} className="ml-2">
                      {memberData.blessedChild}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Blessing Status:</span>
                    <Badge variant="default" className="ml-2">
                      {memberData.blessingStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Blessed Year:</span>
                    <span className="text-sm ml-2">{memberData.blessedYear}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name of Spouse:</span>
                    <span className="text-sm ml-2">{memberData.nameOfSpouse}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Membership Details & Actions */}
          <div className="space-y-6">
            {/* Membership Details */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Member ID:</span>
                    <span className="text-sm ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{memberData.id}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Membership Category:</span>
                    <Badge variant="outline" className="ml-2">{memberData.membershipCategory}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date of Joining:</span>
                    <span className="text-sm ml-2">
                      {new Date(memberData.dateOfJoining).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Registered At:</span>
                    <span className="text-sm ml-2">{memberData.registeredAt}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Registered By:</span>
                    <span className="text-sm ml-2">{memberData.registeredBy}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Spiritual Parent:</span>
                    <span className="text-sm ml-2">{memberData.spiritualParent}</span>
                  </div>
                </div>
                {memberData.note && (
                  <div className="pt-3 border-t">
                    <span className="text-sm font-medium text-gray-700">Note:</span>
                    <p className="text-sm mt-1 text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {memberData.note}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  View Events
                </Button>
                <Button className="w-full" variant="outline">
                  <FiUsers className="h-4 w-4 mr-2" />
                  Contact Pastor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}