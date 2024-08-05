import DailyItems from '@/components/DailyItems';
import GameLevelProgress from '@/components/game/GameLevelProgress';
import TapGlobe from '@/components/game/Globe';
import Header from '@/components/Header';
import CurrentPoints from '@/components/tasks/CurrentPoints';

export default function Home() {


  

  return (
    <div className='bg-[#1d2025] h-full text-white/80 overflow-y-auto'>
    <section className="flex  items-center    justify-between flex-col   ">
    <Header/>
    <DailyItems/>
      <CurrentPoints />
      <TapGlobe />
    </section>
      <div className='flex flex-col  px-4  gap-y-4'>
        <GameLevelProgress />
      </div>
    </div>
  );
}
