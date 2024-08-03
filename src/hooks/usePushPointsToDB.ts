"use client";

import { updatePointsInDB } from "@/actions/points.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useCallback, useEffect } from "react";

export const usePushPointsToDB = () => {
  // const name = process.env.NEXT_PUBLIC_TAPPED_POINTS_KEYWORD!;

  const { points } = usePointsStore();
  console.log("🚀 ~ usePushPointsToDB ~ points:", points)
  const user = window.localStorage.getItem("authToken");
  console.log("🚀 ~ usePushPointsToDB ~ user:", user)
  const push2db = useCallback(async () => {
    const done = await updatePointsInDB({ points, id: user! });
    console.log({ status: done });
    return done;
  }, [points, user]);

  useEffect(() => {
    if (points % 100 == 0) {
      const done = push2db();
    }
  }, [points, push2db]);
};
