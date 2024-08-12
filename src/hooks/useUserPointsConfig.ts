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
  } = useBoostersStore();

  const { points, initializePoints, initializePPH, setCurrentTapsLeft } =
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
          console.log("🚀 ~ update ~ energyCapacity:", energyCapacity)
          console.log("🚀 ~ update ~ energyCapacity:", energyCapacityLocal)
          if (
            energyCapacity < currentState.capacity &&
            currentState.capacity > Number(energyCapacityLocal)
          ) {
            console.log("🚀 ~ update ~ energyCapacity:", currentState.capacity)

            setEnergyCapacity(currentState.capacity);
          }
          if (rechargeVelocity < currentState.recharge) {
            setRechargeVelocity(currentState.recharge);
          }
          if (multiClickLevel < currentState.clicks) {
            setMultiClickLevel(currentState.clicks);
          }
  
          if (currentTapsLeftLocal) {
            const lastLoginDate = config.user.lastLogin;
            const now = new Date();
            const lastLoginDateObj = lastLoginDate
            ? new Date(lastLoginDate)
            : new Date();
            const timeDifferenceInSeconds = Math.floor(
              (now.getTime() - lastLoginDateObj.getTime()) / 1000
            );
            
  
            let currentTapsLeft = Number(currentTapsLeftLocal);
  
            const remainingTaps =  currentState.capacity - currentTapsLeft;
  
            if (timeDifferenceInSeconds > remainingTaps) {
              currentTapsLeft = currentState.capacity;
            } else {
              currentTapsLeft += timeDifferenceInSeconds;
            }
  
            setCurrentTapsLeft(currentTapsLeft);
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
