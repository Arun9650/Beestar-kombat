import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAdsgram } from "@/hooks/useAdsgram";
import toast from 'react-hot-toast';
import axios from 'axios';
import { usePointsStore } from '@/store/PointsStore';


interface MenuItemProps {
  iconSrc: string;
  label: string;
  route?: string;
  onReward?: () => void;
  onError?: (result:any) => void;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ iconSrc, label, route, onReward, onError, onClick }) => {

  

  return (
    <div
    onClick={onClick}
    className='flex flex-col justify-between items-center'
    >

    <div
      className="flex flex-col items-center justify-center bg-[#252423] p-4 rounded-xl border-b-2 border-custom-orange  text-center cursor-pointer hover:bg-gray-800 transition-colors"
      >
      <Image src={iconSrc} alt={label} width={20} height={20} />
    </div>
      <span className="text-white text-[0.5rem] mt-2">{label}</span>
      </div>
  );
};

const MenuGrid = () => {

  const {addPoints} = usePointsStore();
  const search = useSearchParams();
  const id = search.get("id");

  const onReward = useCallback(() => {
    axios.get('https://beestar-kombat-git-ui-change-arun9650s-projects.vercel.app/api/reward?userid=' + id + '', {
    }).then((response) => {
      toast.success(response.data.message || "Reward claimed successfully");
      
      addPoints(5000);

    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  }, [id]);
  const onError = useCallback((result:any) => {
    alert(JSON.stringify(result, null, 4));
  }, []);
  const router = useRouter();


  const showAd = useAdsgram({ blockId: "2953", onReward, onError });


  const menuItems = [
    { iconSrc: '/icons/daily-gift.png', label: 'Daily reward',  onClick: showAd  },
    { iconSrc: '/icons/daily-ciper.png', label: 'Daily Task', route: '/earn', onClick : () =>  router.push(`/earn?${id}`) },
    { iconSrc: '/icons/daily-combo.png', label: 'Daily combo', route: '/daily-combo' },
    { iconSrc: '/icons/Settings.png', label: 'Settings', route: '/settings', onClick: () =>  router.push(`/settings?${id}`) },
    { iconSrc: '/icons/keys.png', label: 'Keys', route: '/keys' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {menuItems.map((item, index) => (
        <MenuItem key={index} iconSrc={item.iconSrc} label={item.label} route={item.route} onClick={item.onClick} />
      ))}
    </div>
  );
};

export default MenuGrid;
