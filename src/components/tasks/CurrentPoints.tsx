'use client'
import PointsTracker from '../game/PointsTracker'


const CurrentPoints = ({ type }: { type?: 'sm' }) => {

    return  <div className="flex  flex-col gap-y-6 py-4">
        <PointsTracker />

    </div>
}

export default CurrentPoints