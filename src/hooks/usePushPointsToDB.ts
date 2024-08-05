"use client";

import { updatePointsInDB } from "@/actions/points.actions";
import { getUserConfig } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useCallback, useEffect } from "react";

export const usePushPointsToDB =  () => {
  // const name = process.env.NEXT_PUBLIC_TAPPED_POINTS_KEYWORD!;

  const { points } = usePointsStore();

  const user = window.localStorage.getItem("authToken");

  


  const push2db = useCallback(async () => {
    const userConfig = await getUserConfig(`${user}`);  
    const done = await updatePointsInDB({ points: points, id: user! });
    console.log({ status: done });
    return done;
  }, [points, user]);

  useEffect(() => {
    if (points % 100 == 0) {
      const done = push2db();
    }
  }, [points, push2db]);
};
