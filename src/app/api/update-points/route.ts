import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma setup

export async function POST(request: Request) {
  try {
    const { points, id } = await request.json();

    // Input validation
    if (typeof points !== 'number' || typeof id !== 'string') {
      return NextResponse.json({ status: 'error', message: 'Invalid input' }, { status: 400 });
    }

    // Fetch the user and check existence
    const userExists = await prisma.user.findUnique({
      where: { chatId: id },
      select: { chatId: true }, // Only check for existence
    });

    if (!userExists) {
      return NextResponse.json({ status: 'error', message: 'User does not exist' }, { status: 404 });
    }

    // If points > 0, update the user
    if (points > 0) {
      await prisma.user.update({
        where: { chatId: id },
        data: {
          points,
          lastProfitDate: Math.floor(Date.now() / 1000), // Store as Unix timestamp (seconds)
          lastLogin: new Date(),
        },
      });
    }

    // Return success response immediately after update
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to update points:', error);
    return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
  }
}
