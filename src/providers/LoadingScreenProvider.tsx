"use client";

import { ReactNode, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import useUserPointsConfig from "@/hooks/useUserPointsConfig";
import WebApp from "@twa-dev/sdk";
import { UpdateUser } from "@/actions/user.actions";
import { BackButton, initSwipeBehavior } from "@telegram-apps/sdk";
import { initBackButton } from "@telegram-apps/sdk";
const LoadingScreenProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoadingScreenStore();
  usePointsStore();

   const [backButton] = initBackButton();
   const [swipeBehavior] = initSwipeBehavior();

      swipeBehavior.enableVerticalSwipe();
      backButton.show();

  // useEffect(() => {
  //   function initTg() {
  //     if (typeof window !== "undefined") {
  //       WebApp.ready();
  //       WebApp.expand();
  //       WebApp.disableVerticalSwipes();
  //       WebApp.setHeaderColor("#000000");
  //     } else {
  //       console.log("Telegram WebApp is undefined, retrying…");
  //       setTimeout(initTg, 500);
  //     }
  //   }
  //   initTg();
  // }, []);

  useEffect(() => {
    const updateUser = async () => {
      const user = window.localStorage.getItem("authToken");

      if (user) {
        await UpdateUser(user);
      }
    };

    updateUser();
  }, [isLoading]);

  if (!isLoading) {
    return <LoadingScreen />;
  }

  return <div>{children}</div>;
};

export default LoadingScreenProvider;
