
import prisma from '@/lib/prisma';



export  async function POST(req: Request, res: Response) {
  try {

   

    // Expecting 'name', 'category', 'points', and 'icon' in the request body
    const { name, category, points, icon, link } = await req.json();

    if (!name || !category || !points || !icon) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

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


    return new Response(JSON.stringify({message: `Task '${task.name}' added successfully with ID: ${task.id}`}), { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
