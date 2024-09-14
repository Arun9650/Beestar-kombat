"use client";

import { authenticateUserOrCreateAccount } from '@/actions/auth.actions'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'
import randomName from '@scaleway/random-name'
import { usePointsStore } from '@/store/PointsStore'
import { retrieveLaunchParams } from '@telegram-apps/sdk'; // Import Telegram WebApp SDK

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const params = useSearchParams();
    const id = useRef(params.get('id'));
    const userName = useRef(params.get('userName') || randomName());
    const referredByUser = params.get('referredByUser');
    const isPremium = useRef(params.get('is_premium')); // Track is_premium parameter

    const { setUserId, setCurrentTapsLeft, addPoints } = usePointsStore();

    useEffect(() => {
        const authToken = window.localStorage.getItem('authToken');

        const authentication = async () => {
            // Initialize Telegram WebApp and get userId, userName, and is_premium from initData
            if (typeof window !== 'undefined') {
                const { initDataRaw, initData } = retrieveLaunchParams();
                const userIdFromTelegram = initData?.user?.id; // Get user ID from Telegram
                const userNameFromTelegram = initData?.user?.username; // Get Telegram username
                const isPremiumFromTelegram = initData?.user?.isPremium; // Get Telegram is_premium status

                console.log("🚀 ~ userIdFromTelegram:", userIdFromTelegram);
                console.log("🚀 ~ userNameFromTelegram:", userNameFromTelegram);
                console.log("🚀 ~ isPremiumFromTelegram:", isPremiumFromTelegram);

                // If the `id` is not present in the URL, use Telegram's userId and append it to the URL
                if (!id.current && userIdFromTelegram) {
                    id.current = userIdFromTelegram.toString();
                }

                // If the `userName` is not present in the URL, set it to Telegram username or generate random one
                if (!userName.current && userNameFromTelegram) {
                    userName.current = userNameFromTelegram;
                }

                // If the `is_premium` is not present in the URL, set it based on Telegram's is_premium status
                if (!isPremium.current && isPremiumFromTelegram !== undefined) {
                    isPremium.current = isPremiumFromTelegram ? "true" : "false";
                }

              
            }

            if (!authToken && authToken !== id.current) {
                const referredByUserValue = referredByUser ?? undefined;

                const authenticate = await authenticateUserOrCreateAccount({
                    chatId: id.current!,
                    userName: userName.current!,
                    referredByUser: referredByUserValue
                });
                console.log("🚀 ~ authentication ~ authenticate:", authenticate);

                switch (authenticate) {
                    case 'createdByReferral':
                        console.log("Account by referral created successfully");
                        window.localStorage.setItem('authToken', `${id.current}`);
                        window.localStorage.setItem('userName', `${userName.current}`);
                        window.localStorage.setItem('is_premium', `${isPremium.current}`);
                        window.localStorage.setItem("currentTapsLeft", '500');
                        window.localStorage.setItem("points", "5000");
                        setCurrentTapsLeft(500);
                        addPoints(5000);
                        setUserId(id.current!);
                        break;

                    case 'createdNewAccount':
                        console.log("Account created successfully");
                        window.localStorage.setItem('authToken', `${id.current}`);
                        window.localStorage.setItem('userName', `${userName.current}`);
                        window.localStorage.setItem('is_premium', `${isPremium.current}`);
                        window.localStorage.setItem("currentTapsLeft", '500');
                        setCurrentTapsLeft(500);
                        setUserId(id.current!);
                        break;

                    case 'userAlreadyExists':
                        console.log("User already exists, authenticated successfully");
                        window.localStorage.setItem('authToken', `${id.current}`);
                        window.localStorage.setItem('userName', `${userName.current}`);
                        window.localStorage.setItem('is_premium', `${isPremium.current}`);
                        setUserId(id.current!);
                        break;

                    case 'unknownError':
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
    }, []); // Empty dependency array to run only on initial render

    return (
        <div>
            {children}
        </div>
    );
};

const AuthProviderWithSuspense = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>{children}</AuthProvider>
    </Suspense>
);

export default AuthProviderWithSuspense;
