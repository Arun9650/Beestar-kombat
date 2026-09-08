"use client";
import { fixAuthPointsIfGettingUnnecessary } from "@/actions/auth.actions";
import { creditProfitPerHour, getUserConfig } from "@/actions/user.actions";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import useAuthFix from "@/store/useFixAuth";
import { useUserStore } from "@/store/userUserStore";
import { getCurrentUserId } from "@/lib/telegramUser";
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
        // Resolve a valid user id from the auth token, the URL, or the Telegram
        // launch data. On first launch none of these may be ready yet, so wait
        // briefly instead of fetching with a "null" id (which returns no user
        // and leaves the store null forever).
        let validId = getCurrentUserId(id);
        let waited = 0;
        while (!validId && waited < 5000) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          waited += 200;
          validId = getCurrentUserId(id);
        }
        if (!validId) {
          console.warn("[BEESTAR] config: could NOT resolve a user id — skipping config fetch");
          return;
        }
        console.log("[BEESTAR] config: resolved validId =", validId);

        let config = await getUserConfig(validId);

        // getUserConfig returns { userDetails: null } for an unknown chatId;
        // retry a few times in case the account is still being created on the
        // very first launch.
        let retries = 0;
        const maxRetries = 5;
        while (!config?.userDetails && retries < maxRetries) {
          console.log(`Retrying to fetch user info... Attempt ${retries + 1}`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
          config = await getUserConfig(validId);
          retries++;
        }

        
        
        const currentState = config?.user;
        console.log(
          "[BEESTAR] config: userDetails =",
          config?.userDetails ? "FOUND (authenticated)" : "NULL (user not found)",
          "after",
          retries,
          "retries"
        );
        if (config?.userDetails && config ) {
          setUser(config.userDetails);
          console.log("[BEESTAR] config: setUser() called — user store populated");
        }

        // Reveal the app as soon as the user is loaded. Do NOT wait for the
        // profit-credit path (second effect) — that awaits a server action that
        // can hang, which previously left the app stuck on the loading screen.
        console.log("[BEESTAR] loading: dismissing loading screen after auth (first effect)");
        setIsLoading(false);
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
        try {
          const validId = getCurrentUserId(id);
          if (validId) {
            const credited = await creditProfitPerHour(
              validId,
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
              window.localStorage.setItem(
                "points",
                (points + credited?.profit).toString()
              );
              addPoints(credited.profit);
            }
          }
        } catch (err) {
          console.warn("creditProfitPerHour failed:", err);
        } finally {
          // Always dismiss the loading screen, even if profit crediting fails —
          // otherwise the app is stuck on the loading screen forever.
          console.log("[BEESTAR] loading: calling setIsLoading(false) to dismiss loading screen");
          setIsLoading(false);
        }
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
