"use client"

import { authenticateUserOrCreateAccount } from '@/actions/auth.actions'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'
import randomName from '@scaleway/random-name'
import { usePointsStore } from '@/store/PointsStore'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const params = useSearchParams()
    const id = params.get('id')
    console.log("🚀 ~ AuthProvider ~ id:", id)
    let userName;
    const user = params.get('userName');
    const referredByUser = params.get('referredByUser');

    if(user){
        userName = user;
    }else {
        userName = randomName()
    }

    const { setUserId, setCurrentTapsLeft , addPoints} = usePointsStore();

    useEffect(() => {
        const authToken = window.localStorage.getItem('authToken')
        console.log("🚀 ~ useEffect ~ authToken:", authToken)
        const authentication = async () => {
            if (!authToken && authToken != id) {
                const referredByUserValue = referredByUser ?? undefined; 

                const authenticate = await authenticateUserOrCreateAccount({ chatId: id!, userName: userName!, referredByUser: referredByUserValue })
                console.log("🚀 ~ authentication ~ authenticate:", authenticate)
                
                switch (authenticate) {
                    
                    case  'createdByReferral': 
                        console.log("Account by referral created successfully");
                        window.localStorage.setItem('authToken', `${id}`);
                        window.localStorage.setItem('userName', `${userName}`);
                        window.localStorage.setItem("currentTapsLeft", '500');
                        window.localStorage.setItem("points", "5000");
                        setCurrentTapsLeft(500);
                        addPoints(5000);

                        setUserId(id!);


                    case 'createdNewAccount':
                        console.log("Account created successfully");
                        window.localStorage.setItem('authToken', `${id}`);
                        window.localStorage.setItem('userName', `${userName}`);
                        window.localStorage.setItem("currentTapsLeft", '500');
                        setCurrentTapsLeft(500);

                        setUserId(id!);
                        break;
                    case 'userAlreadyExists':
                        console.log("User already exists, authenticated successfully");
                        window.localStorage.setItem('authToken', `${id}`);
                        window.localStorage.setItem('userName', `${userName}`);
                        setUserId(id!);
                        break;
                    case 'unknownError':
                    default:
                        alert("Could not authenticate you");
                        break;
                }
            } else { 
                console.log("Already authenticated", authToken);
                setUserId(id!); // Ensure the user ID is set even if already authenticated
            }
        }

        authentication()
    }, [])

    return (
        <div>
            {children}
        </div>
    )
}

const AuthProviderWithSuspense = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>{children}</AuthProvider>
    </Suspense>
)

export default AuthProviderWithSuspense
