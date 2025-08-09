import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { amount, donorName, donorEmail, message, isAnonymous } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount,
        donorName: isAnonymous ? null : donorName,
        donorEmail: isAnonymous ? null : donorEmail,
        message,
        isAnonymous
      }
    })

    // Update the current amount in mosque content
    const content = await prisma.mosqueContent.findFirst({
      where: { isActive: true }
    })

    if (content) {
      await prisma.mosqueContent.update({
        where: { id: content.id },
        data: {
          currentAmount: content.currentAmount + amount
        }
      })
    }

    return NextResponse.json({ success: true, donationId: donation.id })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}