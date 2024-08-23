"use client";
import { creditProfitPerHour, getUserConfig } from "@/actions/user.actions";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const useUserPointsConfig = () => {
  const {
    energyCapacity,
    setEnergyCapacity,
    rechargeVelocity,
    setRechargeVelocity,
    multiClickLevel,
    setMultiClickLevel,
    setMultiClickCost
  } = useBoostersStore();

  const { points, initializePoints, initializePPH, setCurrentTapsLeft, currentTapsLeft } =
    usePointsStore();
  const { isLoading } = useLoadingScreenStore();

  useEffect(() => {
    const executeEffect = () => {
      const user = window.localStorage.getItem("authToken");
      let initialPoints = window.localStorage.getItem("points");
  
      const currentTapsLeftLocal = window.localStorage.getItem("currentTapsLeft");
      const energyCapacityLocal = window.localStorage.getItem("energyCapacity");
  
      async function update() {
        const config = await getUserConfig(`${user}`);
        const currentState = config?.user;
        if (currentState) {
          if (currentState && currentState.capacity) {
            if (energyCapacity < currentState.capacity && currentState.capacity >= Number(energyCapacityLocal)  ) {
              setEnergyCapacity(currentState.capacity);
              
            }

            if(currentState.multiClickCost && currentState.multiClickLevel){
              setMultiClickLevel(currentState.multiClickLevel);
              setMultiClickCost(currentState.multiClickCost);
            }


          }
         
  
          if (!isNaN(Number(currentTapsLeftLocal))) {
            const lastLoginDate = config?.user?.lastLogin!;
            const now = new Date();
         
            const timeDifferenceInSeconds = Math.floor(
              (now.getTime() - lastLoginDate?.getTime()) / 1000
            );
            
  
            let currentTapsLeftcal = Number(currentTapsLeftLocal);
  
            const remainingTaps =  (currentState?.capacity ?? 0) - currentTapsLeftcal;
  
            if (timeDifferenceInSeconds > remainingTaps) {
              currentTapsLeftcal = currentState.capacity ?? 0;
              if(!isNaN(currentTapsLeftcal)){
                setCurrentTapsLeft(currentTapsLeftcal);
                window.localStorage.setItem("currentTapsLeft", currentTapsLeftcal.toString());
              }
              // setCurrentTapsLeft(async);
            } else {
              currentTapsLeftcal += timeDifferenceInSeconds;
              if(!isNaN(currentTapsLeftcal)){
                setCurrentTapsLeft(currentTapsLeftcal);
                window.localStorage.setItem("currentTapsLeft", currentTapsLeftcal.toString());
              }
            }
  
          }
  
          const intPoints = initialPoints ? Number(initialPoints) : 0;
          const biggerNumber =
            intPoints > currentState.points ? intPoints : currentState.points;
          if (points === 0) {
            intPoints > 0 && initializePoints(biggerNumber);
            initializePPH(currentState.profitPerHour);
          }
        }
      }
  
      update();
    };
  
    if (typeof window === "undefined") {
      setTimeout(executeEffect, 100);
    } else {
      executeEffect();
    }
  }, []);



useEffect(() => {
  const executeEffect = () => {
    const user = window.localStorage.getItem("authToken");
    const pphReward = async () => {
      if (user) {
        const credited = await creditProfitPerHour(user);
        if (credited && typeof credited === 'object' && 'profit' in credited && credited.success) {
          toast.success("Profit Credited");
        }
      }
    };

    pphReward();
  };

  if (typeof window === "undefined") {
    setTimeout(executeEffect, 100);
  } else {
    executeEffect();
  }
}, []);
  return points;
};

export default useUserPointsConfig;
