import DailyItems from '@/components/DailyItems';
import GameLevelProgress from '@/components/game/GameLevelProgress';
import TapGlobe from '@/components/game/Globe';
import PointsTracker from '@/components/game/PointsTracker';
import Header from '@/components/Header';
import CurrentPoints from '@/components/tasks/CurrentPoints';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Globe } from 'lucide-react';
import Image from 'next/image';
import { FaGlobe, FaGlobeAfrica, FaTrophy } from 'react-icons/fa'

export default function Home() {
  return (
    <section className="flex items-center bg-[#1d2025]    justify-between flex-col   text-white/80 overflow-y-auto">
    <Header/>
    <DailyItems/>
      <CurrentPoints />
      <TapGlobe />
      <div className='flex flex-col gap-y-4'>
        <GameLevelProgress />
      </div>
    </section>
  );
}
