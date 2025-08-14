import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Upload API called ===")
    
    // Check authentication
    let session
    try {
      session = await getServerSession(authOptions)
      console.log("Session check passed:", !!session)
    } catch (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ error: "Session validation failed" }, { status: 500 })
    }
    
    if (!session) {
      console.log("No session found, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    let data, file, type
    try {
      data = await request.formData()
      file = data.get('file') as unknown as File
      type = data.get('type') as string
      console.log("Form data parsed:", { fileName: file?.name, fileType: file?.type, uploadType: type })
    } catch (formError) {
      console.error("Form data error:", formError)
      return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // File validations
    const maxSize = type === "proposal" ? 5 * 1024 * 1024 : 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    if (type === "proposal" && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed for proposals" }, { status: 400 })
    }

    // Process file
    let bytes, buffer
    try {
      bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
      console.log("File processed successfully, size:", buffer.length)
    } catch (fileError) {
      console.error("File processing error:", fileError)
      return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
    }

    // File upload (cloud or local)
    let imageUrl: string
    
    try {
      // Use Cloudinary in production, local storage in development
      if (process.env.NODE_ENV === 'production' && process.env.CLOUDINARY_CLOUD_NAME) {
        console.log("Uploading to Cloudinary...")
        imageUrl = await uploadToCloudinary(file, `mosque-donation/${type}`)
        console.log("Cloudinary upload successful:", imageUrl)
      } else {
        // Local file storage for development
        console.log("Using local file storage...")
        const filename = `${type}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        const filepath = path.join(uploadsDir, filename)
        
        console.log("File paths:", { uploadsDir, filepath })

        if (!existsSync(uploadsDir)) {
          console.log("Creating uploads directory")
          await mkdir(uploadsDir, { recursive: true })
        }

        await writeFile(filepath, buffer)
        console.log("File written successfully")
        imageUrl = `/uploads/${filename}`
      }

      console.log("Starting database operations...")
      
      try {
        // Skip database update for progress images (handled separately)
        if (type !== "progress") {
          const content = await prisma.mosqueContent.findFirst({
            where: { isActive: true }
          })
          console.log("Found content:", !!content, content?.id)

          if (!content) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 })
          }

          const updateData: any = {}
          if (type === "logo") updateData.logoUrl = imageUrl
          if (type === "banner") updateData.bannerImageUrl = imageUrl  
          if (type === "qr") updateData.qrCodeUrl = imageUrl
          if (type === "before") updateData.beforeRenovationImageUrl = imageUrl
          if (type === "after") updateData.afterRenovationImageUrl = imageUrl
          if (type === "proposal") updateData.proposalPdfUrl = imageUrl

          console.log("Update data:", updateData)

          const updatedContent = await prisma.mosqueContent.update({
            where: { id: content.id },
            data: updateData
          })
          
          console.log("Database updated successfully:", updatedContent.id)
        } else {
          console.log("Skipping database update for progress image")
        }
        
        return NextResponse.json({ url: imageUrl })
        
      } catch (dbError) {
        console.error("Database operation failed:", dbError)
        throw dbError // Re-throw to be caught by outer catch
      }
      
    } catch (fsError) {
      console.error("File system or database error:", fsError)
      return NextResponse.json({ error: "File system operation failed" }, { status: 500 })
    }

  } catch (error) {
    console.error("=== UPLOAD ERROR ===", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}