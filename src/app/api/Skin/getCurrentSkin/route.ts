import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
 // Adjust the import path as necessary

export async function GET(request: Request, res: Response) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('id');

    if (!user) {
      return Response.json({ error: 'User parameter is required' }, {status: 400});
    }

    const acct = await prisma.user.findUnique({ where: { chatId: user } });

    if (!acct) {
      return Response.json({ error: 'User not found' }, {status: 404});
    }

    const skin = acct.skin;

    return Response.json( skin , {status: 200});
  } catch (error) {
    console.error('Error fetching user skin:', error);
    return Response.json({ error: 'Internal server error' }, {status: 500});
  }
}