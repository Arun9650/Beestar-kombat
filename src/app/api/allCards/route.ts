import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId' }, { status: 400 });
    }

    // Fetch all cards
    const allCards = await prisma.card.findMany();

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
      (card) => userCardsMap.get(card.id) || card
    );

    return NextResponse.json({ status: 'success', combinedCards, user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ status: 'error', message: 'Could not fetch cards' }, { status: 500 });
  }
}
