import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Testing Prisma connection...")
    
    const content = await prisma.mosqueContent.findFirst({
      where: { isActive: true }
    })
    
    console.log("Found content:", !!content, content?.id)
    
    if (!content) {
      return NextResponse.json({ error: "No content found" }, { status: 404 })
    }
    
    // Test update with a simple field
    const updated = await prisma.mosqueContent.update({
      where: { id: content.id },
      data: { 
        proposalPdfUrl: "/test-url.pdf" 
      }
    })
    
    console.log("Update successful:", updated.id)
    
    return NextResponse.json({ 
      success: true, 
      contentId: content.id,
      proposalPdfUrl: updated.proposalPdfUrl 
    })
    
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json({ 
      error: "Test failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}