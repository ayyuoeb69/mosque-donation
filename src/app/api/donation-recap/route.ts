import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

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
      const bytes = await transferProofFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = `transfer-proof-${Date.now()}-${transferProofFile.name}`
      const filepath = path.join(process.cwd(), "public/uploads", filename)

      await writeFile(filepath, buffer)
      transferProofUrl = `/uploads/${filename}`
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