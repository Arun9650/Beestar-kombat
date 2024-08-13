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

    const {setUserId} = usePointsStore();
   
    // const id = '123456789'

    // const pointsInLocalStorage = window.localStorage.getItem("points")

    useEffect(() => {
        const authToken = window.localStorage.getItem('authToken')
        const authentication = async () => {
            if (!authToken && authToken != id) {
                const referredByUserValue = referredByUser ?? undefined; 

                const authenticate = await authenticateUserOrCreateAccount({ chatId: id! , userName: userName!, referredByUser: referredByUserValue  })
                console.log("🚀 ~ authentication ~ authenticate:", authenticate)
                if (authenticate === 'success') {
                    window.localStorage.setItem('authToken', `${id}`);
                    window.localStorage.setItem('userName', `${userName}`);
                    setUserId(id!);
                }
                else {
                    alert("Could not authenticate you")
                }

            }
            else { console.log("Authenticated", authToken) }
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