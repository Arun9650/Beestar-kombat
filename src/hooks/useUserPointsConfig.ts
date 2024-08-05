"use client";
import { creditProfitPerHour, getUserConfig } from "@/actions/user.actions";
import { usePointsStore } from "@/store/PointsStore";
import { useBoostersStore } from "@/store/useBoostrsStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useUserPointsConfig = () => {
  const {
    energyCapacity,
    setEnergyCapacity,
    rechargeVelocity,
    setRechargeVelocity,
    multiClickLevel,
    setMultiClickLevel,
  } = useBoostersStore();

  const { points,  initializePoints, initializePPH } = usePointsStore()


  useEffect(() => {
    const user = window.localStorage.getItem("authToken");
    let initialPoints = window.localStorage.getItem("points")
    console.log("🚀 ~ useEffect ~ initialPoints:", initialPoints)
    async function update() {
      const config = await getUserConfig(`${user}`);
      const currentState = config.user;
      console.log("🚀 ~ update ~ currentState:", currentState.points)



      if (energyCapacity < currentState.capacity) {
        setEnergyCapacity(currentState.capacity);
      }
      if (rechargeVelocity < currentState.recharge) {
        setRechargeVelocity(currentState.recharge);
      }
      if (multiClickLevel < currentState.clicks) {
        setMultiClickLevel(currentState.clicks);
      }


      const intPoints = initialPoints ? Number(initialPoints) : 0
      console.log("🚀 ~ update ~ intPoints:", intPoints)
      const biggerNumber = intPoints > currentState.points ? intPoints : currentState.points;
      console.log("🚀 ~ update ~ biggerNumber:", biggerNumber)
      if (points === 0) {
          intPoints > 0 && initializePoints(biggerNumber)
          initializePPH(currentState.profitPerHour);
      }      
    }

    update();
  }, []);

  useEffect(() => {
    const user = window.localStorage.getItem("authToken");
    const pphReward = async () => {
      if (user) {
        const credited = await creditProfitPerHour(user);

        
        if (credited == "success") {
          toast.success("Profit Credited");
        }
      }
      };

    pphReward();
  }, []);


  return points;
};

export default useUserPointsConfig;
