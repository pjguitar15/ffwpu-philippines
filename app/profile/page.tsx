'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserData, MemberData } from '@/types/profile'
import ProfileContainer from '@/components/profile/ProfileContainer'

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState('/ffwpu-ph-logo.webp')

  useEffect(() => {
    fetchMemberData()
  }, [])

  const fetchMemberData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/member/me', {
        cache: 'no-store',
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Received member data:', result.member) // Debug log
        setUserData(result.user)
        setMemberData(result.member)
      } else {
        // Will be handled by middleware - redirect to login
        router.push('/login?next=/profile')
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
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

  return (
    <ProfileContainer
      userData={userData}
      memberData={memberData}
      profileImage={profileImage}
      loading={loading}
      error={error}
      onImageUpload={handleImageUpload}
      onRetry={fetchMemberData}
      showImageUpload={true}
    />
  )
}
