import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import redis from '@/lib/redis';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId' }, { status: 400 });
    }

    const allCardsCacheKey = 'allCards';
    const userCardsCacheKey = `userCards:${userId}`;
    let allCards;
    let userCards;

    // Check if allCards is cached in Redis
    const cachedAllCards = await redis.get(allCardsCacheKey);
    if (cachedAllCards) {
      console.log('Data served from Redis cache for allCards');
      allCards = JSON.parse(cachedAllCards);
    } else {
      console.log('Cache miss for allCards - fetching from MongoDB');
      allCards = await prisma.card.findMany();
      await redis.set(allCardsCacheKey, JSON.stringify(allCards), 'EX', 86400); // Cache for 1 day
    }

    // Check if userCards is cached in Redis
    const cachedUserCards = await redis.get(userCardsCacheKey);
    if (cachedUserCards) {
      console.log('Data served from Redis cache for userCards');
      userCards = JSON.parse(cachedUserCards);
    } else {
      console.log('Cache miss for userCards - fetching from MongoDB');
      userCards = await prisma.userCard.findMany({ where: { userId } });
      await redis.set(userCardsCacheKey, JSON.stringify(userCards), 'EX', 86400); // Cache for 1 day
    }

    
    // Combine allCards and userCards
    const userCardsMap = new Map(userCards.map((card:any) => [card.cardId, card]));
    const combinedCards = allCards.map((card: any) => userCardsMap.get(card.id) || card);

    return NextResponse.json({ status: 'success', combinedCards }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ status: 'error', message: 'Could not fetch cards' }, { status: 500 });
  }
}
