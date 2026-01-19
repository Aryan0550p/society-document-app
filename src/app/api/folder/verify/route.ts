import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { folderPassword: true },
    });

    if (!user || !user.folderPassword) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.folderPassword);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Password verified" });
  } catch (error) {
    console.error("Folder verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
