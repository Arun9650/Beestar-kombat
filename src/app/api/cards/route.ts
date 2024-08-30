import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma setup

// The provided function, slightly adjusted to handle API requests
export async function allCards(userId: string) {
  // Fetch all cards
  const allCards = await prisma.card.findMany();

  // Fetch user's purchased cards
  const userCards = await prisma.userCard.findMany({
    where: { userId },
  });

  const user = await prisma.user.update({
    where: { chatId: userId },
    data: {
      lastProfitDate: Date.now(), // Updated as a timestamp
      lastLogin: new Date(), // Correct Date type for lastLogin
    },
  });

  // Create a map of userCards for quick lookup
  const userCardsMap = new Map(userCards.map((card) => [card.cardId, card]));

  // Combine allCards and userCards
  const combinedCards = allCards.map(
    (card) => userCardsMap.get(card.id) || card
  );

  return { combinedCards, user };
}

// API Route handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId' }, { status: 400 });
    }

    const result = await allCards(userId);

    return NextResponse.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Failed to fetch cards:', error);
    return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
  }
}
