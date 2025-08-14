import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Update progress image
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Tidak terauthorisasi' },
        { status: 401 }
      )
    }

    const { id } = await params
    const data = await request.json()
    const { imageUrl, caption, description, date } = data

    if (!caption || !date) {
      return NextResponse.json(
        { error: 'Field wajib tidak lengkap: judul dan tanggal diperlukan' },
        { status: 400 }
      )
    }

    const updateData: any = {
      caption,
      description: description || null,
      date: new Date(date)
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl
    }

    const progressImage = await prisma.progressImage.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(progressImage)
  } catch (error) {
    console.error('Error updating progress image:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

// DELETE - Delete progress image (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Tidak terauthorisasi' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.progressImage.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting progress image:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}