"use client";

import { authenticateUserOrCreateAccount } from "@/actions/auth.actions";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import randomName from "@scaleway/random-name";
import { usePointsStore } from "@/store/PointsStore";
import toast from "react-hot-toast";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import useAuthFix from "@/store/useFixAuth";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useSearchParams();

  useAuthFix();
  const { setUserId, setCurrentTapsLeft, addPoints } = usePointsStore();

  // The whole app keys off this Telegram user id. It can come from the URL
  // (?id=) or from the Telegram launch data. We keep it in state so that, if
  // telegram-web-app.js is not ready at first render, a short retry can still
  // populate it instead of leaving `id` null (which crashed the app).
  const [id, setId] = useState<string | null>(() => params.get("id"));
  const [userName, setUserName] = useState<string>(
    () => params.get("userName") ?? randomName()
  );
  const [referredByUser, setReferredByUser] = useState<string | undefined>(
    () => params.get("referredByUser") ?? undefined
  );

  // Resolve Telegram launch data from every available source, retrying briefly
  // because the Telegram WebApp script may load slightly after hydration.
  useEffect(() => {
    if (id) return; // already resolved from the URL

    let cancelled = false;
    let attempts = 0;

    const tryResolve = (): boolean => {
      let tgId: string | number | undefined;
      let firstName: string | undefined;
      let startParam: string | undefined;

      // 1) @telegram-apps/sdk — parses launch params from the URL hash.
      try {
        const lp = retrieveLaunchParams();
        tgId = lp.initData?.user?.id;
        firstName = lp.initData?.user?.firstName;
        startParam = lp.startParam;
      } catch {
        // Not inside Telegram, or the launch params aren't available yet.
      }

      // 2) telegram-web-app.js global — injected directly by the Telegram
      //    client and often more reliable than the URL hash.
      if (tgId == null && typeof window !== "undefined") {
        const unsafe = (window as any)?.Telegram?.WebApp?.initDataUnsafe;
        if (unsafe?.user?.id != null) {
          tgId = unsafe.user.id;
          firstName = firstName ?? unsafe.user.first_name;
          startParam = startParam ?? unsafe.start_param;
        }
      }

      if (tgId == null || cancelled) return false;

      setId(String(tgId));
      if (firstName && !params.get("userName")) setUserName(firstName);
      setReferredByUser((prev) => prev ?? startParam);
      return true;
    };

    if (tryResolve()) return;

    // Retry for ~3s (20 x 150ms) in case the WebApp script loads late.
    const interval = setInterval(() => {
      attempts += 1;
      if (tryResolve() || attempts >= 20) clearInterval(interval);
    }, 150);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, params]);

  // Keep the id in the URL so the rest of the app (which reads ?id=) works.
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.get("id")) {
      currentUrl.searchParams.set("id", id);
      window.history.replaceState(null, "", currentUrl.toString());
    }
  }, [id]);

  // Authenticate once we actually have an id — never with a null/"null" id.
  useEffect(() => {
    if (!id) return;

    const authentication = async () => {
      const authToken = window.localStorage.getItem("authToken");

      // Already authenticated as this user.
      if (authToken === id) {
        console.log("Already authenticated", authToken);
        setUserId(id);
        return;
      }

      const authenticate = await authenticateUserOrCreateAccount({
        chatId: id,
        userName,
        referredByUser,
      });
      console.log("🚀 ~ authentication ~ authenticate:", authenticate);

      switch (authenticate) {
        case "createdByReferral":
          window.localStorage.setItem("authToken", id);
          window.localStorage.setItem("userName", userName);
          window.localStorage.setItem("currentTapsLeft", "500");
          window.localStorage.setItem("points", "5000");
          setCurrentTapsLeft(500);
          addPoints(5000);
          toast.success(
            `Welcome ${userName}! You have been referred by ${referredByUser}`
          );
          setUserId(id);
          break;
        case "createdNewAccount":
          window.localStorage.setItem("authToken", id);
          window.localStorage.setItem("userName", userName);
          window.localStorage.setItem("currentTapsLeft", "500");
          setCurrentTapsLeft(500);
          toast.success(`Welcome ${userName}!`);
          setUserId(id);
          break;
        case "userAlreadyExists":
          window.localStorage.setItem("authToken", id);
          window.localStorage.setItem("userName", userName);
          setUserId(id);
          break;
        case "unknownError":
        default:
          alert("Could not authenticate you");
          break;
      }
    };

    authentication();
  }, [id]);

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
