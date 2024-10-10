import { PrismaClient } from "@prisma/client";
import redis from "@/lib/redis";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, skin } = body;
    console.log("🚀 ~ POST ~ skin:", skin);
    console.log("🚀 ~ POST ~ id:", id);

    if (!id) {
      return new Response(JSON.stringify({ error: "user id is required" }), {
        status: 400,
      });
    }

    const user = await prisma.user.findMany({ where: { chatId: id } });

    if (!user.length) {
      return new Response(JSON.stringify({ error: "user not found" }), {
        status: 400,
      });
    }

    // Update the user's skin in the database
    await prisma.user.update({
      where: {
        chatId: id,
      },
      data: {
        skin: skin,
      },
    });

    // Invalidate the Redis cache for the user's skin data
    const cacheKey = `userSkin:${id}`;
    await redis.del(cacheKey);
    console.log(`Cache invalidated for key: ${cacheKey}`);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Failed to update skin:", error);
    return new Response(JSON.stringify({ error: "Failed to add skin" }), {
      status: 500,
    });
  }
}
