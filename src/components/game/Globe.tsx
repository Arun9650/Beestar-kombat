"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePointsStore } from "@/store/PointsStore";
import { useLocalPointsStorage } from "@/hooks/useLocalPointsStorage";
import { usePushPointsToDB } from "@/hooks/usePushPointsToDB";
import { useBoostersStore } from "@/store/useBoostrsStore";

interface ClickCoords {
  x: number;
  y: number;
}

const TapGlobe = () => {
  const [clickCoordinate, setClickCoordinate] = useState<ClickCoords[]>([]);
  const [isTapping, setIsTapping] = useState<boolean>();

  const {
    addPoints,
    decreaseTapsLeft,
    currentTapsLeft,
    increaseTapsLeft,
    tapInBoostMode,
  } = usePointsStore();
  const { secondsLeft, decreaseSecondsLeft } = useBoostersStore();
  const { multiClickLevel } = useBoostersStore();
  const { skin } = usePointsStore();

  useLocalPointsStorage();
  usePushPointsToDB();

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);
    // setCoins(coins + pointsToAdd);
    // setUser((prevUser) => ({ ...prevUser, coins: prevUser.coins + pointsToAdd }));
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    if (secondsLeft > 0) {
      tapInBoostMode(7 * multiClickLevel);
    } else {
      addPoints(multiClickLevel);

      decreaseTapsLeft(1);
      window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 1}`);

      setIsTapping(true);
      setTimeout(() => setIsTapping(false), 2000);
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  useEffect(() => {
    const timers = clickCoordinate.map((coords, index) =>
      setTimeout(() => {
        setClickCoordinate(clickCoordinate.filter((coords, i) => i !== index));
      }, 2000)
    );

    return () => timers.forEach(clearTimeout);
  }, [clickCoordinate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isTapping) {
        increaseTapsLeft();
        window.localStorage.setItem("currentTapsLeft", (currentTapsLeft + 1).toString());
      }
    }, 1000); // Adjust interval as needed
  
    return () => clearInterval(intervalId);
  }, [isTapping, currentTapsLeft]);

  useEffect(() => {
    const intervalId = setInterval(() => {secondsLeft > 0 && decreaseSecondsLeft()
    },
      1000
    );
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  return (
    <div className="relative ">
      <div className=" mx-auto  w-fit ">
        <div
          onClick={handleCardClick}
          className="relative   rounded-full circle-outer"
        >
          <div className="circle-inner rounded-full  ">
            {clicks.map((click) => (
              <div
                key={click.id}
                className=" text-5xl font-bold opacity-0 absolute  text-white pointer-events-none"
                style={{
                  top: `${click.y - 250}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                {(secondsLeft > 0 ? 7 : 1) * multiClickLevel}
              </div>
            ))}
            <Image
              src={skin ?? "/assets/images/BeeMain.png"}
              height={200}
              width={200}
              alt=""
              className="transition duration-300  cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapGlobe;
