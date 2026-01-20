import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Redirect to Cloudinary URL
    return NextResponse.redirect(document.fileUrl);
  } catch (error) {
    console.error("View document error:", error);
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
