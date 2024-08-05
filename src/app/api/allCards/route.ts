import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const cards = await prisma.card2.findMany();

    return NextResponse.json({ status: 200, cards });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
}
