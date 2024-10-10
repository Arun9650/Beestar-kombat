"use client";
import { fixAuthPointsIfGettingUnnecessary } from "@/actions/auth.actions";
import { creditProfitPerHour, getUserConfig } from "@/actions/user.actions";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import useAuthFix from "@/store/useFixAuth";
import { useUserStore } from "@/store/userUserStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const useUserPointsConfig = () => {
  const {
    energyCapacity,
    setEnergyCapacity,
    setMultiClickLevel,
    setMultiClickCost,
    setEnergyCost,
    setEnergyLevel
  } = useBoostersStore();

  const {
    points,
    initializePoints,
    initializePPH,
    setCurrentTapsLeft,
    addPoints,
  } = usePointsStore();
  const { isLoading , setIsLoading } = useLoadingScreenStore();

  const {setUser} = useUserStore();
  const {isAccountCreated, setIsAccountCreated} = useAuthFix();

  const search = useSearchParams();
  const id  = search.get('id');

  useEffect(() => {
    const executeEffect = () => {

      const user = window.localStorage.getItem("authToken");
      console.log("🚀 ~ executeEffect ~ user:", user)
      let initialPoints = window.localStorage.getItem("points");

      const currentTapsLeftLocal =
        window.localStorage.getItem("currentTapsLeft");
      // console.log(
      //   "🚀 ~ executeEffect ~ currentTapsLeftLocal:",
      //   currentTapsLeftLocal
      // );
      const energyCapacityLocal = window.localStorage.getItem("energyCapacity");

      async function update() {
        // console.log(user);
        let config = await getUserConfig(user || String(id));


        let retries = 0;
        const maxRetries = 3;
    
        // Retry mechanism if user is null
        while (!config && retries < maxRetries) {
          console.log(`Retrying to fetch user info... Attempt ${retries + 1}`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
          config = await getUserConfig(`${user}`);
          retries++;
        }

        
        
        const currentState = config?.user;
        if (config?.userDetails && config ) {
          setUser(config.userDetails);
        }
        // console.log("🚀 ~ update ~ currentState:", currentState);
        if (currentState) {
          console.log("🚀 ~ update ~ currentState:", currentState)
          if (currentState && currentState.capacity) {
            if (
              energyCapacity < currentState.capacity &&
              currentState.capacity >= Number(energyCapacityLocal) && currentState.energyLevel
            ) {
              console.log("asf")
              setEnergyCapacity(currentState.capacity);
              setEnergyCost(currentState.energyCost);
              setEnergyLevel(currentState.energyLevel);
            }

            if (currentState.multiClickCost && currentState.multiClickLevel) {
              setMultiClickLevel(currentState.multiClickLevel);
              setMultiClickCost(currentState.multiClickCost);
            }
          }
          // Retrieve the last login time from local storage
          const getLastLoginTimeFromLocalStorage = (): number | null => {
            const lastLogin = window.localStorage.getItem("lastLoginTime");
            // console.log("🚀lastLogin:", lastLogin)
            return lastLogin ? parseInt(lastLogin, 10) : null;
          };

          if (!isNaN(Number(currentTapsLeftLocal))) {
            const lastLoginTimeFromConfig = config?.user?.lastLogin
              ? new Date(config.user.lastLogin).getTime()
              : null;

            // Get the last login time from local storage
            const lastLoginTimeFromLocalStorage =  getLastLoginTimeFromLocalStorage();

            // Compare the two times and get the latest one

            // Compare the two times and get the latest one
            let lastLoginTime: number;
            if (lastLoginTimeFromConfig !== null) {
              lastLoginTime =  lastLoginTimeFromLocalStorage !== null ? Math.max(lastLoginTimeFromConfig,lastLoginTimeFromLocalStorage) : lastLoginTimeFromConfig;
              // console.log("🚀 ~ update ~ lastLoginTime:", lastLoginTime)
            } else {
              lastLoginTime = lastLoginTimeFromLocalStorage !== null ? lastLoginTimeFromLocalStorage : Date.now(); // Fallback to current time if both are null
              // console.log("🚀 ~ update ~ lastLoginTime:", lastLoginTime)
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
            // console.log("🚀 ~ update ~ timeDifferenceInSeconds:",
            //   timeDifferenceInSeconds
            // );

            let currentTapsLeftcal = Number(currentTapsLeftLocal);
            console.log(
              "🚀 ~ update ~ currentTapsLeftcal:",
              currentTapsLeftcal
            );

            const remainingTaps =
              (currentState?.capacity ?? 0) - currentTapsLeftcal;
            // console.log("🚀 ~ update ~ remainingTaps:", remainingTaps);

            if (Number(initialPoints) != 0) {
              if (timeDifferenceInSeconds > remainingTaps) {
                currentTapsLeftcal = currentState.capacity ?? 0;
                console.log(currentState.capacity);
                if (!isNaN(currentTapsLeftcal)) {
                  // console.log(
                  //   "🚀 ~ update ~ currentTapsLeftcal:",
                  //   currentTapsLeftcal
                  // );
                  setCurrentTapsLeft(currentTapsLeftcal);
                  window.localStorage.setItem(
                    "currentTapsLeft",
                    currentTapsLeftcal.toString()
                  );
                }
                // setCurrentTapsLeft(async);
              } else {
                currentTapsLeftcal += timeDifferenceInSeconds;
                if (!isNaN(Number(currentTapsLeftcal))) {
                  // console.log(
                  //   "🚀 ~ update ~ currentTapsLeftcal:",
                  //   currentTapsLeftcal
                  // );
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

    if (typeof window !== "undefined") {
      executeEffect();
    } else {
      setTimeout(executeEffect, 10);
    }
  }, []);

  useEffect(() => {


    const executeEffect = () => {
      const getLastLoginTimeFromLocalStorage = (): number | null => {
        const lastLogin = window.localStorage.getItem("lastLoginTime");
        return lastLogin ? parseInt(lastLogin, 10) : null;
      };

      const lastLoginTimeFromLocalStorage = getLastLoginTimeFromLocalStorage();
      const user = window.localStorage.getItem("authToken");
      const pphReward = async () => {
        if (user || id) {
          const credited = await creditProfitPerHour(
            user || String(id),
            lastLoginTimeFromLocalStorage
          );
          if (
            credited &&
            typeof credited === "object" &&
            "profit" in credited &&
            credited.success &&
            credited.profit
          ) {
            toast.success("Profit Credited");
            // if(points != 0) {

              window.localStorage.setItem(
                "points",
                (points + credited?.profit).toString()
              );
              addPoints(credited.profit);
             
            // }
          }
        }
        setIsLoading(false);
      };

      pphReward();
    };

    if (typeof window !== "undefined") {
      executeEffect();
    } else {
      setTimeout(executeEffect, 10);
    }
  }, []);
  return points;
};

export default useUserPointsConfig;
