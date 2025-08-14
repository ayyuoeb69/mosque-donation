import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const donationId = data.get('donationId') as string
    const donorName = data.get('donorName') as string
    const donorEmail = data.get('donorEmail') as string || undefined
    const donorPhone = data.get('donorPhone') as string || undefined
    const notes = data.get('notes') as string || undefined
    const transferProofFile = data.get('transferProof') as File | null

    if (!donationId || !donorName) {
      return NextResponse.json({ error: "Donation ID and donor name are required" }, { status: 400 })
    }

    let transferProofUrl: string | undefined

    // Handle file upload if provided
    if (transferProofFile) {
      try {
        transferProofUrl = await uploadToCloudinary(transferProofFile, 'mosque-donation/transfer-proofs')
      } catch (uploadError) {
        console.error("File upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload transfer proof" }, { status: 500 })
      }
    }

    // Create donation recap record
    const recap = await prisma.donationRecap.create({
      data: {
        donationId,
        donorName,
        donorEmail,
        donorPhone,
        transferProof: transferProofUrl,
        notes
      }
    })

    return NextResponse.json({ success: true, recapId: recap.id })
  } catch (error) {
    console.error("Donation recap error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}