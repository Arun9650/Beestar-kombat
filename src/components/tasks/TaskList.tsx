"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/button";
import { CEO, dollarCoin, QuestionMark } from "../../../public/newImages";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { formatNumber } from "../../../utils/formatNumber";
import { getUserConfig, updateProfitPerHour } from "@/actions/user.actions";
import { allCards } from "@/actions/tasks.actions";
import { usePointsStore } from "@/store/PointsStore";
import { Skeleton } from "../ui/skeleton";

export interface Team {
  id: string;
  title: string;
  image: string;
  basePPH: number;
  baseCost: number;
  baseLevel: number;
  description?: string;
  requiredCardId?: number;
  requiredCardLevel?: number;
  requiredCardTitle?: string;
  category: string;
}

const TaskList = () => {
 

  const { points, setPoints, setPPH } = usePointsStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [selectedCategory, setSelectedCategory] = useState<string>("PR&Team");
  const [cards, setCards] = useState<any[]>([]);
  const tabs = ["PR&Team", "Markets", "web3"];
  const [buttonLoading, setButtonLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const userId = window.localStorage.getItem("authToken");
    setUser(userId);
    const fetchCards = async () => {
      const { combinedCards } = await allCards(userId!);
      setCards(combinedCards);
      setLoading(false);
    };

    fetchCards();
  }, []);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    const result = isEligibleToBuy(team);
    if (result) {
      setIsDrawerOpen(true);
    }
  };

  const filteredCards = cards.filter(
    (card) =>
      card.category === selectedCategory || card.cardType === selectedCategory
  );

  const isEligibleToBuy = (team: Team) => {
    if (team.requiredCardId && team.requiredCardLevel) {
      const requiredCard = cards.find(
        (card) =>
          card.id === team.requiredCardId || card.cardId === team.requiredCardId
      );
      return requiredCard.baseLevel >= team.requiredCardLevel;
    }
    return true;
  };

  const handleUpdateProfitPerHour = async (
    user: string,
    selectedTeam: Team
  ) => {
    if (selectedTeam) {

      const userId  = await getUserConfig(user!);

    if (userId?.user.points < selectedTeam.baseCost) {
      alert("Insufficient points to update the profit per hour.");
      return;
    }


      setButtonLoading(true);
      const result = await updateProfitPerHour(user!, selectedTeam);
      if (result.success) {
        const userId = window.localStorage.getItem("authToken");
        const { combinedCards } = await allCards(userId!);
        setCards(combinedCards);
        const { user } = await getUserConfig(userId!);
        setPoints(user?.points);
        setPPH(user?.profitPerHour);
        setIsDrawerOpen(false);
        setButtonLoading(false);
      } else {
        alert(result.message);
      }
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedCategory(tab);
  };

  return (
    <div className="flex flex-col items-center  pt-4 w-full">
      <div className=" flex flex-col items-center w-full px-4">
        {/* cards start from here  */}
        <div className="flex flex-col  items-center w-full">
          <Tabs
            onValueChange={(value) => handleTabChange(value)}
            defaultValue="PR&Team"
            className="w-full"
          >
            <TabsList className="flex  justify-around w-full p-2 bg-zinc-800  text-yellow-400  rounded-xl shadow-2xl border border-yellow-400">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize data-[state=active]:bg-yellow-400  data-[state=active]:text-zinc-800  w-full"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {loading ? (
              <div className="w-full ">
                <div className="grid grid-cols-2 gap-3 mt-3 ">
                  <Skeleton className="w-full h-20" />
                  <Skeleton className="w-full h-20" />
                  <Skeleton className="w-full h-20" />
                  <Skeleton className="w-full h-20" />
                </div>{" "}
              </div>
            ) : (
              <TabsContent
                value={selectedCategory}
                className="w-full   rounded-lg"
              >
                <div className="grid grid-cols-2 gap-3 ">
                  {filteredCards.map((team, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-[#1d2025] shadow-xl border border-yellow-400 bg-opacity-85 backdrop-blur-none  rounded-2xl"
                      onClick={() => handleTeamClick(team)}
                    >
                      <div className="flex items-center gap-4  pb-2 ">
                        <Image
                          src={team.image}
                          alt={team.name}
                          width={50}
                          height={50}
                          className="     rounded-md"
                        />

                        <div className="flex flex-col justify-between gap-1">
                          <h3 className="text-white font-normal text-[0.7rem]">
                            {team.title}
                          </h3>
                          <div className="text-[.7rem]">
                            lvl {team.baseLevel}
                          </div>
                        </div>
                      </div>
                      <p className="text-white  p-1 px-2 rounded-2xl  flex  justify-between text-[0.65rem] font-normal">
                        Profit per hour:
                        <br />
                        <span className="text-white">
                          +{parseFloat(team.basePPH).toFixed(2)}
                        </span>
                      </p>
                      <div className="flex items-center mt-2 ">
                        <div className="w-full">
                          <p className="text-gray-400  text-xs gap-1 flex items-center font-thin">
                            {isEligibleToBuy(team) ? (
                              <div className="bg-black/35 border-yellow-400 border p-1 rounded-2xl justify-center gap-2 flex w-full">
                                <Image
                                  src={dollarCoin}
                                  alt="coin"
                                  className="w-4 h-4"
                                />
                                <span className="text-white  font-semibold">
                                  {formatNumber(team.baseCost)}{" "}
                                </span>
                              </div>
                            ) : (
                              <>
                                <span className="text-white font-semibold">
                                  {team.requiredCardTitle}
                                  <br />
                                  lvl {team.requiredCardLevel}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
          <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            {selectedTeam && (
              <DrawerContent className="bg-[#14161a] border-none ">
                <DrawerHeader
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex text-white rounded-full justify-end  mr-0  w-full  items-center"
                >
                  <div className="p-3 px-5 bg-[#1C1F23] rounded-full">x</div>
                </DrawerHeader>
                <div className="text-center">
                  <Image
                    src={selectedTeam.image}
                    alt={selectedTeam.title}
                    width={100}
                    height={100}
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-2xl font-medium text-white mb-2">
                    {selectedTeam.title}
                  </h2>
                  <p className="text-white mb-4 max-w-96 font-light mx-auto">
                    {selectedTeam.description}
                  </p>
                  <p className="text-white">
                    Profit per hour:
                    <br />
                    <span className="text-white  flex max-w-fit mx-auto gap-2">
                      <Image
                        src={dollarCoin}
                        alt="coin"
                        width={20}
                        height={20}
                      />
                      +{selectedTeam.basePPH}
                    </span>
                  </p>
                  <p className="text-white my-4">
                    <span className="text-white text-3xl font-semibold flex items-center max-w-fit mx-auto gap-2">
                      <Image
                        src={dollarCoin}
                        alt="coin"
                        width={40}
                        height={40}
                      />
                      {selectedTeam.baseCost}{" "}
                    </span>
                  </p>
                </div>

                <DrawerFooter>
                  <Button
                    disabled={points < selectedTeam.baseCost}
                    onClick={() =>
                      handleUpdateProfitPerHour(user!, selectedTeam)
                    }
                    className="w-full py-8 bg-yellow-600 text-white text-xl rounded-lg hover:bg-yellow-700"
                  >
                    {buttonLoading ? (
                      <div className="loader"></div>
                    ) : (
                      "Go ahead"
                    )}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            )}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
