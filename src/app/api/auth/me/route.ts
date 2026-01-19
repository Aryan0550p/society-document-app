import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        flatNumber: session.user.flatNumber,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
