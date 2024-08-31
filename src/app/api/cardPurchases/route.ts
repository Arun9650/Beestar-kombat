import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma setup
import { Team } from '@/components/tasks/TaskList';

export async function POST(request: Request) {
  try {
    const { id, selectedTeam }: { id: string; selectedTeam: Team } = await request.json();

    if (!id || !selectedTeam) {
      return NextResponse.json({ success: false, message: 'Invalid request data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { chatId: id } });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const purchaseCard = await prisma.userCard.findUnique({
      where: { id: selectedTeam.id },
    });

    const increasedBaseCost = Math.floor(selectedTeam.baseCost * 2.5);
    const increasedBasePPH = Math.floor(selectedTeam.basePPH * 1.05);
    const remainingPoints = Math.max(user.points - selectedTeam.baseCost, 0);

    if (purchaseCard && remainingPoints > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { chatId: id },
          data: {
            profitPerHour: { increment: selectedTeam.basePPH },
            points: remainingPoints,
            lastProfitDate: Date.now(),
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

      return NextResponse.json({ success: true, message: 'Card updated successfully' });
    } else {
      const increasedBaseCost = selectedTeam.baseCost * 2.5;
      const increasedBasePPH = selectedTeam.basePPH * 1.05;

      await prisma.userCard.create({
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
      });

      await prisma.user.update({
        where: { chatId: id },
        data: {
          profitPerHour: { increment: selectedTeam.basePPH },
          points: { decrement: selectedTeam.baseCost },
        },
      });

      return NextResponse.json({ success: true, message: 'Card created and user updated successfully' });
    }
  } catch (e) {
    console.error('Error updating profit per hour:', e);
    return NextResponse.json({ success: false, message: 'An error occurred while updating the profit per hour' }, { status: 500 });
  }
}
