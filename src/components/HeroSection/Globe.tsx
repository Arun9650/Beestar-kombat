"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePointsStore } from "@/store/PointsStore";
import { useLocalPointsStorage } from "@/hooks/useLocalPointsStorage";
import { usePushPointsToDB } from "@/hooks/usePushPointsToDB";
import { useBoostersStore } from "@/store/useBoostrsStore";
import useFetchUserSkin from "@/hooks/query/useFetchUserSkin";
import { useSearchParams } from "next/navigation";

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
    setPoints,
    PPH
  } = usePointsStore();
  const { secondsLeft, decreaseSecondsLeft } = useBoostersStore();
  const { multiClickLevel } = useBoostersStore();

  useLocalPointsStorage();
  usePushPointsToDB();

  const bodyRef = useRef<HTMLDivElement | null>(null);


 

  const handleCardClick = (event: any) => {

    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the target
    const y = event.clientY - rect.top; // y position within the target

    // Step 1: Create and append a <style> element
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
    

    // Create a new div element

    const newDiv = document.createElement("div");
    newDiv.textContent = `+${multiClickLevel.toString()}`;
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



  const search  = useSearchParams();
  const id = search.get("id");

  const {data: userSkin} = useFetchUserSkin(id!);

  // useEffect(() => {
  //   const getUserSkin = async () => {
  //     try {
  //       const authToken = window.localStorage.getItem("authToken");
  //       if (!authToken) {
  //         throw new Error("No auth token found");
  //       }

  //       const response = await getCurrentSkin({user: authToken});
  //       console.log("🚀 ~ getUserSkin ~ response:", response)

  //       setUserSkin(response || null);
  //     } catch (error) {
  //       toast.error("Failed to fetch user skin");
  //       console.error("Error fetching user skin:", error);
  //     }
  //   };

  //   getUserSkin();
  // }, []);
 



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
        let time = Date.now();
        window.localStorage.setItem("lastLoginTime", time.toString() );
        const local = parseInt(
          window.localStorage.getItem("currentTapsLeft") ?? "0"
        );

        if ( points !== 0  && local < currentTapsLeft && !isNaN(currentTapsLeft)) {
          // console.log("🚀 ~ intervalId ~ currentTapsLeft:", currentTapsLeft)
          window.localStorage.setItem(
            "currentTapsLeft",
            (currentTapsLeft + multiClickLevel).toString()
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
    // console.log("🚀 ~ handleTouch ~ length:", length);
    console.log(event, length);

    if(currentTapsLeft > multiClickLevel){

      
      if(length === 1){
        if ( length >= 1) {
          window.localStorage.setItem("points", String(length));
          window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - multiClickLevel}`);
          handleMultiTouchStart(event);
        addPoints(multiClickLevel);
        decreaseTapsLeft(multiClickLevel);
      }
    }
    
    if (length === 2) {
      if ( length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - multiClickLevel * 2}`);
        handleMultiTouchStart(event);
        addPoints((length-1) * multiClickLevel);
        decreaseTapsLeft((length-1)  * multiClickLevel);
      }
    }

    if (length === 3) {
      if ( length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - multiClickLevel * 3}`);
        handleMultiTouchStart(event);
        addPoints((length-2) * multiClickLevel);
        decreaseTapsLeft((length-2)  * multiClickLevel);
      }
    }

    if (length === 4) {
      if ( length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - multiClickLevel * 4}`);
        handleMultiTouchStart(event);
        addPoints((length-3) * multiClickLevel);
        decreaseTapsLeft((length-3)  * multiClickLevel);
      }
    }
    if(length === 5){
      if ( length >= 1) {
        window.localStorage.setItem("points", String(length));
        window.localStorage.setItem("currentTapsLeft", `${currentTapsLeft - multiClickLevel * 5}`);
        handleMultiTouchStart(event);
        addPoints((length-4) * multiClickLevel);
        decreaseTapsLeft((length-4)  * multiClickLevel);
      }
    }
  }
  };
  // console.log(skin);
  return (
    <div className="relative bg-[url('/newImages/honeycomb-design.png')]  bg-center bg-cover bg-no-repeat my-8">
      <div className=" mx-auto  w-full ">
        <div
          ref={bodyRef}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouch(e);
          }}
          className="relative rounded-full circle-outer mx-auto"
        >
          <div className="circle-inner rounded-full">
            <Image
              src={userSkin?.data ?? "/newImages/BeeMain.png"}
              height={180}
              width={180}
              alt=""
              className="transition duration-300  cursor-pointer w-44 h-44 xs:h-[16.1rem] xs:w-[16.1rem]"
            />  
          </div>  
        </div>
      </div>
    </div>
  );
};

export default TapGlobe;
