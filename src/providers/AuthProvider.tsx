"use client";

import { authenticateUserOrCreateAccount } from "@/actions/auth.actions";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import randomName from "@scaleway/random-name";
import { usePointsStore } from "@/store/PointsStore";
import toast from "react-hot-toast";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const { startParam, initData } = retrieveLaunchParams();
  const id = params.get("id") ?? initData?.user?.id;
  // console.log("🚀 ~ AuthProvider ~ id:", id)
  let userName;
  const user = params.get("userName") ?? initData?.user?.firstName;
  // toast.success(`startParam: ${startParam}`)
  const referredByUser = params.get("referredByUser") ?? startParam;
  // toast.success(`referredByUser: ${referredByUser}`)
  if (user) {
    userName = user;
  } else {
    userName = randomName();
  }

  const { setUserId, setCurrentTapsLeft, addPoints } = usePointsStore();
   // Ensure that the ID is appended to the URL without triggering re-rendering
   useEffect(() => {
    if (id) {
      const currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.get("id")) {
        currentUrl.searchParams.append("id", String(id));
      }
    }
  }, [id]);

  useEffect(() => {
    const authToken = window.localStorage.getItem("authToken");
    // console.log("🚀 ~ useEffect ~ authToken:", authToken)
    const authentication = async () => {
      if (!authToken && authToken != id) {
        const referredByUserValue = referredByUser ?? undefined;

        const authenticate = await authenticateUserOrCreateAccount({
          chatId: String(id),
          userName: userName!,
          referredByUser: referredByUserValue,
        });
        console.log("🚀 ~ authentication ~ authenticate:", authenticate);

        switch (authenticate) {
          case "createdByReferral":
            console.log("Account by referral created successfully");
            window.localStorage.setItem("authToken", `${id}`);
            window.localStorage.setItem("userName", `${userName}`);
            window.localStorage.setItem("currentTapsLeft", "500");
            window.localStorage.setItem("points", "5000");
            setCurrentTapsLeft(500);
            addPoints(5000);
            toast.success(
              `Welcome ${userName}! You have been referred by ${referredByUserValue}`
            );
            setUserId(String(id));

          case "createdNewAccount":
            console.log("Account created successfully");
            window.localStorage.setItem("authToken", `${id}`);
            window.localStorage.setItem("userName", `${userName}`);
            window.localStorage.setItem("currentTapsLeft", "500");
            setCurrentTapsLeft(500);
            toast.success(`Welcome ${userName}!`);
            setUserId(String(id));

            break;
          case "userAlreadyExists":
            console.log("User already exists, authenticated successfully");
            window.localStorage.setItem("authToken", `${id}`);
            window.localStorage.setItem("userName", `${userName}`);
            setUserId(String(id));
            break;
          case "unknownError":
          default:
            alert("Could not authenticate you");
            break;
        }
        // After authentication, append the `id` to the URL without reloading the page
      } else {
        console.log("Already authenticated", authToken);
        setUserId(String(id)); // Ensure the user ID is set even if already authenticated
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
