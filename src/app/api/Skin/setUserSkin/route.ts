import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, skin } = body;
    console.log("🚀 ~ POST ~ skin:", skin)
    console.log("🚀 ~ POST ~ id:", id)

    if (!id) {
      return new Response(JSON.stringify({ error: "user id is required" }), {
        status: 400,
      });
    }

    const user = await prisma.user.findMany({ where: { chatId: id } });

    if (!user) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 400,
      });
    }

    await prisma.user.update({
      where: {
        chatId: id,
      },
      data: {
        skin: skin,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to add skin" }), {
      status: 500,
    });
  }
}
