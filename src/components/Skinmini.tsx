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
import { useRouter } from "next/navigation";

const Skinmini = ({ tab }: { tab: string }) => {
  const [selectedSkin, setSelectedSkin] = useState<SkinType>();
  const [skinsData, setSkinsData] = useState<SkinType[]>([]);
  const [leftContainerHeight, setLeftContainerHeight] = useState<number>(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const leftContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [userId, setUserId] = useState("");

  const [Loading, setLoading] = useState(true);
  const filteredSkins =
    tab === "featured" ? skinsData.filter((skin) => skin.featured) : skinsData;
  const { points, setPoints ,setSkin} = usePointsStore();

  useEffect(() => {
    // const userId = window.localStorage.getItem('userId');
    const userId = "1277432329";
    setUserId(userId!);
    const fetchSkins = async () => {
      //   const response = await getSkins();
      const userSkins = await SkinsToShow(userId!);
      const data = userSkins.combinedSkins;
      if (data) {
        setSkinsData(data!);
        setSelectedSkin(data[0]);
        setLoading(false);
      }
    };

    fetchSkins();
  }, []);

  const handleBuySkin = async (userId: string, selectedSkin: any) => {
    if (!selectedSkin) return;


    if(selectedSkin.owned){return}


    setButtonLoading(true);
    const id = selectedSkin.id;
    const localBalance = points;
    const chatId = userId;
    const result = await skinBuy({ id, localBalance, chatId });
    setButtonLoading(false);

    if (result.status === "success") {
      setSelectedSkin(selectedSkin);
      setIsDrawerOpen(false);

      toast.success("Skin Purchased");
      const userSkins = await SkinsToShow(userId!);
      const data = userSkins.combinedSkins;
      if (data) {
        setSkinsData(data!);

        const filter = data.filter((skin) => skin.id === id); 
        setSelectedSkin(filter[0]);
        const { user } = await getUserConfig(userId!);

        if (user?.points) {
          setPoints(user?.points);
        }
      }
    }
  };

  const handleChooseSkin = (skin: SkinType) => {
    if(!skin.owned){
      setIsDrawerOpen(true);
    }
    else{
      setIsDrawerOpen(false);
      router.push("/");
      setSkin(skin.image);
    }
  };

  useEffect(() => {
    if (leftContainerRef.current) {
      setLeftContainerHeight(leftContainerRef.current.clientHeight);
    }
  }, [selectedSkin, skinsData]);

  return (
    <div className="h-full flex-grow">
      <div className="grid grid-cols-2 gap-2">
        {
          <>
            <div ref={leftContainerRef} className=" ">
              <figure>
                {Loading ? (
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
                onClick={() =>   handleChooseSkin(selectedSkin!)}
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
                {filteredSkins.map((skin, index) => (
                  <div
                    key={index}
                    className={`relative  py-2 px-4 h-fit rounded-lg bg-[#1d2025] ${
                      selectedSkin?.name === skin.name
                        ? "border-2 border-yellow-400"
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
                    <p className="text-center text-xs">{skin.name}</p>
                    {skin.owned ? (
                      <></>
                    ) : (
                      <div className="absolute top-2 right-2 text-blue-500">
                        🔒
                      </div>
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
                  Profit per hour:
                  <br />
                  <span className="text-white  flex max-w-fit mx-auto gap-2">
                    <Image src={dollarCoin} alt="coin" width={20} height={20} />
                    +{selectedSkin.cost}
                  </span>
                </p>
              </div>

              <DrawerFooter>
                <Button
                  disabled={points < selectedSkin.cost}
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
