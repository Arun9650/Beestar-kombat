"use client";

import { authenticateUserOrCreateAccount } from '@/actions/auth.actions';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import randomName from '@scaleway/random-name';
import { usePointsStore } from '@/store/PointsStore';
import { retrieveLaunchParams } from '@telegram-apps/sdk'; // Import Telegram WebApp SDK

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const params = useSearchParams();
    
    // Use state instead of ref for parameters that might change
    const [id, setId] = useState(params.get('id'));
    const [userName, setUserName] = useState(params.get('userName') || randomName());
    const [referredByUser, setReferredByUser] = useState(params.get('referredByUser'));
    const [isPremium, setIsPremium] = useState(params.get('is_premium')); // Track is_premium parameter

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
                const referredByUserTelegram = initData?.startParam; // Get Telegram startParam (referredByUser)

                console.log("🚀 ~ userIdFromTelegram:", userIdFromTelegram);
                console.log("🚀 ~ userNameFromTelegram:", userNameFromTelegram);
                console.log("🚀 ~ isPremiumFromTelegram:", isPremiumFromTelegram);

                // If the `id` is not present in the URL, use Telegram's userId and append it to the URL
                if (!id && userIdFromTelegram) {
                    setId(userIdFromTelegram.toString());
                }

                // If the `userName` is not present in the URL, set it to Telegram username or generate random one
                if (!userName && userNameFromTelegram) {
                    setUserName(userNameFromTelegram);
                }

                // If the `is_premium` is not present in the URL, set it based on Telegram's is_premium status
                if (!isPremium && isPremiumFromTelegram !== undefined) {
                    setIsPremium(isPremiumFromTelegram ? "true" : "false");
                }

                if (!referredByUser && referredByUserTelegram) {
                    setReferredByUser(referredByUserTelegram);
                }

                // Append the `id`, `userName`, and `is_premium` to the URL without reloading the page
                const currentUrl = new URL(window.location.href);
                if (!currentUrl.searchParams.get('id') && id) {
                    currentUrl.searchParams.set('id', id);
                }
                if (!currentUrl.searchParams.get('userName') && userName) {
                    currentUrl.searchParams.set('userName', userName);
                }
                if (!currentUrl.searchParams.get('is_premium') && isPremium) {
                    currentUrl.searchParams.set('is_premium', isPremium);
                }
                if (!currentUrl.searchParams.get('referredByUser') && referredByUser) {
                    currentUrl.searchParams.set('referredByUser', referredByUser);
                }
                window.history.pushState({}, '', currentUrl.toString());
            }

            // Ensure authToken and id exist before proceeding
            if (!authToken && id) {
                const authenticate = await authenticateUserOrCreateAccount({
                    chatId: id!,
                    userName: userName!,
                    referredByUser: referredByUser || undefined
                });
                console.log("🚀 ~ authentication ~ authenticate:", authenticate);

                switch (authenticate) {
                    case 'createdByReferral':
                        console.log("Account by referral created successfully");
                        window.localStorage.setItem('authToken', id);
                        window.localStorage.setItem('userName', userName);
                        window.localStorage.setItem('is_premium', isPremium || 'false');
                        window.localStorage.setItem('referredByUser', referredByUser || '');
                        window.localStorage.setItem("currentTapsLeft", '500');
                        window.localStorage.setItem("points", "5000");
                        setCurrentTapsLeft(500);
                        addPoints(5000);
                        setUserId(id!);
                        break;

                    case 'createdNewAccount':
                        console.log("Account created successfully");
                        window.localStorage.setItem('authToken', id);
                        window.localStorage.setItem('userName', userName);
                        window.localStorage.setItem('is_premium', isPremium || 'false');
                        window.localStorage.setItem('referredByUser', referredByUser || '');
                        window.localStorage.setItem("currentTapsLeft", '500');
                        setCurrentTapsLeft(500);
                        setUserId(id!);
                        break;

                    case 'userAlreadyExists':
                        console.log("User already exists, authenticated successfully");
                        window.localStorage.setItem('authToken', id);
                        window.localStorage.setItem('userName', userName);
                        window.localStorage.setItem('is_premium', isPremium || 'false');
                        window.localStorage.setItem('referredByUser', referredByUser || '');
                        setUserId(id!);
                        break;

                    case 'unknownError':
                    default:
                        alert("Could not authenticate you");
                        break;
                }
            } else if (authToken) {
                console.log("Already authenticated", authToken);
                setUserId(id!); // Ensure the user ID is set even if already authenticated
            }
        };

        authentication();
    }, []); // Dependencies to trigger effect when values change

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
