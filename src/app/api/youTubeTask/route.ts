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

    // Redis cache keys
    const cacheKey = 'youtubetask';
    const previousTasksCacheKey = 'previous_youtubetask';

    // Retrieve cached tasks or fetch from the database
    const cachedTasks = await redis.get(cacheKey);
    const allTasks = cachedTasks
    ? JSON.parse(cachedTasks)
    : await prisma.youTube.findMany().then(async (tasks) => {
      await redis.set(cacheKey, JSON.stringify(tasks), 'EX', 36); // Cache for 1 hour
      return tasks;
    });
    
    console.log("🚀 ~ GET ~ allTasks:", allTasks)

    // Retrieve previous tasks to check for new entries
    const previousTasks = JSON.parse((await redis.get(previousTasksCacheKey)) || '[]');
    const previousTaskIds = new Set(previousTasks.map((task: any) => task.id));

    const isNewTaskAdded = allTasks.some((task: any) => !previousTaskIds.has(task.id));
    console.log("🚀 ~ GET ~ isNewTaskAdded:", isNewTaskAdded)

    // Update previous tasks cache if there are new tasks
    if (isNewTaskAdded) {
      await redis.set(previousTasksCacheKey, JSON.stringify(allTasks), 'EX', 36);
    }

    // Fetch user's tasks
    const userTasks = await prisma.youTubeCompletion.findMany({
      where: { userId },
      include: { task: true },
    });

    const userTaskMap = new Map(userTasks.map((userTask) => [userTask.taskId, userTask]));

    // Combine tasks with user task details
    const combinedTasks = allTasks.map((task: any) => ({
      ...task,
      isUserTask: userTaskMap.has(task.id),
      userTaskDetails: userTaskMap.get(task.id) || null,
    }));

    return NextResponse.json(
      { status: 'success', tasks: combinedTasks, isNewTaskAdded },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ status: 'error', message: 'Could not fetch tasks' }, { status: 500 });
  }
}
