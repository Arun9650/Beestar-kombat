import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image, cost , featured} = body;

    if (!name || !image || !cost) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const newSkin = await prisma.skins.create({
      data: {
        name,
        image,
        cost,
        featured,
      },
    });

    return new Response(JSON.stringify(newSkin), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to add skin' }), { status: 500 });
  }
}
