"use client"

import { usePointsStore } from '@/store/PointsStore'
import Image from 'next/image'
import React from 'react'
import { formatNumber } from '../../../utils/formatNumber'

const PointsTracker = () => {
    const { points } = usePointsStore()

    return (
        <div className='font-bold text-3xl flex items-center gap-2 text-white'>
            <span className='text-6xl'>
                <Image src="/assets/images/dollar-coin.png" height={40} width={40} alt="" />
            </span>
            {formatNumber(points)}
        </div>
    )
}

export default PointsTracker