/* Simple Node seeding script for FFWPU Members from XLSX */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const xlsx = require('xlsx')

const uri = process.env.MONGODB_STRING
if (!uri) {
  console.error('MONGODB_STRING is missing. Aborting.')
  process.exit(1)
}

// Helper function to generate member ID
function generateMemberId(church, index) {
  const churchCode = church.replace(/[^A-Z]/g, '').substring(0, 3) || 'CHU'
  return `PH-${churchCode}-2024-${String(index + 1).padStart(3, '0')}`
}

// Helper function to calculate age
function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Helper function to determine age group based on actual XLSX data patterns
function getAgeGroup(age) {
  if (age <= 17) return 'Seonghwa'
  if (age <= 39) return 'Young Adult'
  if (age <= 59) return 'Adult1'
  return 'Adult2'
}

// Helper function to format date
function parseDate(dateStr) {
  if (!dateStr) return null
  
  // Handle Excel date serial numbers
  if (typeof dateStr === 'number') {
    // Excel dates are days since January 1, 1900
    const excelEpoch = new Date(1900, 0, 1)
    const date = new Date(excelEpoch.getTime() + (dateStr - 2) * 24 * 60 * 60 * 1000)
    return date
  }
  
  // Handle string dates
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

async function run() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined })
    console.log('✅ Connected to MongoDB')

    // Define the Member schema
    const MemberSchema = new mongoose.Schema({
      id: { type: String, required: true, unique: true },
      continent: { type: String, required: true },
      region: { type: String, required: true },
      nation: { type: String, required: true },
      church: { type: String, required: true },
      city: { type: String, required: true },
      givenName: { type: String, required: true },
      familyName: { type: String, required: true },
      fullName: { type: String, required: true },
      gender: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      age: { type: Number, required: true },
      ageGroup: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      blessedChild: { type: String, required: true },
      blessingStatus: { type: String, required: true },
      blessedYear: { type: Number },
      nameOfSpouse: { type: String },
      dateOfJoining: { type: Date, required: true },
      spiritualParent: { type: String },
      registeredAt: { type: String, required: true },
      registeredBy: { type: String, required: true },
      membershipCategory: { type: String, required: true },
      note: { type: String }
    }, { timestamps: true })

    const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema)

    console.log('🔄 Reading XLSX file...')
    const xlsxPath = path.join(process.cwd(), 'data', '2025-09-01 Philippines FFWPU Membership.xlsx')
    
    if (!fs.existsSync(xlsxPath)) {
      console.error('❌ XLSX file not found:', xlsxPath)
      process.exit(1)
    }

    const workbook = xlsx.readFile(xlsxPath)
    const sheetName = workbook.SheetNames[0] // Use first sheet
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = xlsx.utils.sheet_to_json(worksheet)

    console.log(`📊 Found ${jsonData.length} records in XLSX file`)

    // Clear existing members
    console.log('🗑️ Clearing existing members...')
    await Member.deleteMany({})

    console.log('🔄 Processing and inserting members...')
    const members = []
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      
      try {
        // Map XLSX columns to our schema
        const dateOfBirth = parseDate(row['Date of Birth'])
        const dateOfJoining = parseDate(row['Date of Joining'])
        
        if (!dateOfBirth || !dateOfJoining) {
          console.warn(`⚠️ Skipping row ${i + 1}: Invalid dates`)
          continue
        }

        const age = calculateAge(dateOfBirth)
        // Use age group from XLSX if available, otherwise calculate it
        const ageGroup = row['Age Group'] || getAgeGroup(age)
        
        const member = {
          id: row['ID'] || generateMemberId(row['Church'] || 'Unknown', i),
          continent: row['Continent'] || 'Asia',
          region: row['Region'] || 'Southeast Asia',
          nation: row['Nation'] || 'Philippines',
          church: row['Church'] || 'Unknown Church',
          city: row['City'] || 'Unknown City',
          givenName: row['Given Name'] || 'Unknown',
          familyName: row['Family Name'] || 'Unknown',
          fullName: row['Full Name'] || `${row['Given Name'] || 'Unknown'} ${row['Family Name'] || 'Unknown'}`,
          gender: row['Gender'] || 'Unknown',
          dateOfBirth,
          age,
          ageGroup,
          email: row['Email'] || `member${i + 1}@example.com`,
          phone: row['Phone'] || '+63 900 000 0000',
          blessedChild: row['Blessed Child'] || 'No',
          blessingStatus: row['Blessing Status'] || 'Single',
          blessedYear: row['Blessed year'] ? parseInt(row['Blessed year']) : null,
          nameOfSpouse: row['Name of spouse'] || null,
          dateOfJoining,
          spiritualParent: row['Spiritual Parent'] || null,
          registeredAt: row['Registered at'] || row['Church'] || 'Unknown Church',
          registeredBy: row['Registered by'] || 'Unknown',
          membershipCategory: row['Membership Category'] || 'Regular Member',
          note: row['Note'] || null
        }

        members.push(member)
        
        if ((i + 1) % 100 === 0) {
          console.log(`🔄 Processed ${i + 1} records...`)
        }
      } catch (error) {
        console.warn(`⚠️ Error processing row ${i + 1}:`, error.message)
        continue
      }
    }

    console.log(`💾 Inserting ${members.length} members into database...`)
    await Member.insertMany(members, { ordered: false })

    console.log(`✅ Successfully seeded ${members.length} members!`)
    
    // Show a sample record
    const sampleMember = await Member.findOne()
    if (sampleMember) {
      console.log('\n📋 Sample member record:')
      console.log({
        id: sampleMember.id,
        fullName: sampleMember.fullName,
        church: sampleMember.church,
        membershipCategory: sampleMember.membershipCategory
      })
    }

  } catch (error) {
    console.error('❌ Error seeding members:', error)
    process.exit(1)
  } finally {
    console.log('🔒 Closing database connection...')
    await mongoose.connection.close()
    console.log('✅ Database connection closed')
  }
}

run().catch(console.error)