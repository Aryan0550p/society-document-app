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

    // Fetch PDF from Cloudinary
    const response = await fetch(document.fileUrl);
    const pdfBuffer = await response.arrayBuffer();

    // Serve with proper headers to open in browser
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.fileName}"`,
      },
    });
  } catch (error) {
    console.error("View document error:", error);
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}
