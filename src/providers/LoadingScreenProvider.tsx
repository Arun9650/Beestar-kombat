"use client";

import { ReactNode, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import useUserPointsConfig from "@/hooks/useUserPointsConfig";
import WebApp from "@twa-dev/sdk"
const LoadingScreenProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoadingScreenStore();
  usePointsStore();

  useUserPointsConfig();




  useEffect(() => {
    console.log('useTelegram')
    function initTg() {
    if (typeof window !== 'undefined') {
    console.log('Telegram WebApp is set');
    WebApp.ready()
    WebApp.expand()
    } else {
    console.log('Telegram WebApp is undefined, retrying…');
    setTimeout(initTg, 500);
    }
    }
    initTg();
  }, []);



  useEffect(() => {


    console.log(isLoading);
  }, [isLoading]);

  if (!isLoading) {
    return <LoadingScreen />;
  }

  return <div>{children}</div>;
};

export default LoadingScreenProvider;
