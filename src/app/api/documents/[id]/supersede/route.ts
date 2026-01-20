import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import cloudinary from "@/lib/cloudinary";

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

    // Download PDF from Cloudinary
    const response = await fetch(document.fileUrl);
    const existingPdfBytes = await response.arrayBuffer();
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
    const buffer = Buffer.from(pdfBytes);

    // Upload stamped version back to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `society-documents/${document.userId}`,
          resource_type: "raw", // Use "raw" for PDFs
          public_id: `superseded-${Date.now()}-${document.fileName.replace(/\.[^/.]+$/, "")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Update database with new stamped file URL
    await prisma.document.update({
      where: { id },
      data: {
        isSuperseded: true,
        supersededDate: new Date(),
        status: "SUPERSEDED",
        fileUrl: uploadResult.secure_url,
        stampImageUrl: uploadResult.secure_url,
      },
    });

    return NextResponse.json({ message: "Document superseded successfully" });
  } catch (error) {
    console.error("Supersede document error:", error);
    return NextResponse.json({ error: "Failed to supersede document" }, { status: 500 });
  }
}
