import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get('id');

    if (!user) {
      return NextResponse.json({ error: 'User parameter is required' }, { status: 400 });
    }

    const acct = await prisma.user.findUnique({ where: { chatId: user } });

    if (!acct) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Redis cache key for all skins
    const cacheKey = 'allSkins';
    let allSkins;

    // Attempt to retrieve all skins from Redis
    const cachedSkins = await redis.get(cacheKey);
    if (cachedSkins) {
      console.log('Fetching skins from Redis cache');
      allSkins = JSON.parse(cachedSkins);
    } else {
      console.log('Fetching skins from the database');
      // Fetch all skins from the database if not cached
      allSkins = await prisma.skins.findMany();

      // Cache the result in Redis for future requests (e.g., 24 hours)
      await redis.set(cacheKey, JSON.stringify(allSkins), 'EX', 86400);
    }

    // Fetch user's owned skins from the database
    const userSkins = await prisma.userSkin.findMany({
      where: { userId: user },
    }) || [];

    // Map user's owned skins for quick lookup
    const userSkinsMap = new Map(userSkins.map((skin) => [skin.skinId, skin]));

    // Combine skins and indicate ownership
    const combinedSkins = allSkins.map((skin:any) => ({
      ...skin,
      owned: userSkinsMap.has(skin.id),
    }));

    // Sort combinedSkins by 'cost' in ascending order
    combinedSkins.sort((a:any, b:any) => a.cost - b.cost);

    return NextResponse.json(combinedSkins, { status: 200 });
  } catch (error) {
    console.error('Error fetching user skin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
