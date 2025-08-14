import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Public endpoint to fetch progress images for landing page
export async function GET() {
  try {
    const images = await prisma.progressImage.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        imageUrl: true,
        caption: true,
        description: true,
        date: true
      }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching progress images:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}