import { Team } from "@/components/tasks/TaskList";
import axios from "axios";

export const FetchUserSkin = async (id: string) => {
  try {
    const data = await axios.get(
      `/api/Skin/getCurrentSkin?id=${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const setCurrentSkin = async (id: string, skin: string) => {
  try {
    const response = await axios.post(
      "/api/Skin/setUserSkin",
      {
        id,
        skin,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchAllSkin = async (id: string) => {
  try {
    const response = await axios.get(
      `/api/Skin/getAllSkins?id=${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const  BuySkin = async (id: string, localBalance: number,chatId: string) => {
  try {
    const response = await axios.post(
      "/api/Skin/buySkin",
      {
        id,
        localBalance,
        chatId,
      }
    )

    return response.data;
  } catch (error) {
    throw error;
  }
}


export  async function fetchReferrals(userId: string) {
  const { data } = await axios.get(`/api/user/referrals?id=${userId}`);
  return data;
}

export async function fetchYouTubeTask(userId: string){
  const { data } = await axios.get(`/api/youTubeTask?userId=${userId}`);
  return data;
}

export async function fetchAllCards(userId: string){
  const { data } = await axios.get(`/api/allCards?userId=${userId}`);
  return data;
}

