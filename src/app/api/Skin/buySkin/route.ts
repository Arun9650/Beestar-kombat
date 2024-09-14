import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; //


export async function POST(request: NextRequest) {
  try {
    const { id, localBalance, chatId } = await request.json();
    console.log("🚀 ~ POST ~ id:", id)
    console.log("🚀 ~ POST ~ localBalance:", localBalance)
    console.log("🚀 ~ POST ~ chatId:", chatId)

    // Fetch the skin and user from the database
    const skin = await prisma.skins.findUnique({ where: { id } });
    console.log("🚀 ~ POST ~ skin:", skin)
    const user = await prisma.user.findUnique({ where: { chatId } });
    console.log("🚀 ~ POST ~ user:", user)

    if (!user) return NextResponse.json({ status: "invalidUser" }, { status: 400 });
    if (!skin) return NextResponse.json({ status: "invalidSkin" }, { status: 400 });

    const newBalance = localBalance - skin.cost;

    if (newBalance < 0) {
      return NextResponse.json({ status: "insufficientBalance" }, { status: 400 });
    }

    // Update user points and create the userSkin entry
    await prisma.user.update({
      where: { chatId },
      data: { points: newBalance },
    });

    await prisma.userSkin.create({
      data: {
        userId: chatId,
        skinId: id,
      },
    });

    return NextResponse.json({ status: "success", points: newBalance, image: skin.image }, { status: 200 });
  } catch (e) {
    console.error("Error while buying skin:", e);
    return NextResponse.json({ status: "errorOccurred" }, { status: 500 });
  }
}
