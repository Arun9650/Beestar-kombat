
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { SlArrowRight } from "react-icons/sl";
import { useRouter } from 'next/navigation';
import useExchangeStore from '@/store/useExchangeStore';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import Image from 'next/image';
import { dollarCoin } from '../../../public/newImages';
import { Button } from '@/components/ui/button';
import { DeleteUser } from '@/actions/user.actions';

const Settings = () => {

  const {exchange} = useExchangeStore();

  const router = useRouter();

  const [buttonLoading, setButtonLoading] = useState(false);
   const [isDrawerOpen,setIsDrawerOpen] = useState(false);


   const handleDeleteUser = async () => {

    const userId = window.localStorage.getItem("authToken");
    setButtonLoading(true);
    const result = await DeleteUser(userId!);

    if(result.success){
      setButtonLoading(false);
      router.push('/')
    }

   }

  return (
    <div className="h-screen bg-black text-white">
      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-2">
          <div className="bg-[#1d2025] p-4 rounded-2xl flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Select language</h3>
            <p className="text-gray-400 text-xs">English</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div onClick={() => {router.push('exchange')}} className="bg-[#1d2025] p-4 rounded-2xl  flex items-center justify-between">
            <div>
            <h3 className="text-sm font-medium">Choose exchange</h3>
            <p className="text-gray-400 text-xs">{exchange.name}</p>
            </div>
            <SlArrowRight className='text-gray-400' />
          </div>
          <div onClick={() => setIsDrawerOpen(true)} className="bg-[#1d2025] p-4 rounded-2xl  flex items-center justify-between">
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
