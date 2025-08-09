import { PrismaClient } from "../src/generated/prisma/index.js"

const prisma = new PrismaClient()

async function seedDonations() {
  // Check if donations already exist
  const existingDonations = await prisma.donation.findMany()
  
  if (existingDonations.length > 0) {
    console.log("Donations already exist")
    return
  }

  const sampleDonations = [
    {
      donorName: "Ahmad Wijaya",
      amount: 1000000,
      message: "Semoga masjid ini menjadi tempat berkumpul umat yang berkah",
      isAnonymous: false
    },
    {
      donorName: "Siti Nurhaliza",
      amount: 500000,
      message: "Ikut berpartisipasi dalam pembangunan rumah Allah",
      isAnonymous: false
    },
    {
      donorName: "Budi Santoso",
      amount: 750000,
      message: "Barakallahu fiikum",
      isAnonymous: false
    },
    {
      amount: 2000000,
      message: "Semoga mendapat ridho Allah SWT",
      isAnonymous: true
    },
    {
      donorName: "Fatimah Zahra",
      amount: 300000,
      message: "Lillahi ta'ala",
      isAnonymous: false
    },
    {
      donorName: "Muhammad Rizki",
      amount: 1500000,
      message: "Semoga bermanfaat untuk umat Islam",
      isAnonymous: false
    }
  ]

  for (const donation of sampleDonations) {
    await prisma.donation.create({
      data: donation
    })
  }

  console.log(`Created ${sampleDonations.length} sample donations`)
}

seedDonations()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })