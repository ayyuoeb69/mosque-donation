import { prisma } from "@/lib/prisma"
import LandingPage from "@/components/landing/LandingPage"
import StructuredData from "@/components/StructuredData"
import { Metadata } from "next"

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

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  
  if (!content) {
    return {
      title: "Donasi Masjid - Membangun Rumah Ibadah Bersama",
      description: "Bergabunglah membangun masjid yang indah untuk menjadi pusat ibadah, berkumpul komunitas, dan pendidikan Islam."
    }
  }

  const progressPercentage = Math.round((content.currentAmount / content.goal) * 100)
  
  return {
    title: `${content.title} - Donasi Masjid`,
    description: `${content.description} Target: Rp ${content.goal.toLocaleString('id-ID')}, Terkumpul: Rp ${content.currentAmount.toLocaleString('id-ID')} (${progressPercentage}%)`,
    keywords: [
      "donasi masjid",
      "pembangunan masjid", 
      "infak sedekah",
      "zakat masjid",
      "fundraising masjid",
      "wakaf masjid",
      content.title
    ],
    openGraph: {
      title: content.title,
      description: content.description,
      type: "website",
      locale: "id_ID",
      images: content.bannerImageUrl ? [
        {
          url: content.bannerImageUrl,
          width: 1200,
          height: 630,
          alt: content.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: content.bannerImageUrl ? [content.bannerImageUrl] : undefined,
    },
    alternates: {
      canonical: "/"
    }
  }
}

export default async function Home() {
  const content = await getContent()
  const donations = await getDonations()

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <>
      <StructuredData content={content} />
      <LandingPage content={content} recentDonations={donations} />
    </>
  )
}
