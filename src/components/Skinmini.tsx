"use client";
import React, { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "./ui/drawer";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { dollarCoin } from "../../public/newImages";
import { usePointsStore } from "@/store/PointsStore";
import { skinBuy, SkinsToShow, SkinType } from "@/actions/skins.actions";
import { getUserConfig } from "@/actions/user.actions";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSetCurrentSkin from "@/hooks/mutation/useSetCurrentSkin";
import { setCurrentSkin } from "@/services/apis/axiosFucntions";
import useFetchAllSkin from "@/hooks/query/userFetchAllSkin";
import { useBuySkinMutation } from "@/hooks/mutation/useBuySkinMutation";

const Skinmini = ({ tab }: { tab: string }) => {
  const [selectedSkin, setSelectedSkin] = useState<SkinType>();
  const [skinsData, setSkinsData] = useState<SkinType[]>([]);
  const [leftContainerHeight, setLeftContainerHeight] = useState<number>(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const leftContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [userId, setUserId] = useState<string | null>();

  const [Loading, setLoading] = useState(true);
  const filteredSkins =
    tab === "featured" ? skinsData?.filter((skin) => skin.featured) : skinsData;
  const { points, setPoints, setSkin, userId: user } = usePointsStore();

  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];
  console.log(levelNames[5])

  const levelMinPoints = [
    0, // Bronze
    5000, // Silver
    25000, // Gold
    100000, // Platinum
    1000000, // Diamond
    2000000, // Epic
    10000000, // Legendary
    50000000, // Master
    100000000, // GrandMaster
    1000000000, // Lord
  ];




  const search = useSearchParams();
  const id = search.get("id");

  const {data , isLoading} = useFetchAllSkin(id ?? userId ?? user);

  useEffect(() => {
    const user = window.localStorage.getItem("authToken");
    setUserId(user || id);
    if(data){

      setSkinsData(data);
      setSelectedSkin(data[0]);
    }
  },[data])
  


  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);


  const buySkinMutation = useBuySkinMutation();

  const handleBuySkin = async (userId: string, selectedSkin: any) => {
    if (!selectedSkin) return;

    if (selectedSkin.owned) {
      return;
    }

    if (points < selectedSkin.price) {
      setIsDrawerOpen(false);
      toast.error("Not enough points to buy this skin");
      return;
    }

    setButtonLoading(true);
    const id = selectedSkin.id;
    const localBalance = points;
    const chatId = userId;

    buySkinMutation.mutate({
      skinId:id,
      localBalance,
      chatId,
    }, {
      onSuccess: async () => {
        setSelectedSkin(selectedSkin);
        setIsDrawerOpen(false);
        const { user } = await getUserConfig(userId!);

        if (user?.points) {
          setPoints(user?.points);
        }
        setButtonLoading(false);
      },
      onError: (error) => {
        setButtonLoading(false);
        console.error("Error buying skin:", error);
        toast.error("Error buying skin");
      }
    });
  };

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: ({ id, skin }: { id: any; skin: string }) =>
      setCurrentSkin(id, skin),

    onMutate: () => {
      toast.loading("Setting skin...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Skin set successfully!");
      router.push("/");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Failed to set skin.");
      console.error("Error setting skin:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-main-skin"] });
    },
  });

  const handleChooseSkin = (skin: SkinType) => {
    if (!skin.owned) {
      setIsDrawerOpen(true);
    } else {
      setButtonLoading(true);
      setIsDrawerOpen(false);
      mutate.mutate(
        { id: user, skin: skin.image },
        {
          onSuccess: () => {
            setButtonLoading(false);
            const linkWithId = user ? `/?id=${user}` : "/";
            router.push(linkWithId);
          },
          onError: (error) => {
            setButtonLoading(false);
            console.error("Error updating skin:", error);
          },
        }
      );
    }
  };


  // Function to determine the league based on points
const getLeague = (points: number): number => {
  for (let i = levelMinPoints.length - 1; i >= 0; i--) {
    if (points >= levelMinPoints[i]) {
      return levelMinPoints[i];
    }
  }
  return 0; // Default to Bronze if no match
};




  useEffect(() => {
    if (leftContainerRef.current) {
      setLeftContainerHeight(leftContainerRef.current.clientHeight);
    }
  }, [selectedSkin, skinsData]);

  return (
    <div className="h-full flex-grow">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {
          <>
            <div ref={leftContainerRef} className=" ">
              <figure>
                {isLoading ? (
                  <>
                    <Skeleton className="w-40 h-40" />
                  </>
                ) : (
                  <>
                    {selectedSkin && (
                      <>
                        <Image
                          src={selectedSkin.image}
                          alt={selectedSkin?.name}
                          className="w-full h-auto"
                          width={100}
                          height={100}
                        />
                      </>
                    )}
                  </>
                )}
              </figure>
              <h2 className="text-center text-xl font-bold mt-4">
                {selectedSkin?.name}
              </h2>
              <p className="text-center text-sm flex   items-center justify-center gap-3">
                <Image src={dollarCoin} alt="coin" width={20} height={20} />
                {selectedSkin?.cost}{" "}
              </p>
              <button
                onClick={() => handleChooseSkin(selectedSkin!)}
                
                className="mt-4 w-full py-2 bg-yellow-400 text-zinc-700 rounded-xl font-medium"
              >
                {selectedSkin?.owned ? "Choose" : "Unlock"}
              </button>
            </div>
            <div
              className="flex-grow overflow-y-auto max-h-full"
              style={{ maxHeight: leftContainerHeight }}
            >
              <div className="grid grid-cols-2 gap-2   grid-flow-row  overflow-y-auto ">
                {filteredSkins?.map((skin, index) => (
                  <div
                    key={index}
                    className={`relative  py-2 px-2 h-full rounded-lg bg-[#1d2025] ${
                      selectedSkin?.name === skin.name
                        ? "border-2 border-yellow-400 overflow-hidden"
                        : ""
                    }`}
                    onClick={() => setSelectedSkin(skin)}
                  >
                    <figure>
                      <Skeleton className="w-full h-full" />
                      <Image
                        src={skin.image}
                        alt={skin.name}
                        width={100}
                        height={100}
                        className="w-full h-auto mb-2"
                      />
                    </figure>
                    <p className="text-center mx-auto text-xs">{skin.name}</p>
                    {skin.owned ? (
                      <></>
                    ) : (
                      <>
                        <div className="absolute top-2 right-2 text-blue-500">
                          🔒
                        </div>

                        {getLeague(points) <= skin.cost && (
                          <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/50"></div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        }
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          {selectedSkin && (
            <DrawerContent className="bg-[#14161a] border-none ">
              <DrawerHeader
                onClick={() => setIsDrawerOpen(false)}
                className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
              >
                <div className="p-3 px-5 bg-[#1C1F23] rounded-full">x</div>
              </DrawerHeader>
              <div className="text-center">
                <Image
                  src={selectedSkin.image}
                  alt={selectedSkin.name}
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h2 className="text-2xl font-medium text-white mb-2">
                  {selectedSkin.name}
                </h2>
                <p className="text-white">
                  {selectedSkin.league !== levelNames[levelIndex] && (
                    <span className="text-yellow-400">
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
              </div>

              <DrawerFooter>
                <Button
                  disabled={
                    points < selectedSkin.cost ||
                    selectedSkin.league !== levelNames[levelIndex]
                  }
                  onClick={() => handleBuySkin(userId!, selectedSkin)}
                  className="w-full py-8 bg-yellow-400 text-zinc-700 text-xl rounded-lg hover:bg-yellow-700"
                >
                  {buttonLoading ? <div className="loader"></div> : "Buy"}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default Skinmini;
