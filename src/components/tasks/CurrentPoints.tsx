"use client";
import useExchangeStore from "@/store/useExchangeStore";
import PointsTracker from "../HeroSection/PointsTracker";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { formatNumber } from "../../../utils/formatNumber";

const CurrentPoints = ({ type }: { type?: "sm" }) => {
  const { exchange } = useExchangeStore();

  return (
    <div className="flex justify-between w-full border-2 border-white border-opacity-10 bg-white bg-opacity-10 rounded-xl p-3">
      <button className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-2">
          <Image src={exchange.icon} width={30} height={30} alt="coin" />
          {exchange.name}
        </span>
        <ChevronRight size={20} fontWeight={800}/>
      </button>
      <PointsTracker formatNumber={formatNumber} />
    </div>
  );
};

export default CurrentPoints;
