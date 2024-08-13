"use client";

import { updatePointsInDB } from "@/actions/points.actions";
import { getUserConfig } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useCallback, useEffect } from "react";

export const usePushPointsToDB =  () => {
  // const name = process.env.NEXT_PUBLIC_TAPPED_POINTS_KEYWORD!;

  // const { points } = usePointsStore();

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
  }, [points, user]);

  useEffect(() => {
    if (points % 100 == 0) {
      const done = push2db();
    }
  }, [points, push2db]);
};
