import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const title = formData.get("title") as string;
    const documentType = formData.get("documentType") as string;
    const description = formData.get("description") as string;
    const shareholding = formData.get("shareholding") as string;

    if (!file || !userId || !title || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `society-documents/${userId}`,
          resource_type: "raw", // Use "raw" for PDFs and documents
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`, // Remove extension from name
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Create database record
    const document = await prisma.document.create({
      data: {
        title,
        documentType,
        description: description || null,
        shareholding: shareholding || null,
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
        fileSize: file.size,
        mimeType: file.type,
        userId,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Fetch documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
