import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    const cardsData = [
        {
          title: "Card 1",
          imageUrl: "http://example.com/image1.png",
          profitPerHour: 10.5,
          cost: 100,
          level: 1,
        },
        {
          title: "Card 2",
          imageUrl: "http://example.com/image2.png",
          profitPerHour: 12.5,
          cost: 200,
          level: 1,
        },
        {
          title: "Card 3",
          imageUrl: "http://example.com/image3.png",
          profitPerHour: 15.0,
          cost: 300,
          level: 1,
        },
        {
          title: "Card 4",
          imageUrl: "http://example.com/image4.png",
          profitPerHour: 20.0,
          cost: 400,
          level: 2,
        },
        {
          title: "Card 5",
          imageUrl: "http://example.com/image5.png",
          profitPerHour: 25.0,
          cost: 500,
          level: 2,
        }
      ];

  try {
    
      const cards = await prisma.card.createMany({ data: cardsData });
 

    return NextResponse.json({ status: 200, cards });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
}
