    import { NextResponse } from 'next/server';
    import prisma from '@/lib/prisma'; // Assume you have a prisma instance setup in `lib/prisma`
    import { NextRequest } from 'next/server';

    export async function POST(req: NextRequest) {
    try {
        const { userId, taskId } = await req.json();

        // Validate the request payload
        if (!userId || !taskId) {
        return NextResponse.json({ status: 'invalidData' }, { status: 400 });
        }

        // Find the task by taskId
        const task = await prisma.tasks.findUnique({ where: { id: taskId } });
        if (!task) {
        return NextResponse.json({ status: 'invalidTask' }, { status: 404 });
        }

        // Find the user by userId
        const user = await prisma.user.findUnique({ where: { chatId: userId } });
        if (!user) {
        return NextResponse.json({ status: 'userNotExist' }, { status: 404 });
        }

        // Check if the task has already been completed by the user
        const existingCompletion = await prisma.tasksCompletion.findFirst({
        where: {
            userId: userId,
            taskId: taskId,
        },
        });

        if (existingCompletion) {
        return NextResponse.json({ status: 'taskAlreadyCompleted' }, { status: 400 });
        }

        // Create a task completion record
        await prisma.tasksCompletion.create({
        data: {
            points: task.points,
            taskId,
            userId,
        },
        });

        // Update the user's points
        await prisma.user.update({
        where: { chatId: userId },
        data: {
            points: {
            increment: task.points,
            },
        },
        });

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (e) {
        console.error('Error completing task:', e);
        return NextResponse.json({ status: 'unknownError' }, { status: 500 });
    }
    }
