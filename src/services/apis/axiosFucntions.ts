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