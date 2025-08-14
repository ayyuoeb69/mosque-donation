interface MosqueContent {
  title: string
  description: string
  goal: number
  currentAmount: number
  donorCount: number
  logoUrl?: string | null
  bannerImageUrl?: string | null
}

interface StructuredDataProps {
  content: MosqueContent
}

export default function StructuredData({ content }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": content.title,
    "description": content.description,
    "url": baseUrl,
    "logo": content.logoUrl ? `${baseUrl}${content.logoUrl}` : undefined,
    "image": content.bannerImageUrl ? `${baseUrl}${content.bannerImageUrl}` : undefined,
    "sameAs": [],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID"
    }
  }

  const fundraisingData = {
    "@context": "https://schema.org",
    "@type": "MonetaryGrant",
    "name": content.title,
    "description": content.description,
    "amount": {
      "@type": "MonetaryAmount",
      "currency": "IDR",
      "value": content.goal
    },
    "funder": {
      "@type": "Organization", 
      "name": "Komunitas Donatur"
    },
    "recipient": {
      "@type": "Organization",
      "name": content.title
    }
  }

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": content.title,
    "url": baseUrl,
    "description": content.description,
    "inLanguage": "id-ID"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fundraisingData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
    </>
  )
}