import axios from "axios";

export const FetchUserSkin = async (id: string) => {
  try {
    const data = await axios.get(
      `http://localhost:3000/api/Skin/getCurrentSkin?id=${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const setCurrentSkin = async (id: string, skin: string) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/Skin/setUserSkin",
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
      `http://localhost:3000/api/Skin/getAllSkins?id=${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const  BuySkin = async (id: string, localBalance: number,chatId: string) => {
  console.log("🚀 ~ BuySkin ~ chatId:", chatId)
  console.log("🚀 ~ BuySkin ~ localBalance:", localBalance)
  console.log("🚀 ~ BuySkin ~ id:", id)
  try {
    const response = await axios.post(
      "http://localhost:3000/api/Skin/buySkin",
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