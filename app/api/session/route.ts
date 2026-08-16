import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    loggedIn: false,
    user: null,
  });
}