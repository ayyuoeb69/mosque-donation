import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const offset = (page - 1) * limit;

    // Get total count for pagination info
    const totalPrayers = await prisma.donationRecap.count({
      where: {
        isVerified: true,
        notes: {
          not: "",
        },
      },
    });

    const prayers = await prisma.donationRecap.findMany({
      where: {
        isVerified: true,
        notes: {
          not: "",
        },
      },
      select: {
        id: true,
        donorName: true,
        notes: true,
        verifiedAt: true,
      },
      orderBy: {
        verifiedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(totalPrayers / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      prayers,
      pagination: {
        currentPage: page,
        totalPages,
        totalPrayers,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
