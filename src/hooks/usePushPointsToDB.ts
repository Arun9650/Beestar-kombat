"use client";

import { updatePointsInDB } from "@/actions/points.actions";
import { getUserConfig } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useCallback, useEffect } from "react";

export const usePushPointsToDB =  () => {
  // const name = process.env.NEXT_PUBLIC_TAPPED_POINTS_KEYWORD!;

  const { PPH } = usePointsStore();

  // Define the threshold based on PPH
  const calculateThreshold = (PPH:any) => {
    if (PPH >= 100000) return 10000;
    if (PPH >= 10000) return 5000;
    if (PPH >= 5000) return 1000;
    if (PPH >= 1000) return 500;
    if (PPH >= 100) return 200;
    return 100;
  };

  const threshold = calculateThreshold(PPH);

  const points = Number(window.localStorage.getItem("points"));
  const user = window.localStorage.getItem("authToken");

  const push2db = useCallback(async () => {
    const userConfig = await getUserConfig(`${user}`);
    const points = Number(window.localStorage.getItem("points"));
    
    if (points > 0 && points > userConfig.user.points) {
      const done = await updatePointsInDB({ points: points, id: user! });
      console.log({ status: done });
      return done;
    } else {
      console.log("Points are not greater than 0 or user points");
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (points % threshold == 0) {
      const done = push2db();
    }
  }, [points, push2db, threshold]);
};
