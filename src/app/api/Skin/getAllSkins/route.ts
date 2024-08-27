import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, res: NextResponse) {
  try {
    // Use request.nextUrl to safely access search params
    const searchParams = request.nextUrl.searchParams
    const user  = searchParams.get('id');

    if (!user) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 });
    }

    const acct = await prisma.user.findUnique({ where: { chatId: user } });

    if (!acct) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userSkins = await prisma.userSkin.findMany({
      where: { userId: user },
    }) || [];

    const allSkins = await prisma.skins.findMany();

    const userSkinsMap = new Map(userSkins.map((skin) => [skin.skinId, skin]));

    const combinedSkins = allSkins.map((skin) => ({
      ...skin,
      owned: userSkinsMap.has(skin.id),
    }));

    

// Sort combinedSkins in ascending order by 'league'
combinedSkins.sort((a, b) => a.cost - b.cost);

    return NextResponse.json(combinedSkins, { status: 200 });
  } catch (error) {
    console.error('Error fetching user skin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
