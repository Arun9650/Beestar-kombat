import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAdsgram } from "@/hooks/useAdsgram";
import toast from 'react-hot-toast';
import axios from 'axios';
import { usePointsStore } from '@/store/PointsStore';
import { DateTime } from 'luxon'; // Importing Luxon
import { useUserStore } from '@/store/userUserStore';
import BuyCoinAnimation from '../coinanimation/BuyCoinAnimation';
import useAnimationStore from '@/store/useAnimationStore';

interface MenuItemProps {
  iconSrc: string;
  label: string;
  route?: string;
  onReward?: () => void;
  onError?: (result: any) => void;
  onClick?: () => void;
  adViews?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  iconSrc,
  label,
  route,
  onReward,
  onError,
  onClick,
  adViews,
}) => {
  return (
    <div onClick={onClick} className='flex flex-col justify-between items-center relative'>
      <div className="flex flex-col items-center justify-center bg-[#252423] p-4 rounded-xl border-b-2 border-custom-orange text-center cursor-pointer hover:bg-gray-800 transition-colors">
        <Image src={iconSrc} alt={label} width={20} height={20} />
      </div>
      <span className="text-white text-[0.5rem] mt-2">{label}</span>
      {label === 'Daily earn' && (
        <div className='absolute -top-2 -right-2 rounded-full text-[0.6rem] w-6 h-6 bg-white bg-opacity-10 flex items-center justify-center'>
          {adViews}
        </div>
      )}
    </div>
  );
};

const MenuGrid = () => {
  const { addPoints } = usePointsStore();
  const { user } = useUserStore();
  const {setPurchaseCompleteAnimation} = useAnimationStore()
  const search = useSearchParams();

  const id = search.get("id") ?? user?.chatId;

  const [adViews, setAdViews] = useState<number>(20); // Default value of 20
  const [adsWatched, setAdsWatched] = useState<number>(0); // Track the number of ads watched

  // Function to get current local date in 'YYYY-MM-DD' format using Luxon
  const getCurrentDate = () => {
    return DateTime.local().toISODate(); // Returns YYYY-MM-DD in the user's local timezone
  };

  // Check local storage for the current day's ad views
  useEffect(() => {
    const savedDate = window.localStorage.getItem('adViewDate');
    const savedViews = window.localStorage.getItem('adViews');
    const savedAdsWatched = window.localStorage.getItem('adsWatched') || '0'; // Get number of ads watched

    // Reset ad views if the date has changed
    if (savedDate !== getCurrentDate()) {
      window.localStorage.setItem('adViewDate', getCurrentDate());
      window.localStorage.setItem('adViews', '20');
      window.localStorage.setItem('adsWatched', '0');
      setAdViews(20); // Reset adViews to 20
      setAdsWatched(0); // Reset adsWatched to 0
    } else if (savedViews) {
      setAdViews(Number(savedViews));
      setAdsWatched(Number(savedAdsWatched));
    }
  }, []);

  // Function to increment ad views and update local storage
  const decrementAdViews = () => {
    const newViews = adViews - 1;
    setAdViews(newViews);
    localStorage.setItem('adViews', newViews.toString());
    const newAdsWatched = adsWatched + 1;
    setAdsWatched(newAdsWatched); // Update ads watched count
    localStorage.setItem('adsWatched', newAdsWatched.toString());
  };

  const onReward = useCallback(() => {
    const reward = 5000 * (adsWatched + 1); // Reward increases by 5000 with each ad
    toast.loading('Claiming reward...');
    axios.get(`https://beestar-kombat-omega.vercel.app/api/reward?userid=${id}`)
      .then((response) => {
        toast.dismiss();
        toast.success(response.data.message || `Reward claimed successfully: ${reward} points`);
        addPoints(reward); // Add reward points
        decrementAdViews(); // Decrement ad view count on reward
        setPurchaseCompleteAnimation(true);
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Error claiming reward');
      });
  }, [addPoints, id, adViews, adsWatched]);

  const onError = useCallback((result: any) => {
    toast.error('An error occurred while showing the ad', result.data);
    console.error("Ad error:", result);
  }, []);

  const router = useRouter();

  const showAd = useAdsgram({ blockId: "2794", onReward, onError });

  // Function to check if the user has reached the ad view limit
  const handleAdClick = () => {
    if (adViews > 0) {
      showAd(); // Show ad if views are remaining
    } else {
      toast.error("You have reached the daily limit of 20 ads.");
    }
  };

  const menuItems = [
    { iconSrc: '/icons/daily-gift.png', label: 'Daily earn', onClick: handleAdClick },
    { iconSrc: '/icons/daily-ciper.png', label: 'Daily Task', route: '/earn', onClick: () => router.push(`/earn?${id}`) },
    { iconSrc: '/icons/daily-combo.png', label: 'Daily combo', route: '/daily-combo' },
    { iconSrc: '/icons/Settings.png', label: 'Settings', route: '/settings', onClick: () => router.push(`/settings?${id}`) },
    { iconSrc: '/icons/keys.png', label: 'Keys', route: '/keys' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      <BuyCoinAnimation/>
      {menuItems.map((item, index) => (
        <MenuItem key={index} iconSrc={item.iconSrc} label={item.label} route={item.route} onClick={item.onClick} adViews={item.label === 'Daily earn' ? adViews : undefined} />
      ))}
    </div>
  );
};

export default MenuGrid;
