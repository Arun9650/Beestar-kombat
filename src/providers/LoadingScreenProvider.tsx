"use client"

import { ReactNode, useEffect } from "react"
import LoadingScreen from "@/components/LoadingScreen"
import useLoadingScreenStore from "@/store/loadingScreenStore"
import { usePointsStore } from "@/store/PointsStore"
import useUserPointsConfig from "@/hooks/useUserPointsConfig"

const LoadingScreenProvider = ({ children }: { children: ReactNode }) => {
    const { isLoading } = useLoadingScreenStore()
    const { skin } = usePointsStore()

 const result =    useUserPointsConfig()

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading])

    if (!isLoading) {
        return <LoadingScreen />
    }

    return <div >
        {children}
    </div >
}

export default LoadingScreenProvider