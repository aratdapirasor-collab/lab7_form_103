import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;

    // ยังไม่มี session
    if (!session) {
      return NextResponse.json({
        loggedIn: false,
        user: null,
      });
    }

    // ใช้ id จาก cookie ค้นหา user
    const user = await prisma.user.findUnique({
      where: {
        id: session,
      },
    });

    // ไม่พบ user
    if (!user) {
      return NextResponse.json({
        loggedIn: false,
        user: null,
      });
    }

    // พบ user = Login อยู่
    return NextResponse.json({
      loggedIn: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Session error:", error);

    return NextResponse.json(
      {
        loggedIn: false,
        user: null,
      },
      { status: 500 }
    );
  }
}