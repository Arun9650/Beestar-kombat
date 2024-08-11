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
    const authToken = window.localStorage.getItem("authToken");
    const preStorePoints = async () => {
      const user = await getUserConfig(`${authToken}`);
      const prevStoredPoints = window.localStorage.getItem(`points`);
      console.log("🚀 ~ preStorePoints ~ user:", user)

    if (Number(prevStoredPoints)> 0) {
      store(Number(prevStoredPoints));
    } else {
      store(user?.user.points);
      // window.localStorage.setItem(`${authToken}${name}`, `${points}`);
      //   console.log("set");

    }
    }
    preStorePoints();
  }, []);

  useEffect(() => {
    // if (points % 10 == 0) {
    store(points);
    // console.log(get());
    // }
  }, [points]);
};
