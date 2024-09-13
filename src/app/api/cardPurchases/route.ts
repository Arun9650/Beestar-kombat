import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma setup
import { Team } from '@/components/tasks/TaskList';

export async function POST(request: Request) {
  try {
    const { id, selectedTeam, points }: { id: string; selectedTeam: Team; points: number } = await request.json();

    if (!id || !selectedTeam) {
      return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 400 });
    }

    // Fetch user and their purchased card in parallel
    const [user, purchaseCard] = await Promise.all([
      prisma.user.findUnique({ where: { chatId: id } }),
      prisma.userCard.findUnique({ where: { id: selectedTeam.id } }),
    ]);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Calculate new values
    const increasedBaseCost = Math.floor(selectedTeam.baseCost * 2.5);
    const increasedBasePPH = Math.floor(selectedTeam.basePPH * 1.05);
    const remainingPoints = points - selectedTeam.baseCost;
    console.log('🚀 ~ POST ~ selectedTeam.baseCost:', selectedTeam.baseCost);
    console.log('🚀 ~ POST ~ user.points:', user.points);

    // Ensure the user's points do not go below zero
    if (remainingPoints < 0) {
      return NextResponse.json({ success: false, message: 'Insufficient points to complete the transaction' }, { status: 400 });
    }

    if (purchaseCard) {
      // Update the user's card and points
      const updatedUser = await prisma.$transaction([
        prisma.user.update({
          where: { chatId: id },
          data: {
            profitPerHour: { increment: selectedTeam.basePPH },
            points: remainingPoints,
            lastProfitDate: Math.floor(Date.now() / 1000),
            lastLogin: new Date(),
          },
        }),
        prisma.userCard.update({
          where: { id: selectedTeam.id },
          data: {
            baseLevel: { increment: 1 },
            basePPH: increasedBasePPH,
            baseCost: increasedBaseCost,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: 'Card updated successfully',
        user: updatedUser[0],
        userCard: updatedUser[1],
      });
    } else {
      // Create a new card and update the user
      const updatedUser = await prisma.$transaction([
        prisma.userCard.create({
          data: {
            cardId: selectedTeam.id,
            title: selectedTeam.title,
            image: selectedTeam.image,
            baseLevel: 1,
            basePPH: increasedBasePPH,
            baseCost: increasedBaseCost,
            userId: id,
            category: selectedTeam.category,
          },
        }),
        prisma.user.update({
          where: { chatId: id },
          data: {
            profitPerHour: { increment: selectedTeam.basePPH },
            points: remainingPoints,
            lastProfitDate: Math.floor(Date.now() / 1000),
            lastLogin: new Date(),
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: 'Card created and user updated successfully',
        user: updatedUser[1],
        userCard: updatedUser[0],
      });
    }
  } catch (e) {
    console.error('Error updating profit per hour:', e);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the profit per hour' },
      { status: 500 }
    );
  }
}
