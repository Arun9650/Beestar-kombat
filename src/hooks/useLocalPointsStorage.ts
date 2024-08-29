"use client";

import { getUserConfig } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useEffect } from "react";

export const useLocalPointsStorage = () => {
  const { points } = usePointsStore();
  const name = process.env.NEXT_PUBLIC_TAPPED_POINTS_KEYWORD!;


  const store = (points: number) => {
    // window.localStorage.setItem(`${authToken}${name}`, `${points}`);
    window.localStorage.setItem("points", `${points}`);
    // console.log("stored to session");
  };

  const get = () => {
    return window.localStorage.getItem("points");
    // return window.localStorage.getItem(`${authToken}${name}`);
  };


  
  useEffect(() => {
    // if (points % 10 == 0) {
    if(points > 0){
      store(points);
    }
    // console.log(get());
    // }
  }, [points]);

  
  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");
    console.log("🚀 ~ useEffect ~ authToken:", authToken)
    const preStorePoints = async () => {
      let user = await getUserConfig(`${authToken}`);
      let retries = 0;
      const maxRetries = 3;
  
      // Retry mechanism if user is null
      while (!user && retries < maxRetries) {
        console.log(`Retrying to fetch user info... Attempt ${retries + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        user = await getUserConfig(`${authToken}`);
        retries++;
      }


      const prevStoredPoints = window.localStorage.getItem(`points`);      
      console.log("🚀 ~ preStorePoints ~ user:", user)
    if (Number(prevStoredPoints) > user?.user.points) {
      store(Number(prevStoredPoints));
    } else {
      store(user?.user.points);
    }
    }
    preStorePoints();
  }, []);

};
