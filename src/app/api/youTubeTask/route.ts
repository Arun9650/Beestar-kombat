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

    // Fetch all tasks
    const allTasks = await prisma.youTube.findMany();

    // Fetch user's tasks
    const userTasks = await prisma.youTubeCompletion.findMany({
      where: { userId },
      include: { task: true },
    });

    // Create a map of user tasks for quick lookup
    const userTasksMap = new Map(userTasks.map(userTask => [userTask.taskId, userTask]));

    // Combine tasks and add a property to indicate if it belongs to the user
    const combinedTasks = allTasks.map(task => {
      const userTask = userTasksMap.get(task.id);
      return {
        ...task,
        isUserTask: !!userTask, // Add isUserTask property
        userTaskDetails: userTask ? userTask : null // Optionally add user task details
      };
    });

    return NextResponse.json({ status: 'success', tasks: combinedTasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ status: 'error', message: 'Could not fetch tasks' }, { status: 500 });
  }
}
