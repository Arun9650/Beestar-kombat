import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, taskId } = await request.json();

    if (!userId || !taskId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId or taskId' }, { status: 400 });
    }

    const task = await prisma.youTube.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ status: 'invalidTask', message: 'Task not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { chatId: userId } });
    if (!user) {
      return NextResponse.json({ status: 'userNotExist', message: 'User not found' }, { status: 404 });
    }
   // Check if the user has already completed the task
   const existingCompletion = await prisma.youTubeCompletion.findFirst({
    where: {
      userId: userId,
      taskId: taskId,
    },
  });

  if (existingCompletion) {
    return NextResponse.json(
      { status: 'alreadyCompleted', message: 'Task has already been completed by the user' },
      { status: 409 }
    );
  }
  

    await prisma.youTubeCompletion.create({
      data: {
        points: task.points,
        taskId,
        userId,
      },
    });

    await prisma.user.update({
      where: { chatId: userId },
      data: {
        points: {
          increment: task.points,
        },
      },
    });

    return NextResponse.json({ status: 'success', message: 'Task completed successfully' }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'unknownError', message: 'An unknown error occurred' }, { status: 500 });
  }
}
