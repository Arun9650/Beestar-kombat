import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import redis from '@/lib/redis';

const prisma = new PrismaClient();

interface Task {
  id: string;
  category: string;
  name: string;
  points: number;
  link: string;
  icon: string;
}

interface UserTask {
  taskId: string;
  userId: string;
  // Add other user task properties as needed
}

interface CombinedTask extends Task {
  isUserTask: boolean;
  userTaskDetails: UserTask | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'Missing userId' },
        { status: 400 }
      );
    }

    // Redis keys
    const allTasksKey = 'allTasks';
    const userTasksKey = `userTasks:${userId}`;

    // Fetch all tasks from Redis or database
    let allTasks: Task[] = [];
    let isNewTask = false;
    let previousTaskCount = 0;
    const cachedAllTasks = await redis.get(allTasksKey);
    
    if (cachedAllTasks) {
      allTasks = JSON.parse(cachedAllTasks) as Task[];
      previousTaskCount = allTasks.length;
      console.log('Fetched allTasks from Redis');
    } else {
      // Store the previous count before fetching new data
      const cachedCount = await redis.get(`${allTasksKey}:count`);
      previousTaskCount = cachedCount ? parseInt(cachedCount) : 0;

      allTasks = await prisma.tasks.findMany() as Task[];
      
      // Compare counts to check for new tasks
      isNewTask = allTasks.length > previousTaskCount;
      
      // Cache both the tasks and the count
      await redis.set(allTasksKey, JSON.stringify(allTasks), 'EX', 3600);
      await redis.set(`${allTasksKey}:count`, allTasks.length.toString(), 'EX', 3600);
      console.log('Fetched allTasks from database and cached');
    }

    // Fetch user tasks from Redis or database
    let userTasks: UserTask[] = [];
    const cachedUserTasks = await redis.get(userTasksKey);
    
    if (cachedUserTasks) {
      userTasks = JSON.parse(cachedUserTasks) as UserTask[];
      console.log(`Fetched userTasks for userId ${userId} from Redis`);
    } else {
      let previousUserTaskCount = 0;
      const cachedUserCount = await redis.get(`${userTasksKey}:count`);
      previousUserTaskCount = cachedUserCount ? parseInt(cachedUserCount) : 0;

      userTasks = await prisma.tasksCompletion.findMany({
        where: { userId }
      }) as UserTask[];

      // Check for new tasks in multiple scenarios:
      // 1. If we fetched from DB and there are fewer user tasks than before
      // 2. If we fetched from DB and isNewTask is already true
      // 3. If the total number of tasks is greater than user completed tasks
      if (userTasks.length < previousUserTaskCount || 
          isNewTask || 
          allTasks.length > userTasks.length) {
        const userTaskIds = new Set(userTasks.map((userTask) => userTask.taskId));
        isNewTask = allTasks.some((task) => !userTaskIds.has(task.id));
      }

      await redis.set(userTasksKey, JSON.stringify(userTasks), 'EX', 3600);
      await redis.set(`${userTasksKey}:count`, userTasks.length.toString(), 'EX', 3600);
      console.log(`Fetched userTasks for userId ${userId} from database and cached`);
    }

    // Always check if there are uncompleted tasks when fetching from DB
    if (!cachedAllTasks || !cachedUserTasks) {
      isNewTask = isNewTask || (allTasks.length > userTasks.length);
    }

    // Create a map of user tasks for quick lookup
    const userTasksMap = new Map(
      userTasks.map((userTask) => [userTask.taskId, userTask])
    );

    // Combine tasks and add a property to indicate if it belongs to the user
    const combinedTasks: CombinedTask[] = allTasks.map((task) => {
      const userTask = userTasksMap.get(task.id);
      return {
        ...task,
        isUserTask: !!userTask,
        userTaskDetails: userTask || null,
      };
    });

    return NextResponse.json(
      { 
        status: 'success', 
        tasks: combinedTasks, 
        isNewTask,
        totalTasks: allTasks.length,
        completedTasks: userTasks.length,
        previousTaskCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in TaskToShow API:', error);
    return NextResponse.json(
      { status: 'error', message: 'Could not fetch tasks' },
      { status: 500 }
    );
  }
}