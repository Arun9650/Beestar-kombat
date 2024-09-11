"use client";

import { usePointsStore } from "@/store/PointsStore";
import Image from "next/image";
import React, { useEffect } from "react";

interface PointsTrackerProps {
  formatNumber: (num: number) => string;
}

const PointsTracker: React.FC<PointsTrackerProps> = ({ formatNumber }) => {
  const { points, PPH, setPoints } = usePointsStore();

  useEffect(() => {
    const pointsPerSecond = PPH / 3600;

    const interval = setInterval(() => {
      const updatedPoints = points + pointsPerSecond;
      setPoints(updatedPoints);
    }, 1000);

    return () => clearInterval(interval);
  }, [PPH, points, setPoints]);

  return (
    <div className="font-bold text-xl mx-auto  flex items-center xs:justify-center gap-2 text-white">
      <span className="text-6xl ">
        <Image
          src="/newImages/Bee-coin.png"
          height={40}
          width={40}
          alt="Bee coin"
        />
      </span>
      {formatNumber(points)}
    </div>
  );
};

export default PointsTracker;
