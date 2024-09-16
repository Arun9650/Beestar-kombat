"use server";

import prisma from "@/lib/prisma";

export type TasksList = {
  id?: string;
  category: string;
  name: string;
  points: number;
  icon: string;
};
export type CompletedTasksType = {
  id?: string;
  taskId: string;
  userId: string;
  reward: number;
};

export async function tasksList(): Promise<TasksList[] | []> {
  const tasks = await prisma.tasks.findMany();

  if (!tasks) return [];
  return tasks;
}

export async function completeTask({
  userId,
  taskId,
}: {
  userId: string;
  taskId: string;
}): Promise<"success" | "unknownError" | "invalidTask" | "userNotExist"> {
  try {
    const task = await prisma.tasks.findUnique({ where: { id: taskId } });
    if (!task) return "invalidTask";

    const user = await prisma.user.findUnique({ where: { chatId: userId } });
    if (!user) return "userNotExist";


    // Check if the user has already completed the task
    const existingCompletion = await prisma.tasksCompletion.findFirst({
      where: {
        userId: userId,
        taskId: taskId,
      },
    });

    if (existingCompletion) {
      return 'invalidTask'
    }

    await prisma.tasksCompletion.create({
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

    return "success";
  } catch (e) {
    console.log(e);
    return "unknownError";
  }
}


export async function TaskToShow(userId: string){
  try {
      // Fetch all tasks
      const allTasks = await prisma.tasks.findMany();

      // Fetch user's tasks
      const userTasks = await prisma.tasksCompletion.findMany({
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

    return combinedTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Could not fetch tasks');
  }
}

export async function checkCompletedTasks({
  userId,
  taskId,
}: {
  taskId: string;
  userId: string;
}): Promise<boolean> {
  try {
    const completion = await prisma.tasksCompletion.findFirst({
      where: { userId, taskId },
    });

    console.log({ completion });
    return !!completion;
  } catch (e) {
    console.log(e);
    return false;
  }
}


export async function addTask(name: string, category: string, points: number, icon: string, link: string): Promise<string> {
  // Check for existing task with the same name and category to avoid duplicates
  const existingTask = await prisma.tasks.findFirst({
    where: { name, category },
  });

  if (existingTask) {
    throw new Error('A task with the same name and category already exists.');
  }

  const task = await prisma.tasks.create({
    data: {
      name,
      category,
      points,
      icon,
      link
    },
  });

  return `Task '${task.name}' added successfully with ID: ${task.id}`;
}


export async function allCards(userId: string) {
  // Fetch all cards
  const allCards = await prisma.card.findMany();

  // Fetch user's purchased cards
  const userCards = await prisma.userCard.findMany({
    where: { userId },
  });

  const user =   await prisma.user.update({
      where: { chatId: userId },
      data: {
        lastProfitDate: Date.now(),
        lastLogin: new Date(),
      },
    });
  // Create a map of userCards for quick lookup
  const userCardsMap = new Map(userCards.map((card) => [card.cardId, card]));

  // Combine allCards and userCards
  const combinedCards = allCards.map(
    (card) => userCardsMap.get(card.id) || card
  );

  return { combinedCards  , user};
}
