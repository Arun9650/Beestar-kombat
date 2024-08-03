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
    <div className='bg-[#1d2025] h-full text-white/80 overflow-y-auto'>
    <section className="flex  items-center    justify-between flex-col   ">
    <Header/>
    <DailyItems/>
      <CurrentPoints />
      <TapGlobe />
    </section>
      <div className='flex flex-col w-fit ml-4  gap-y-4'>
        <GameLevelProgress />
      </div>
    </div>
  );
}
