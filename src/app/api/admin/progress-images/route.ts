import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all progress images
export async function GET() {
  try {
    const images = await prisma.progressImage.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching progress images:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// POST - Create new progress image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Tidak terauthorisasi' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { imageUrl, caption, description, date } = data

    if (!imageUrl || !caption || !date) {
      return NextResponse.json(
        { error: 'Field wajib tidak lengkap: URL foto, judul, dan tanggal diperlukan' },
        { status: 400 }
      )
    }

    console.log('Creating progress image with data:', { imageUrl, caption, description, date })
    
    // Validate date format
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Format tanggal tidak valid' },
        { status: 400 }
      )
    }

    const progressImage = await prisma.progressImage.create({
      data: {
        imageUrl,
        caption,
        description: description || null,
        date: parsedDate
      }
    })
    
    console.log('Progress image created successfully:', progressImage.id)

    return NextResponse.json(progressImage)
  } catch (error) {
    console.error('Error creating progress image:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}