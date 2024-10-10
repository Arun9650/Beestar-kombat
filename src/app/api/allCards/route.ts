import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import redis from '@/lib/redis';

const prisma = new PrismaClient();


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log("🚀 ~ GET ~ userId:", userId)

    if (!userId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId' }, { status: 400 });
    }

    const cacheKey = 'allCards';
    let allCards; 

    // Attempt to retrieve from Redis
    const cachedData = await redis.get(cacheKey);
    console.log("🚀 ~ GET ~ cachedData:", cachedData)
    if (cachedData) {
      // Parse the cached data as it was stored as a JSON string
      console.log('Data served from Redis cache');
      allCards = JSON.parse(cachedData);
    } else {
      // Fetch all cards from the database if not found in cache
      console.log('Cache miss - fetching data from MongoDB');
      allCards = await prisma.card.findMany();

      // Store the array of objects as a JSON string in Redis
      await redis.set(cacheKey, JSON.stringify(allCards), 'EX', 86400);
    }

    // Fetch user's purchased cards
    const userCards = await prisma.userCard.findMany({
      where: { userId },
    });

    // Update user information
    const user = await prisma.user.update({
      where: { chatId: userId },
      data: {
        lastLogin: new Date(),
      },
    });
    

    // Create a map of userCards for quick lookup
    const userCardsMap = new Map(userCards.map((card) => [card.cardId, card]));

    // Combine allCards and userCards
    const combinedCards = allCards.map(
      (card:any) => userCardsMap.get(card.id) || card
    );

    return NextResponse.json({ status: 'success', combinedCards, user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ status: 'error', message: 'Could not fetch cards' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'invalidateCache') {
      await redis.del('allCards'); // Invalidate the cache
      return NextResponse.json({ status: 'success', message: 'Cache invalidated' });
    }

    return NextResponse.json({ status: 'error', message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return NextResponse.json({ status: 'error', message: 'Could not invalidate cache' }, { status: 500 });
  }
}
