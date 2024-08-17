"use client";

import { usePointsStore } from "@/store/PointsStore";
import Image from "next/image";
import React, { useEffect } from "react";
import { formatNumber, formatNumberWithCommas } from "../../../utils/formatNumber";

const PointsTracker = () => {
  const { points, PPH, setPoints } = usePointsStore();

  useEffect(() => {
    const pointsPerSecond = PPH / 3600;

    const interval = setInterval(() => {
      const updatedPoints = points + pointsPerSecond;
      setPoints(updatedPoints);
    }, 1000);

    return () => clearInterval(interval);
  }, [PPH, points]);

  return (
    <div className="font-bold text-3xl flex items-center gap-2 text-white">
      <span className="text-6xl">
        <Image
          src="/assets/images/dollar-coin.png"
          height={40}
          width={40}
          alt=""
        />
      </span>
      {formatNumberWithCommas(points)}
    </div>
  );
};

export default PointsTracker;
