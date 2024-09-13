"use client";

import { ReactNode, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import useUserPointsConfig from "@/hooks/useUserPointsConfig";
import WebApp from "@twa-dev/sdk";
import { UpdateUser } from "@/actions/user.actions";
import { BackButton, initSwipeBehavior, initViewport } from "@telegram-apps/sdk";
import { initBackButton } from "@telegram-apps/sdk";
const LoadingScreenProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoadingScreenStore();
  usePointsStore();

   const [backButton] = initBackButton();
   const [swipeBehavior] = initSwipeBehavior();
   
   swipeBehavior.enableVerticalSwipe();
   backButton.show();
  

  useEffect(() => {
  async  function initTg() {
      if (typeof window !== "undefined") {
        const [viewport] = initViewport();
      const vp = await viewport;
      if (!vp.isExpanded) {
        vp.expand(); // will expand the Mini App, if it's not
    }
      } else {
        console.log("Telegram WebApp is undefined, retrying…");
        setTimeout(initTg, 500);
      }
    }
    initTg();
  }, []);

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
