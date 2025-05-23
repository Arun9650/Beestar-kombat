import React, { useCallback, useEffect, useState } from 'react';

// Extend the Window interface to include TelegramAdsController
declare global {
  interface Window {
    TelegramAdsController: any;
    showGiga?: () => Promise<any>;
  }
}

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
import AlertBox from '../alertBox/AlertBox';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';

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
      {(label === 'Daily earn' || label === 'Daily combo')  && (
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

  if (typeof window !== 'undefined' && window.TelegramAdsController) {
    window.TelegramAdsController = new window.TelegramAdsController();
    window.TelegramAdsController.initialize({ 
      
      pubId: "949633", 
      
      appId: "354734", 
      
    });
  }
   




  const id = search.get("id") ?? user?.chatId;

  const [adViews, setAdViews] = useState<number>(20); // Default value of 20
  const [adsWatched, setAdsWatched] = useState<number>(0); // Track the number of ads watched
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Drawer state
  const [drawerMessage, setDrawerMessage] = useState<string>(''); // Drawer message

  
  // New state: Daily combo ad limit (1000 per day)
  const [dailyComboViews, setDailyComboViews] = useState<number>(100);
  const [dailyComboAdsWatched, setDailyComboAdsWatched] = useState<number>(0);

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

    const today = new Date().toISOString().slice(0, 10);
    // Daily combo logic (limit 1000)
    const comboSavedDate = localStorage.getItem('dailyComboViewDate');
    const savedComboViews = localStorage.getItem('dailyComboViews');
    const savedComboAdsWatched = localStorage.getItem('dailyComboAdsWatched');
    if (comboSavedDate !== today) {
      localStorage.setItem('dailyComboViewDate', today);
      localStorage.setItem('dailyComboViews', '100');
      setDailyComboViews(100);
      setDailyComboAdsWatched(0);
    } else if (savedComboViews) {
      setDailyComboViews(Number(savedComboViews));
      setDailyComboAdsWatched(Number(savedComboAdsWatched));
    }
  }, []);



  // Function to decrement Daily combo views
  const decrementDailyComboViews = () => {
    const newComboViews = dailyComboViews - 1;
    setDailyComboViews(newComboViews);
    localStorage.setItem('dailyComboViews', newComboViews.toString());
    const newComboAdsWatched = dailyComboAdsWatched + 1;
    setDailyComboAdsWatched(newComboAdsWatched);
    localStorage.setItem('dailyComboAdsWatched', newComboAdsWatched.toString());

  };

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

  const handleAdClickother = () => {
    if ( dailyComboViews > 0) {
      handleDailyCombo(); // Show ad if views are remaining
    } else {
      toast.error("You have reached the daily limit of 100 ads.");
    }
  };
  const handleComingSoon = (message: string) => {
    setDrawerMessage(message); // Set drawer message
    setIsDrawerOpen(true); // Open the drawer
  };

  const handleRichAds = () => {
    if (typeof window !== 'undefined' && window.TelegramAdsController) {
      window.TelegramAdsController.triggerNativeNotification()
        .then((result:any) => {
          // ad was clicked
        })
        .catch((result:any) => {
          // something went wrong or the advertisement was not found
          alert('Something went wrong or the advertisement was not found');
        });
    } else {
      console.log('Window or TelegramAdsController is not defined');
    }
  };


  
  
  // New function to run ads for Daily combo
  const handleDailyCombo = async () => {
    try {
      console.log('Running handleDailyCombo. window.showGiga:', window.showGiga);
      if (!window.showGiga) {
        toast.error('window.showGiga is not defined');
        console.error('window.showGiga is not defined');
        return;
      }
      await window.showGiga();
      // Decrement daily combo views
      decrementDailyComboViews();
      const reward = 25000; // adjust reward as needed
      toast.success(`Daily combo reward claimed: ${reward} points`);
      const response = await axios.get(`https://beestar-kombat-omega.vercel.app/api/reward?userid=${id}`);
      toast.dismiss();
      toast.success(response.data.message || `Reward claimed successfully: ${reward} points`);
      addPoints(reward); // Add reward points
      setPurchaseCompleteAnimation(true);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error running daily combo ads');
      console.error(error);
    }
  };


  const menuItems = [
    { iconSrc: '/icons/daily-gift.png', label: 'Daily earn', onClick: handleAdClick },
    { iconSrc: '/icons/daily-ciper.png', label: 'Daily Task', route: '/earn', onClick: () => router.push(`/earn?${id}`) },
    { iconSrc: '/icons/daily-combo.png', label: 'Daily combo', route: '/daily-combo', onClick: () =>  handleAdClickother()  },
    { iconSrc: '/icons/Settings.png', label: 'Settings', route: '/settings', onClick: () => router.push(`/settings?${id}`) },
    { iconSrc: '/icons/keys.png', label: 'Keys', route: '/keys', onClick: () => handleRichAds()  },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      <BuyCoinAnimation/>
      {/* {
        adsWatched < 20 && <AlertBox showAd={handleAdClick} />
      }
       {dailyComboViews < 100 && (
      <AlertBox showAd={ handleAdClickother } />
    )} */}
      {menuItems.map((item, index) => (
        <MenuItem key={index} iconSrc={item.iconSrc} label={item.label} route={item.route} onClick={item.onClick} adViews={
          item.label === 'Daily earn'
            ? adViews
            : item.label === 'Daily combo'
            ? dailyComboViews
            : undefined
        } />
      ))}
       <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          
          <DrawerContent className="bg-[#14161a] border-none ">
            <DrawerHeader 
              onClick={() => setIsDrawerOpen(false)}
              className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
            >
              <div className="p-3 px-5 bg-[#252423] rounded-full">x</div>
            </DrawerHeader>
            <div className="text-center">
              {/* <Image
                src={selectedSkin.image}
                alt={selectedSkin.name}
                width={100}
                height={100}
                className="mx-auto mb-4"
              /> */}
              <h2 className="text-2xl font-medium text-white mb-2">
                {/* {selectedSkin.name} */}
                Comming Soon
              </h2>
              {/* <p className="text-white">
                {selectedSkin.league !== levelNames[levelIndex] && (
                  <span className="text-custom-orange">
                    You need to be at {selectedSkin.league}
                  </span>
                )}
              </p>
              <p className="text-white">
                <br />
                <span className="text-white  flex max-w-fit mx-auto gap-2">
                  <Image src={dollarCoin} alt="coin" width={20} height={20} />
                  +{selectedSkin.cost}
                </span>
              </p>
                  */}
            </div>

            <DrawerFooter>
              <Button
                // disabled={
                //   points < selectedSkin.cost ||
                //   // selectedSkin.league !== levelNames[levelIndex]
                //   !canBuySkin(selectedSkin, userInfo, levelNames)
                // }
                // onClick={() => handleBuySkin(userId!, selectedSkin)}
                className="w-full py-8 bg-custom-orange text-zinc-700 text-xl rounded-lg hover:bg-yellow-700"
              >
                { "Go head"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MenuGrid;
