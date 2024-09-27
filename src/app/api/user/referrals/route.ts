import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userWithReferrals = await prisma.user.findFirst({
      where: { chatId: userId },
      take: 50,
      include: {
        referrals: true, // Include the referred users
      },
      
    });
    console.log("🚀 ~ GET ~ userWithReferrals:", userWithReferrals)

    if (!userWithReferrals) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userWithReferrals.referrals);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
