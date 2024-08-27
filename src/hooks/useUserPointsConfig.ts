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
    setMultiClickCost,
  } = useBoostersStore();

  const {
    points,
    initializePoints,
    initializePPH,
    setCurrentTapsLeft,
    currentTapsLeft,
  } = usePointsStore();
  const { isLoading } = useLoadingScreenStore();

  useEffect(() => {
    const executeEffect = () => {
      const user = window.localStorage.getItem("authToken");
      let initialPoints = window.localStorage.getItem("points");

      const currentTapsLeftLocal =
        window.localStorage.getItem("currentTapsLeft");
      const energyCapacityLocal = window.localStorage.getItem("energyCapacity");

      async function update() {
        const config = await getUserConfig(`${user}`);
        const currentState = config?.user;
        if (currentState) {
          if (currentState && currentState.capacity) {
            if (
              energyCapacity < currentState.capacity &&
              currentState.capacity >= Number(energyCapacityLocal)
            ) {
              setEnergyCapacity(currentState.capacity);
            }

            if (currentState.multiClickCost && currentState.multiClickLevel) {
              setMultiClickLevel(currentState.multiClickLevel);
              setMultiClickCost(currentState.multiClickCost);
            }
          }
          // Retrieve the last login time from local storage
          const getLastLoginTimeFromLocalStorage = (): number | null => {
            const lastLogin = window.localStorage.getItem("lastLoginTime");
            return lastLogin ? parseInt(lastLogin, 10) : null;
          };

          if (!isNaN(Number(currentTapsLeftLocal))) {
            const lastLoginTimeFromConfig = config?.user?.lastLogin
              ? new Date(config.user.lastLogin).getTime()
              : null;

            // Get the last login time from local storage
            const lastLoginTimeFromLocalStorage =
              getLastLoginTimeFromLocalStorage();

            // Compare the two times and get the latest one

            // Compare the two times and get the latest one
            let lastLoginTime: number;
            if (lastLoginTimeFromConfig !== null) {
              lastLoginTime =
                lastLoginTimeFromLocalStorage !== null
                  ? Math.max(
                      lastLoginTimeFromConfig,
                      lastLoginTimeFromLocalStorage
                    )
                  : lastLoginTimeFromConfig;
            } else {
              lastLoginTime =
                lastLoginTimeFromLocalStorage !== null
                  ? lastLoginTimeFromLocalStorage
                  : Date.now(); // Fallback to current time if both are null
            }

            // Update the local storage with the latest login time
            window.localStorage.setItem(
              "lastLoginTime",
              lastLoginTime.toString()
            );

            // const lastLoginDate = config?.user?.lastLogin!;
            const now = Date.now();

            const timeDifferenceInSeconds = Math.floor(
              (now - lastLoginTime) / 1000
            );
            console.log(
              "🚀 ~ update ~ timeDifferenceInSeconds:",
              timeDifferenceInSeconds
            );

            let currentTapsLeftcal = Number(currentTapsLeftLocal);

            const remainingTaps =
              (currentState?.capacity ?? 0) - currentTapsLeftcal;

            if (Number(initialPoints) != 0) {
              if (timeDifferenceInSeconds > remainingTaps) {
                currentTapsLeftcal = currentState.capacity ?? 0;
                if (!isNaN(currentTapsLeftcal)) {
                  setCurrentTapsLeft(currentTapsLeftcal);
                  window.localStorage.setItem(
                    "currentTapsLeft",
                    currentTapsLeftcal.toString()
                  );
                }
                // setCurrentTapsLeft(async);
              } else {
                currentTapsLeftcal += timeDifferenceInSeconds;
                if (!isNaN(currentTapsLeftcal)) {
                  setCurrentTapsLeft(currentTapsLeftcal);
                  window.localStorage.setItem(
                    "currentTapsLeft",
                    currentTapsLeftcal.toString()
                  );
                }
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
      setTimeout(executeEffect, 10);
    } else {
      executeEffect();
    }
  }, []);

  useEffect(() => {
    const executeEffect = () => {
      const getLastLoginTimeFromLocalStorage = (): number | null => {
        const lastLogin = window.localStorage.getItem("lastLoginTime");
        return lastLogin ? parseInt(lastLogin, 10) : null;
      };

      const lastLoginTimeFromLocalStorage =
      getLastLoginTimeFromLocalStorage();
      const user = window.localStorage.getItem("authToken");
      const pphReward = async () => {
        if (user) {
          const credited = await creditProfitPerHour(user, lastLoginTimeFromLocalStorage);
          if (
            credited &&
            typeof credited === "object" &&
            "profit" in credited &&
            credited.success
          ) {
            toast.success("Profit Credited");
          }
        }
      };

      pphReward();
    };

    if (typeof window === "undefined") {
      setTimeout(executeEffect, 10);
    } else {
      executeEffect();
    }
  }, []);
  return points;
};

export default useUserPointsConfig;
