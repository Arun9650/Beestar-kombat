"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePointsStore } from "@/store/PointsStore";
import { useLocalPointsStorage } from "@/hooks/useLocalPointsStorage";
import { usePushPointsToDB } from "@/hooks/usePushPointsToDB";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { UpdateUser } from "@/actions/user.actions";

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
    points,
  } = usePointsStore();
  const { secondsLeft, decreaseSecondsLeft } = useBoostersStore();
  const { multiClickLevel } = useBoostersStore();
  const { skin } = usePointsStore();

  useLocalPointsStorage();
  usePushPointsToDB();

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleCardClick = (event: any) => {
    // if (secondsLeft > 0) {
    //   tapInBoostMode(7 * multiClickLevel);
    // } else {

    // decreaseTapsLeft(1);
    // if(!isNaN(currentTapsLeft)){

    // window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 1}`);

    //   }

    //   const userId  = window.localStorage.getItem("authToken");
    //   setIsTapping(true);
    //   setTimeout(() => {setIsTapping(false), UpdateUser(userId!) }, 400);
    // }

    // addPoints(multiClickLevel + event.touch.length);

    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the target
    const y = event.clientY - rect.top; // y position within the target

    // Step 1: Create and append a <style> element
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
    

    // Create a new div element

    const newDiv = document.createElement("div");
    newDiv.textContent = "+1";
    newDiv.style.position = "absolute";
    newDiv.style.left = `${x}px`;
    newDiv.style.top = `${y - 50}px`;
    newDiv.style.color = "white";
    newDiv.draggable = false;
    newDiv.className =
      "dynamic-div animate-fadeOutTopRight z-20 transform max-sm:text-3xl text-5xl font-extrabold transition not-selectable"; // You can add Tailwind classes here if needed

    // Append the new div to the body

    bodyRef.current && bodyRef.current.appendChild(newDiv);
    // remove the div after 400ms
    const interval = setTimeout(() => newDiv && newDiv.remove(), 400);

    return () => clearTimeout(interval);
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
        const local = parseInt(
          window.localStorage.getItem("currentTapsLeft") ?? "0"
        );

        if (local < currentTapsLeft && !isNaN(currentTapsLeft)) {
          window.localStorage.setItem(
            "currentTapsLeft",
            (currentTapsLeft + 1).toString()
          );
        }
      }
    }, 1000); // Adjust interval as needed

    return () => clearInterval(intervalId);
  }, [isTapping, currentTapsLeft]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      secondsLeft > 0 && decreaseSecondsLeft();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  const handleMultiTouchStart = (event: TouchEvent) => {
    // Iterate over each touch point
    Array.from(event.touches).forEach((touch) => {
      console.log("Touch's current position:", touch);
      // Call handleClick for each touch point
      handleCardClick({
        ...touch,
        target: event.target,
        preventDefault: () => {}, // Mock preventDefault for non-MouseEvent
        clientX: touch.clientX,
        clientY: touch.clientY,
        touches: [],
        targetTouches: [],
        changedTouches: [],
      });
    });
  };

  const handleTouch = (event: any) => {
    const length = event.touches.length;
    console.log("🚀 ~ handleTouch ~ length:", length);
    console.log(event, length);

    if(length === 1){
      if (points - length >= 0 && length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 1}`);
        handleMultiTouchStart(event);
        addPoints(length);
        decreaseTapsLeft(1);
      }
    }

    if (length === 2) {
      if (points - length >= 0 && length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 2}`);
        handleMultiTouchStart(event);
        addPoints(length-1);
        decreaseTapsLeft(length-1 );
      }
    }

    if (length === 3) {
      if (points - length >= 0 && length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 3}`);
        handleMultiTouchStart(event);
        addPoints(length - 2);
        decreaseTapsLeft(length - 2);
      }
    }

    if (length === 4) {
      if (points - length >= 0 && length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 4}`);
        handleMultiTouchStart(event);
        addPoints(length - 3);
        decreaseTapsLeft(length - 3);
      }
    }
    if(length === 5){
      if (points - length >= 0 && length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - 5}`);
        handleMultiTouchStart(event);
        addPoints(length - 4);
        decreaseTapsLeft(length - 4);
      }
    }
  };

  return (
    <div className="relative ">
      <div className=" mx-auto  w-fit ">
        <div
          ref={bodyRef}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouch(e);
          }}
          className="relative rounded-full circle-outer"
        >
          <div className="circle-inner rounded-full  ">
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
