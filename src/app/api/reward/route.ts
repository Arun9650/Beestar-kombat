import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma setup
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    // Use request.nextUrl to safely access search params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("userid");

    if (!id) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 }
      );
    }
    // Fetch the user and check existence
    const userExists = await prisma.user.findUnique({
      where: { chatId: id },
      select: { chatId: true }, // Only check for existence
    });

    if (!userExists) {
      return NextResponse.json(
        { status: "error", message: "User does not exist" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { chatId: id },
      data: {
        points: { increment: 5000 },
      },
    });

    // Return success response immediately after update
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Failed to update points:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
