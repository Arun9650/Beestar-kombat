
'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SlArrowRight } from "react-icons/sl";
import { useRouter } from 'next/navigation';
import useExchangeStore from '@/store/useExchangeStore';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import Image from 'next/image';
import { dollarCoin } from '../../../public/newImages';
import { Button } from '@/components/ui/button';
import { DeleteUser } from '@/actions/user.actions';
import { usePointsStore } from '@/store/PointsStore';
import { useBoostersStore } from '@/store/useBoostrsStore';

const Settings = () => {

  const {exchange} = useExchangeStore();

  const router = useRouter();
   const {setPoints} = usePointsStore()

  const [buttonLoading, setButtonLoading] = useState(false);
   const [isDrawerOpen,setIsDrawerOpen] = useState(false);


   const {currentTapsLeft, increaseTapsLeft} = usePointsStore()
   const {multiClickLevel} = useBoostersStore()
   
   useEffect(() => {
     const intervalId = setInterval(() => {
     
         increaseTapsLeft();
         const local = parseInt(
           window.localStorage.getItem("currentTapsLeft") ?? "0"
         );
 
         if (local < currentTapsLeft && !isNaN(currentTapsLeft)) {
           window.localStorage.setItem(
             "currentTapsLeft",
             (currentTapsLeft + multiClickLevel).toString()
           );
         }
       
     }, 1000); // Adjust interval as needed
 
     return () => clearInterval(intervalId);
   }, [ currentTapsLeft]);

   const handleDeleteUser = async () => {
    if (typeof window === 'undefined') {
      setTimeout(handleDeleteUser, 10);
      return;
    }
  
    window.localStorage.removeItem("BoostersEnergy");
    window.localStorage.removeItem("exchange");
    window.localStorage.removeItem("points");
    window.localStorage.setItem("points", "0");
    setPoints(0);
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("currentTapsLeft");
    window.localStorage.removeItem("energyCapacity");
    window.localStorage.removeItem("lastLoginDate");
    window.localStorage.removeItem("rechargeVelocity");
    window.localStorage.removeItem("multiClickLevel");
    window.localStorage.removeItem("refill");
    window.localStorage.removeItem("PPH");  
    window.localStorage.removeItem("currentTapLeft");  
    const userId = window.localStorage.getItem("authToken");
    setButtonLoading(true);
    const result = await DeleteUser(userId!);
    console.log("🚀 ~ handleDeleteUser ~ result:", result);
    
    window.localStorage.removeItem("authToken");
  
    if (result.success) {
      setButtonLoading(false);
      router.push('/');
    }
  };

  return (
    <div className="h-screen bg-black bg-opacity-60 backdrop-blur-none rounded-t-3xl top-glow border-t-4 border-[#f3ba2f] text-white">
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-2">
          <div className="bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  p-4 rounded-2xl flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Select language</h3>
            <p className="text-gray-400 text-xs">English</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div onClick={() => {router.push('exchange')}} className="bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  p-4 rounded-2xl  flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Choose exchange</h3>
            <p className="text-gray-400 text-xs">{exchange.name}</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div onClick={() => setIsDrawerOpen(true)} className="bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  p-4 rounded-2xl  flex items-center justify-between">
            <h3 className="text-sm font-medium">Delete account</h3>
            <SlArrowRight className='text-gray-400' />
          </div>
          {
             <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            
               <DrawerContent className="bg-[#14161a] border-none ">
                 <DrawerHeader
                   onClick={() => setIsDrawerOpen(false)}
                   className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
                 >
                   <div className="p-3 px-5 bg-[#1C1F23] rounded-full">x</div>
                 </DrawerHeader>
                 <div className="text-center">
                   
                   <h2 className="text-xl px-2 font-medium text-white mb-2">
                     {/* {selectedTeam.title} */}
                     Are you sure you want to delete your account?
                   </h2>
                   <p className="text-white text-xs px-2 mb-4 max-w-96 font-light mx-auto">
                     {/* {selectedTeam.description} */}
                     All your data, including game progress, achievements, and purchases, will be permanently deleted.
                     This action cannot be undone.

                   </p>
                   
                   </div>
 
                 <DrawerFooter>
                   <Button
                     onClick={() =>
                      handleDeleteUser()
                     }
                     className="w-full py-4 bg-red-500 text-white text-md rounded-lg "
                   >
                     {buttonLoading ? "Loading" : "Delete account"}
                   </Button>
                   <Button onClick={() => setIsDrawerOpen(false)} className="w-full py-4 bg-[#1C1F23] text-white text-md rounded-lg ">
                    Cancel
                   </Button>
                 </DrawerFooter>
               </DrawerContent>
           </Drawer>
          }
        </div>
        <div className="mt-8 text-center">
          <Link href="#">
            <p className="text-gray-400">Privacy policy</p>
          </Link>
        </div>

      </main>
    
    </div>
  );
};

export default Settings;
