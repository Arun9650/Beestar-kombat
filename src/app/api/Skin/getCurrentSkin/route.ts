import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, res: Response) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('id');

    if (!user) {
      return Response.json({ error: 'User parameter is required' }, { status: 400 });
    }

    const cacheKey = `userSkin:${user}`;
    let skin;

    // Attempt to retrieve the skin data from Redis
    const cachedSkin = await redis.get(cacheKey);
    if (cachedSkin) {
      console.log('Fetching skin data from Redis cache');
      skin = JSON.parse(cachedSkin);
    } else {
      console.log('Fetching skin data from the database');
      // Retrieve the user from the database if not cached
      const acct = await prisma.user.findUnique({ where: { chatId: user } });

      if (!acct) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }

      skin = acct.skin;

      // Cache the skin data for future requests (e.g., cache for 24 hours)
      await redis.set(cacheKey, JSON.stringify(skin), 'EX', 86400);
    }

    return Response.json(skin, { status: 200 });
  } catch (error) {
    console.error('Error fetching user skin:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
