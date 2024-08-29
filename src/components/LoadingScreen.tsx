'use client'

import useUserPointsConfig from "@/hooks/useUserPointsConfig"
import useLoadingScreenStore from "@/store/loadingScreenStore"
import Image from "next/image"
import { useEffect, useState } from "react"

const LoadingScreen = () => {

    const [value, setValue] = useState(0)
    const { setIsLoading, isLoading } = useLoadingScreenStore()
    useUserPointsConfig();

    // useEffect(() => {
    //     setTimeout(() => {
    //         value <= 99 && setValue(() => value + 1)
    //     }, 10)
    // }, [value])

    // useEffect(() => {
    //     value >= 99 && setIsLoading(false);
    // }, [value])

    useEffect(() => {
    }, [isLoading])

    return (
        <main className='h-screen w-screen bg-primary px-4 flex flex-col gap-[30px] items-center justify-center text-white font-bold text-xl'>
            <div>
                <Image src="/newImages/sponsorImage.png" alt="icons" width={150} height={150} />
            </div>
            <div className="mx-auto text-xs  text-center">
            Bee Trade Finance (BTF) is a decentralised cryptocurrency exchange with a centralised orderbook that allows multiple trades to be processed simultaneously by the system, without having to wait for all nodes to confirm each transaction individually.

            </div>
            <div>
                {/* {value}% */}
            </div>
            <div className="text-xs">
            Powered  by Bee Trade Finance
            </div>
        </main>
    )
}

export default LoadingScreen