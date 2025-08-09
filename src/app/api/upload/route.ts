import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${type}-${Date.now()}-${file.name}`
    const filepath = path.join(process.cwd(), "public/uploads", filename)

    await writeFile(filepath, buffer)

    // Update database with new image URL
    const imageUrl = `/uploads/${filename}`
    
    const content = await prisma.mosqueContent.findFirst({
      where: { isActive: true }
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    const updateData: any = {}
    if (type === "logo") updateData.logoUrl = imageUrl
    if (type === "banner") updateData.bannerImageUrl = imageUrl
    if (type === "qr") updateData.qrCodeUrl = imageUrl
    if (type === "before") updateData.beforeRenovationImageUrl = imageUrl
    if (type === "after") updateData.afterRenovationImageUrl = imageUrl

    await prisma.mosqueContent.update({
      where: { id: content.id },
      data: updateData
    })

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}