import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Get all donation confirmations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const confirmations = await prisma.donationRecap.findMany({
      select: {
        id: true,
        donationId: true,
        donorName: true,
        donorEmail: true,
        donorPhone: true,
        transferProof: true,
        notes: true,
        isVerified: true,
        isRejected: true,
        verifiedAt: true,
        verifiedBy: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(confirmations)
  } catch (error) {
    console.error("Error fetching confirmations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Verify/Update confirmation status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, action } = await request.json()

    if (typeof id !== "string" || typeof action !== "string") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    if (!["verify", "reject", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const isVerified = action === "verify"
    const isRejected = action === "reject"

    // Get the previous verification status BEFORE updating
    const previousRecord = await prisma.donationRecap.findUnique({
      where: { id },
      select: { isVerified: true, isRejected: true }
    })

    if (!previousRecord) {
      return NextResponse.json({ error: "Confirmation not found" }, { status: 404 })
    }

    const updatedConfirmation = await prisma.donationRecap.update({
      where: { id },
      data: {
        isVerified,
        isRejected,
        verifiedAt: (isVerified || isRejected) ? new Date() : null,
        verifiedBy: (isVerified || isRejected) ? session?.user?.email || "admin" : null
      }
    })

    // Update donor count based on verification status change
    if (previousRecord && previousRecord.isVerified !== isVerified) {
      const content = await prisma.mosqueContent.findFirst({
        where: { isActive: true }
      })

      if (content) {
        const countChange = isVerified ? 1 : -1
        await prisma.mosqueContent.update({
          where: { id: content.id },
          data: {
            donorCount: Math.max(0, content.donorCount + countChange) // Ensure count doesn't go below 0
          }
        })
      }
    }

    return NextResponse.json(updatedConfirmation)
  } catch (error) {
    console.error("Error updating confirmation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}