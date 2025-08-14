import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const content = await prisma.mosqueContent.findFirst({
      where: { isActive: true }
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received payload:", JSON.stringify(body, null, 2))
    
    const { 
      title, 
      description, 
      goal, 
      currentAmount, 
      donorCount, 
      beforeRenovationDesc, 
      afterRenovationDesc, 
      bankName, 
      accountNumber, 
      accountName,
      whatsappUrl,
      emailContact,
      instagramUrl,
      twitterUrl,
      tiktokUrl
    } = body

    // Convert empty strings to null for optional fields
    const processedData = {
      title,
      description,
      goal: Number(goal),
      currentAmount: Number(currentAmount),
      donorCount: Number(donorCount),
      beforeRenovationDesc: beforeRenovationDesc || null,
      afterRenovationDesc: afterRenovationDesc || null,
      bankName: bankName || null,
      accountNumber: accountNumber || null,
      accountName: accountName || null,
      whatsappUrl: whatsappUrl || null,
      emailContact: emailContact || null,
      instagramUrl: instagramUrl || null,
      twitterUrl: twitterUrl || null,
      tiktokUrl: tiktokUrl || null
    }

    console.log("Processed data:", JSON.stringify(processedData, null, 2))

    const content = await prisma.mosqueContent.findFirst({
      where: { isActive: true }
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    console.log("Updating content with ID:", content.id)
    
    const updatedContent = await prisma.mosqueContent.update({
      where: { id: content.id },
      data: processedData
    })
    
    console.log("Update successful:", updatedContent.id)

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error("Error in PUT /api/admin/content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}