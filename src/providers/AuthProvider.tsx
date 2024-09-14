"use client";

import { authenticateUserOrCreateAccount } from "@/actions/auth.actions";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import randomName from "@scaleway/random-name";
import { usePointsStore } from "@/store/PointsStore";
import { retrieveLaunchParams } from "@telegram-apps/sdk"; // Import Telegram WebApp SDK

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const id = useRef(params.get("id"));
  const userName = useRef(params.get("userName") || randomName());
  const referredByUser = params.get("referredByUser");

  const { setUserId, setCurrentTapsLeft, addPoints } = usePointsStore();

  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");

    const authentication = async () => {
      // Initialize Telegram WebApp
      if (typeof window !== "undefined") {
        const { initDataRaw, initData } = retrieveLaunchParams();
        const userIdFromTelegram = initData?.user?.id;
        const userNameFromTelegram = initData?.user?.firstName;
        const is_premium = initData?.user?.isPremium;
        // Get user ID from Telegram
        console.log("🚀 ~ userIdFromTelegram:", userIdFromTelegram);

        // Use Telegram user ID as the id
        const currentUrl = new URL(window.location.href);
        if (userIdFromTelegram) {
          id.current = userIdFromTelegram.toString();
          // Append the `id` to the URL without reloading the page
          currentUrl.searchParams.set("id", id.current);
          currentUrl.searchParams.set("userName", userName.current);
          currentUrl.searchParams.set('is_premium', String(is_premium));
          window.history.pushState({}, "", currentUrl.toString());
        }

        // If the `userName` is not present in the URL, set it to Telegram username or generate random one
        if (!userName.current && userNameFromTelegram) {
          userName.current = userNameFromTelegram;
        }

        window.history.pushState({}, '', currentUrl.toString());
      }

      if (!authToken && authToken != id.current) {
        const referredByUserValue = referredByUser ?? undefined;

        const authenticate = await authenticateUserOrCreateAccount({
          chatId: id.current!,
          userName: userName.current!,
          referredByUser: referredByUserValue,
        });
        console.log("🚀 ~ authentication ~ authenticate:", authenticate);

        switch (authenticate) {
          case "createdByReferral":
            console.log("Account by referral created successfully");
            window.localStorage.setItem("authToken", `${id.current}`);
            window.localStorage.setItem("userName", `${userName.current}`);
            window.localStorage.setItem("currentTapsLeft", "500");
            window.localStorage.setItem("points", "5000");
            setCurrentTapsLeft(500);
            addPoints(5000);

            setUserId(id.current!);
            break;

          case "createdNewAccount":
            console.log("Account created successfully");
            window.localStorage.setItem("authToken", `${id.current}`);
            window.localStorage.setItem("userName", `${userName.current}`);
            window.localStorage.setItem("currentTapsLeft", "500");
            setCurrentTapsLeft(500);

            setUserId(id.current!);
            break;

          case "userAlreadyExists":
            console.log("User already exists, authenticated successfully");
            window.localStorage.setItem("authToken", `${id.current}`);
            window.localStorage.setItem("userName", `${userName.current}`);
            setUserId(id.current!);
            break;

          case "unknownError":
          default:
            alert("Could not authenticate you");
            break;
        }
      } else {
        console.log("Already authenticated", authToken);
        setUserId(id.current!); // Ensure the user ID is set even if already authenticated
      }
    };

    authentication();
  }, []);

  return <div>{children}</div>;
};

const AuthProviderWithSuspense = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Suspense fallback={<div>Loading...</div>}>
    <AuthProvider>{children}</AuthProvider>
  </Suspense>
);

export default AuthProviderWithSuspense;
