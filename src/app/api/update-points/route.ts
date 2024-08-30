import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma setup

// The function you've provided, slightly modified for use in an API context
async function updatePointsInDB({
  points,
  id,
}: {
  points: number;
  id: string;
}): Promise<"success" | "unknownError" | "userNotExist"> {
  try {
    const user = await prisma.user.findUnique({ where: { chatId: id } });

    if (!user) return "userNotExist";

    if (points > 0) {
      await prisma.user.update({
        where: { chatId: id },
        data: {
          points: points,
          lastProfitDate: Date.now(), // Changed to a new Date object
          lastLogin: new Date(),
        },
      });
    }

    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}

// API Route handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { points, id } = body;

    if (typeof points !== 'number' || typeof id !== 'string') {
      return NextResponse.json({ status: 'error', message: 'Invalid input' }, { status: 400 });
    }

    const result = await updatePointsInDB({ points, id });

    if (result === "userNotExist") {
      return NextResponse.json({ status: 'error', message: 'User does not exist' }, { status: 404 });
    } else if (result === "unknownError") {
      return NextResponse.json({ status: 'error', message: 'An unknown error occurred' }, { status: 500 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to update points:', error);
    return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
  }
}
