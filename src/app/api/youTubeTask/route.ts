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

    // Redis cache key for all tasks
    const cacheKey = 'allTasks';
    let allTasks;

    // Try to get tasks from Redis
    const cachedTasks = await redis.get(cacheKey);
    if (cachedTasks) {
      console.log('Fetching tasks from Redis cache');
      allTasks = JSON.parse(cachedTasks);
    } else {
      console.log('Fetching tasks from the database');
      // Fetch all tasks from the database if not cached
      allTasks = await prisma.youTube.findMany();

      // Cache the result in Redis for future requests (e.g., 1 hour)
      await redis.set(cacheKey, JSON.stringify(allTasks), 'EX', 3600);
    }

    // Fetch user's tasks from the database
    const userTasks = await prisma.youTubeCompletion.findMany({
      where: { userId },
      include: { task: true },
    });

    // Create a map of user tasks for quick lookup
    const userTasksMap = new Map(userTasks.map(userTask => [userTask.taskId, userTask]));

    // Combine tasks and add a property to indicate if it belongs to the user
    const combinedTasks = allTasks.map((task:any) => {
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
