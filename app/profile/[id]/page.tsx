import { notFound } from 'next/navigation'
import { dbConnect } from '@/lib/db'
import Member from '@/models/Member'
import { Metadata } from 'next'
import ProfileContainer from '@/components/profile/ProfileContainer'
import { MemberData, UserData } from '@/types/profile'

interface ProfilePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  await dbConnect()
  
  const member = await Member.findById(params.id)
    .populate('spiritualParent', 'fullName')
    .lean()
  
  if (!member) {
    return {
      title: 'Member Not Found'
    }
  }

  return {
    title: `${member.fullName} - Member Profile`,
    description: `Profile page for ${member.fullName}`
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await dbConnect()

  const member = await Member.findById(params.id)
    .populate('spiritualParent', 'fullName givenName familyName email phone church')
    .lean() as any // Type assertion for populated fields

  if (!member) {
    notFound()
  }

  // Transform the member data to match the expected interface
  const memberData = {
    id: member._id.toString(),
    fullName: member.fullName,
    givenName: member.givenName,
    familyName: member.familyName,
    dateOfBirth: member.dateOfBirth,
    ageGroup: member.ageGroup,
    homeChurch: member.church,
    position: member.position || 'Member',
    gender: member.gender,
    age: member.age,
    email: member.email,
    phone: member.phone,
    continent: member.continent,
    region: member.region,
    nation: member.nation,
    city: member.city,
    church: member.church,
    membershipCategory: member.membershipCategory,
    dateOfJoining: member.dateOfJoining,
    blessingStatus: member.blessingStatus,
    blessedChild: member.blessedChild,
    blessedYear: member.blessedYear,
    nameOfSpouse: member.nameOfSpouse,
    spiritualParent: member.spiritualParent ? {
      id: member.spiritualParent._id.toString(),
      fullName: member.spiritualParent.fullName,
      givenName: member.spiritualParent.givenName,
      familyName: member.spiritualParent.familyName,
      email: member.spiritualParent.email,
      phone: member.spiritualParent.phone,
      church: member.spiritualParent.church,
    } : null,
    registeredAt: member.registeredAt,
    registeredBy: member.registeredBy,
    note: member.note,
  }

  // Create a dummy user data for the profile container
  const userData: UserData = {
    id: member._id.toString(),
    email: member.email || '',
    isEmailVerified: false,
  }

  return (
    <ProfileContainer
      userData={userData}
      memberData={memberData}
      profileImage='/ffwpu-ph-logo.webp'
      loading={false}
      error=''
      showImageUpload={false}
    />
  )
}