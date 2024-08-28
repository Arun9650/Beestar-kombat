import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

    const body = await req.json();

    const { userId,newLevel } = body;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    
   const user =  await prisma.user.update({
      where: { chatId: userId },
      data: {
        league: newLevel
      },
    });

    return NextResponse.json({  user: user, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}