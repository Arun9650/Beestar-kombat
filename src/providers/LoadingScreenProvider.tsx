"use client";

import { ReactNode, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import useLoadingScreenStore from "@/store/loadingScreenStore";
import { usePointsStore } from "@/store/PointsStore";
import useUserPointsConfig from "@/hooks/useUserPointsConfig";
import WebApp from "@twa-dev/sdk"
import { UpdateUser } from "@/actions/user.actions";
import { BackButton } from "@telegram-apps/sdk";
import { initBackButton } from '@telegram-apps/sdk';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { usePathname, useRouter } from "next/navigation";
const LoadingScreenProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useLoadingScreenStore();
  usePointsStore();

  const pathname = usePathname(); // Use usePathname to get the current path

  
  
  useEffect(() => {
    function initTg() {
      if (typeof window !== 'undefined') {
        WebApp.ready()
        WebApp.expand()
        WebApp.disableVerticalSwipes()
        WebApp.setHeaderColor('#000000');
        WebApp.BackButton.onClick( () => window.history.back() );
        const [backButton] = initBackButton();
      backButton.show();
      // Conditionally show or hide the back button based on the current route
      if (pathname === "/") {
        // If on home screen, hide the back button
        backButton.hide();
      } else {
        // Otherwise, show the back button and set up its behavior
        backButton.show();
        backButton.on("click", () => window.history.back());
      }

  } else {
    console.log('Telegram WebApp is undefined, retrying…');
    setTimeout(initTg, 500);
    }
    }
    initTg();
  }, [pathname]);

  



  useEffect(() => {


    const updateUser = async () => {
      const user = window.localStorage.getItem("authToken");

      if (user) {
        await UpdateUser(user);
      }
    }

    updateUser();
    
  }, [isLoading]);

  if (!isLoading) {
    return <LoadingScreen />;
  }

  return <div>{children}</div>;
};

export default LoadingScreenProvider;
