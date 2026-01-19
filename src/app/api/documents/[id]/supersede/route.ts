import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(
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

    // Load the PDF
    const filePath = path.join(process.cwd(), "uploads", document.userId, document.fileName);
    const existingPdfBytes = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Add digital stamp to first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // Add semi-transparent red stamp
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const stampText = "SUPERSEDED";
    const stampDate = new Date().toLocaleDateString();
    
    firstPage.drawRectangle({
      x: width / 2 - 150,
      y: height / 2 - 50,
      width: 300,
      height: 100,
      borderColor: rgb(0.8, 0, 0),
      borderWidth: 3,
      color: rgb(1, 0.9, 0.9),
      opacity: 0.7,
    });

    firstPage.drawText(stampText, {
      x: width / 2 - 80,
      y: height / 2 + 10,
      size: 36,
      font,
      color: rgb(0.8, 0, 0),
    });

    firstPage.drawText(stampDate, {
      x: width / 2 - 50,
      y: height / 2 - 20,
      size: 16,
      font,
      color: rgb(0.5, 0, 0),
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();
    await writeFile(filePath, pdfBytes);

    // Update database
    await prisma.document.update({
      where: { id },
      data: {
        isSuperseded: true,
        supersededDate: new Date(),
        status: "SUPERSEDED",
      },
    });

    return NextResponse.json({ message: "Document superseded successfully" });
  } catch (error) {
    console.error("Supersede document error:", error);
    return NextResponse.json({ error: "Failed to supersede document" }, { status: 500 });
  }
}
