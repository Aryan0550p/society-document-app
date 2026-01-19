import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
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

    // Delete file
    try {
      const filePath = path.join(process.cwd(), "uploads", document.userId, document.fileName);
      await unlink(filePath);
    } catch (fileError) {
      console.error("File deletion error:", fileError);
    }

    // Delete database record
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
