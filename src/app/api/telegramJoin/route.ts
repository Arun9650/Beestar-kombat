import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Your bot token
const CHANNEL_ID =  '-1002252478157'; // Your channel username or ID (use the format @channel_username)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json(); // Get the user ID from the request


    if(!userId){
      console.log("🚀 ~ POST ~ userId:", userId)
      return NextResponse.json({ status: 'error, user id not found' }, { status: 400 });
    }

    // Make a request to Telegram API to check if the user is a member of the channel
    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${userId}`
    );
    console.log("🚀 ~ POST ~ response:", response)
    console.log("🚀 ~ POST ~ response:", response.data)

    const memberStatus = response.data.result.status;
    console.log("🚀 ~ POST ~ memberStatus:", memberStatus)
    
    // Check if the user is an actual member
    if (memberStatus === 'member' || memberStatus === 'administrator' || memberStatus === 'creator') {
      return NextResponse.json({ status: 'joined' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'not_joined' }, { status: 200 });
    }

  } catch (error:any) {
    console.error("Error while checking Telegram channel membership:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
