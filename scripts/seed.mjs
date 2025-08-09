import { hash } from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/index.js"

const prisma = new PrismaClient()

async function seedAdmin() {
  const email = "admin@mail.com"
  const password = "admin123"

  const existingAdmin = await prisma.admin.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log("Admin user already exists")
    return
  }

  const hashedPassword = await hash(password, 12)

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword
    }
  })

  console.log("Admin user created:", admin.email)

  // Create default mosque content
  const existingContent = await prisma.mosqueContent.findFirst()
  
  if (!existingContent) {
    await prisma.mosqueContent.create({
      data: {
        title: "Bantu Membangun Masjid Komunitas Kita",
        description: "Bergabunglah dengan kami dalam membangun masjid yang indah untuk menjadi pusat ibadah, berkumpul, dan pendidikan Islam bagi generasi mendatang.",
        goal: 500000000,
        currentAmount: 125000000,
        donorCount: 87,
        beforeRenovationDesc: "Masjid saat ini masih dalam kondisi sederhana dengan kapasitas terbatas dan fasilitas yang perlu ditingkatkan untuk melayani jamaah yang terus bertambah.",
        afterRenovationDesc: "Rencana renovasi akan memperluas kapasitas masjid, menambah fasilitas wudhu, ruang belajar, dan area parkir yang lebih nyaman untuk jamaah.",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountName: "Masjid Al-Hidayah"
      }
    })
    console.log("Default mosque content created")
  }
}

seedAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })