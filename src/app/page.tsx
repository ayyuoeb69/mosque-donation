import { prisma } from "@/lib/prisma"
import LandingPage from "@/components/landing/LandingPage"

async function getContent() {
  const content = await prisma.mosqueContent.findFirst({
    where: { isActive: true }
  })
  return content
}

async function getDonations() {
  const donations = await prisma.donation.findMany({
    where: {
      isAnonymous: false,
      donorName: { not: null }
    },
    orderBy: { createdAt: "desc" },
    take: 10
  })
  return donations
}

export default async function Home() {
  const content = await getContent()
  const donations = await getDonations()

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return <LandingPage content={content} recentDonations={donations} />
}
