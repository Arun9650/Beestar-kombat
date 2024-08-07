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
  const user = window.localStorage.getItem("authToken");

  const { points, setPoints, setPPH } = usePointsStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [selectedCategory, setSelectedCategory] = useState<string>("PR&Team");
  const [cards, setCards] = useState<any[]>([]);
  const tabs = ["PR&Team", "Markets", "web3"];
  const [buttonLoading, setButtonLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = window.localStorage.getItem("authToken");
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
      console.log("🚀 ~ isEligibleToBuy ~ requiredCard:", requiredCard);
      return requiredCard.baseLevel >= team.requiredCardLevel;
    }
    return true;
  };

  const handleUpdateProfitPerHour = async (
    user: string,
    selectedTeam: Team
  ) => {
    if (selectedTeam) {
      setButtonLoading(true);
      const result = await updateProfitPerHour(user!, selectedTeam);
      if (result.success) {
        const userId = window.localStorage.getItem("authToken");
        const { combinedCards } = await allCards(userId!);
        setCards(combinedCards);
        setIsDrawerOpen(false);
        setButtonLoading(false);

        const { user } = await getUserConfig(userId!);
        setPoints(user?.points);
        setPPH(user?.profitPerHour);
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="p-4 flex flex-col items-center">
        <div className="flex justify-between my-2 py-2 px-4 rounded-xl w-full items-center  bg-[#292d32]">
          <h1 className="text-md font-semibold ">Daily Combo</h1>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">+5,000,000</span>
            <Image src={dollarCoin} alt="coin" className="w-6 h-6" />
          </div>
        </div>
        <div className="flex justify-between w-full mb-4">
          <div className="grid grid-cols-3 items-center w-full  justify-between  gap-2">
            <Image src={QuestionMark} alt="?" className="w-full h-full" />
            <Image src={QuestionMark} alt="?" className="w-full h-full" />
            <Image src={QuestionMark} alt="?" className="w-full h-full" />
          </div>
        </div>

        {/* cards start from here  */}
        <div className="flex flex-col items-center w-full">
          <Tabs defaultValue="PR&Team" className="w-full">
            <TabsList className="flex justify-around w-full bg-[#292d32] rounded-t-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={() => setSelectedCategory(tab)}
                  className="capitalize data-[state=active]:bg-[#1C1F23]  data-[state=active]:text-white text-white"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {loading ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mt-3 ">
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
                <div className="grid grid-cols-2 gap-4 ">
                  {filteredCards.map((team, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-[#272A2F] rounded-3xl"
                      onClick={() => handleTeamClick(team)}
                    >
                      <div className="flex items-center gap-4 border-b pb-2 ">
                        <Image
                          src={team.image}
                          alt={team.name}
                          width={50}
                          height={50}
                          className=" object-cover mb-2 rounded-lg"
                        />

                        <div className="flex flex-col justify-between gap-4">
                          <h3 className="text-white font-normal text-[0.7rem]">
                            {team.title}
                          </h3>
                          <p className="text-[#abadb2] text-[0.65rem] font-normal">
                            Profit per hour:
                            <br />
                            <span className="text-[#abadb2]">
                              +{parseFloat(team.basePPH).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mt-2 ">
                        <div className="border-r text-[.7rem]   text-center w-12">
                          lvl {team.baseLevel}
                        </div>
                        <div>
                          <p className="text-gray-400 ml-4 text-xs gap-1 flex items-center font-thin">
                            {isEligibleToBuy(team) ? (
                              <>
                                <Image
                                  src={dollarCoin}
                                  alt="coin"
                                  className="w-4 h-4"
                                />
                                <span className="text-white font-semibold">
                                  {formatNumber(team.baseCost)}{" "}
                                </span>
                              </>
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
                    className="w-full py-8 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700"
                  >
                    {buttonLoading ? "Loading" : "Go ahead"}
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
