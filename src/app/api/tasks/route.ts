import { writeFile, readFile, unlink,rm } from "fs/promises";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import prisma from "@/lib/prisma";

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req:Request) {
  const data = await req.formData();
  const { name, category, points, icon } = await req.json();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ message: "no image found", success: false });
  }

  const byteData = await (file as Blob).arrayBuffer();
  const buffer = Buffer.from(byteData);
  let path;
  if(file instanceof File){
    
     path = `./public/temp/${file.name}`;
  }

  // Save the file to the local public directory
  await writeFile(path!, buffer);


  // Upload the file to Cloudinary
  try {
    const result = await cloudinary.v2.uploader.upload(path!);

    if(result.url){
      await unlink(path!);
    }

    
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
        link: result.url,
      },
    });



 return new Response(JSON.stringify({message: `Task '${task.name}' added successfully with ID: ${task.id}`}), { status: 201 });
    
  } catch (error) {
    return NextResponse.json({
      message: "cloudinary upload failed",
      success: false,
      error: error,
    });
  }
}
